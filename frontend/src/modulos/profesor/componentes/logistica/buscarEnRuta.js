// src/modulos/profesor/componentes/logistica/buscarEnRuta.js
// ─────────────────────────────────────────────────────────────────────────────
// Segmenta la ruta cada SEGMENT_KM km y busca lugares en cada punto.
// Cada segmento es un centro de búsqueda: Google devuelve lugares a ≤ MAX_RADIO km.
// ─────────────────────────────────────────────────────────────────────────────
import { distanciaKm, distanciaMinAlaRuta } from './hotelUtils';
import { fetchGooglePlaces, fetchNominatim } from './buscarEnRutaApis';

const MAX_RESULTADOS = 15;
const SEGMENT_KM = 80;       // Cada 80km → menos llamadas API, más rápido
const MAX_RADIO = 10;        // Radio de búsqueda Google: 10km (estricto, solo carretera)
const NOMINATIM = 'https://nominatim.openstreetmap.org/search';

const BUSCAR_TEXTO = {
    almuerzo: 'Restaurantes',
    refrigerio: 'Cafés',
    hospedaje: 'Hoteles',
    descanso_nocturno: 'Hoteles',
};

/**
 * Interpola un punto entre dos coordenadas según fracción t ∈ [0,1]
 */
function interpolar(a, b, t) {
    return {
        lat: a.lat + (b.lat - a.lat) * t,
        lng: a.lng + (b.lng - a.lng) * t,
    };
}

/**
 * Genera puntos de búsqueda cada SEGMENT_KM km a lo largo de la ruta.
 * Para hoteles: excluye los primeros 30% y últimos 15% (evita ciudades de salida y llegada).
 * Para comida: excluye solo los primeros 10km.
 */
function generarPuntosBusqueda(v, isHotel) {
    const ori = v[0];
    const dst = v[v.length - 1];
    const distTotal = distanciaKm(ori.lat, ori.lng, dst.lat, dst.lng);

    if (distTotal < 20) return []; // Ruta muy corta, no tiene sentido buscar

    const puntos = [];
    // Generar puntos cada SEGMENT_KM km
    const pasos = Math.floor(distTotal / SEGMENT_KM);

    for (let i = 1; i <= pasos; i++) {
        const pct = (i * SEGMENT_KM) / distTotal;
        if (pct >= 1.0) break;

        // Para hoteles: buscar solo entre 30% y 85% del trayecto
        if (isHotel && (pct < 0.30 || pct > 0.85)) continue;

        // Para comida: omitir el primer punto si está muy cerca al origen (< 10km)
        const pt = interpolar(ori, dst, pct);
        const distDesdeOrigen = distanciaKm(ori.lat, ori.lng, pt.lat, pt.lng);
        if (!isHotel && distDesdeOrigen < 10) continue;

        const kmDesdeOrigen = Math.round(pct * distTotal);
        puntos.push({
            ...pt,
            etiqueta: `~${kmDesdeOrigen}km desde origen`,
            pct,
        });
    }

    // Si no hay puntos (ruta muy corta o todos filtrados), agregar punto central
    if (puntos.length === 0) {
        const pctCentral = isHotel ? 0.65 : 0.5;
        const pt = interpolar(ori, dst, pctCentral);
        puntos.push({ ...pt, etiqueta: `Punto ${Math.round(pctCentral * 100)}% del viaje`, pct: pctCentral });
    }

    return puntos;
}

/**
 * Busca lugares a lo largo de la ruta, en segmentos de SEGMENT_KM km.
 * @param {string} motivo
 * @param {Array} puntos - puntosRuta [{lat, lng}, ...]
 * @param {object} rutaInfo - { distancia_km, duracion_min }
 */
export async function buscarLugaresEnRuta(motivo, puntos, rutaInfo = {}) {
    const qText = BUSCAR_TEXTO[motivo];
    if (!qText) return [];

    const v = puntos.filter(p => p.lat && p.lng);
    if (v.length < 2) return [];

    const isHotel = qText === 'Hoteles';
    const puntosBusqueda = generarPuntosBusqueda(v, isHotel);

    if (puntosBusqueda.length === 0) return [];

    const seen = new Set();
    const all = [];
    const KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

    const origin = v[0];
    const destination = v[v.length - 1];

    for (const centro of puntosBusqueda) {
        let dataMap = [];
        let usedGoogle = false;

        // 1. Google Places REST API
        if (KEY) {
            try {
                dataMap = await fetchGooglePlaces(qText, centro, isHotel, KEY, MAX_RADIO);
                usedGoogle = dataMap.length > 0;
            } catch (e) {
                console.warn('Google Places falló, intentando Nominatim', e);
            }
        }

        // 2. Fallback Nominatim
        if (!usedGoogle) {
            dataMap = await fetchNominatim(qText, centro, 0.3, NOMINATIM);
        }

        // 3. Filtrar resultados
        for (const item of dataMap) {
            if (!item.lat || !item.lng) continue;
            if (seen.has(item.placeId)) continue;
            seen.add(item.placeId);
            if (!item.nombre || item.nombre.length < 2) continue;

            // Escudo: hoteles no pueden estar en la ciudad de salida ni llegada
            if (isHotel) {
                const distOrigen = distanciaKm(origin.lat, origin.lng, item.lat, item.lng);
                const distDestino = distanciaKm(destination.lat, destination.lng, item.lat, item.lng);
                if (distOrigen < 30) continue;
                if (distDestino < 30) continue;
            } else {
                const distOrigen = distanciaKm(origin.lat, origin.lng, item.lat, item.lng);
                if (distOrigen < 10) continue; // No parar a comer recién saliendo

                // Filtro de precio: solo restaurantes asequibles (max $40.000 COP)
                if (item.costoBase && item.costoBase > 40000) continue;
            }

            // Solo incluir si está dentro del radio del punto de búsqueda
            const distAlCentro = distanciaKm(item.lat, item.lng, centro.lat, centro.lng);
            if (distAlCentro > MAX_RADIO) continue;

            // Filtro estricto: máximo 2km de distancia del trayecto real
            const distAlaTrayecto = distanciaMinAlaRuta(item.lat, item.lng, v);
            if (distAlaTrayecto > 2) continue;

            all.push({
                ...item,
                distRuta: Math.round(centro.pct * distanciaKm(origin.lat, origin.lng, destination.lat, destination.lng)),
                distAlCentro,
                tipo: motivo,
                etiqueta: centro.etiqueta,
            });
        }

        if (!usedGoogle) {
            await new Promise(r => setTimeout(r, 1100)); // Nominatim rate limit
        }
    }

    // Agrupar por segmento y tomar el mejor de cada uno (orden cronológico del viaje)
    const porSegmento = new Map();
    for (const item of all) {
        const segKey = item.etiqueta;
        if (!porSegmento.has(segKey)) {
            porSegmento.set(segKey, item);
        } else {
            // Preferir el de mejor calificación
            const actual = porSegmento.get(segKey);
            if ((item.rating || 0) > (actual.rating || 0)) {
                porSegmento.set(segKey, item);
            }
        }
    }

    // Ordenar cronológicamente por km desde origen
    return Array.from(porSegmento.values())
        .sort((a, b) => a.distRuta - b.distRuta)
        .slice(0, MAX_RESULTADOS);
}
