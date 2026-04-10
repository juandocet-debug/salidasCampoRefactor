import { clienteHttp } from '@/shared/api/clienteHttp';

export async function obtenerSalidasServicio() {
  const res = await clienteHttp.get('/api/salidas/core/');
  return res.data;
}

export async function crearSalidaServicio(payload) {
  const res = await clienteHttp.post('/api/salidas/core/', payload);
  return res.data;
}

export async function enviarSalidaServicio(id) {
  const res = await clienteHttp.post(`/api/salidas/core/${id}/enviar/`, {});
  return res.data;
}

export async function eliminarSalidaServicio(id) {
  const res = await clienteHttp.delete(`/api/salidas/core/${id}/`);
  return res.data;
}
import * as reglas from '@/features/salidas/dominio/reglas';


const distanciaKm = reglas.distanciaKm;
const distanciaMinAlaRuta = reglas.distanciaMinAlaRuta;
const buscarEnDiccionario = reglas.buscarEnDiccionario;

export async function geocodificar(nombre) {
    try {
        const q   = nombre.replace(/#/g, ' ');
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=co`,
            { headers: { 'User-Agent': 'OTIUM/1.0' } }
        );
        const data = await res.json();
        if (data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    } catch { /* ignore */ }
    return null;
}

// src/modulos/profesor/componentes/logistica/buscarEnRutaApis.js

export async function fetchGooglePlaces(qText, centro, isHotel, KEY, MAX_RADIO) {
    let dataMap = [];
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': KEY,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.priceLevel'
        },
        body: JSON.stringify({
            textQuery: qText,
            languageCode: 'es',
            locationBias: {
                circle: {
                    center: { latitude: centro.lat, longitude: centro.lng },
                    radius: Math.min(MAX_RADIO * 1000, 50000)
                }
            }
        })
    });

    if (res.ok) {
        const gData = await res.json();
        if (gData.places) {
            dataMap = gData.places.map(p => {
                let pLevel = -1;
                if (p.priceLevel === 'PRICE_LEVEL_INEXPENSIVE') pLevel = 0;
                else if (p.priceLevel === 'PRICE_LEVEL_MODERATE') pLevel = 1;
                else if (p.priceLevel === 'PRICE_LEVEL_EXPENSIVE') pLevel = 2;
                else if (p.priceLevel === 'PRICE_LEVEL_VERY_EXPENSIVE') pLevel = 3;

                let costoBase;
                if (isHotel) {
                    if (pLevel === 0) costoBase = 90000;
                    else if (pLevel === 1) costoBase = 180000;
                    else if (pLevel === 2) costoBase = 350000;
                    else if (pLevel === 3) costoBase = 700000;
                    else {
                        const r = p.rating || 3.5;
                        costoBase = Math.floor(r * 40000) + (p.displayName?.text?.length || 10) * 2000;
                    }
                } else {
                    if (pLevel >= 0) {
                        costoBase = [20000, 38000, 80000, 160000][pLevel];
                    } else {
                        const r = p.rating || 3.5;
                        costoBase = Math.min(Math.floor(r * 7000) + 10000, 38000);
                    }
                }

                return {
                    placeId: p.id,
                    nombre: p.displayName?.text || p.formattedAddress?.split(',')[0] || qText,
                    lat: p.location?.latitude,
                    lng: p.location?.longitude,
                    direccion: p.formattedAddress || '',
                    rating: p.rating || 0,
                    totalResenas: p.userRatingCount || 0,
                    foto: p.photos?.length > 0
                        ? `https://places.googleapis.com/v1/${p.photos[0].name}/media?maxHeightPx=300&maxWidthPx=300&key=${KEY}`
                        : '',
                    precioAprox: `~ $${costoBase.toLocaleString('es-CO')} COP`,
                    costoBase,
                };
            });
        }
    }
    return dataMap;
}

export async function fetchNominatim(qText, centro, delta, NOMINATIM) {
    let dataMap = [];
    const params = new URLSearchParams({
        q: qText, format: 'json', limit: '10',
        countrycodes: 'co',
        viewbox: `${centro.lng - delta},${centro.lat + delta},${centro.lng + delta},${centro.lat - delta}`,
        bounded: '1',
        'accept-language': 'es',
    });
    try {
        const res = await fetch(`${NOMINATIM}?${params}`, {
            headers: { 'User-Agent': 'OTIUM-Salidas/1.0' },
        });
        if (res.ok) {
            const nData = await res.json();
            dataMap = nData.map(r => ({
                placeId: `${r.lat}_${r.lon}`,
                nombre: r.display_name.split(',')[0].trim(),
                lat: parseFloat(r.lat),
                lng: parseFloat(r.lon),
                direccion: r.display_name.split(',').slice(1, 3).join(',').trim(),
                rating: 0,
                totalResenas: 0,
                foto: '',
                precioAprox: null,
                costoBase: null,
            }));
        }
    } catch { /* skip */ }
    return dataMap;
}

// src/modulos/profesor/componentes/logistica/buscarEnRuta.js
// ─────────────────────────────────────────────────────────────────────────────
// Segmenta la ruta cada SEGMENT_KM km y busca lugares en cada punto.
// Cada segmento es un centro de búsqueda: Google devuelve lugares a ≤ MAX_RADIO km.
// ─────────────────────────────────────────────────────────────────────────────


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

// buscarPueblos.js — Municipios en ruta: Backend Gemini proxy + Diccionario + OSRM fallback
// PRIORIDAD:
//  1. Backend Django /api/salidas/itinerario/ia/municipios/ -> llama Gemini server-side
//  2. Diccionario interno (rutas conocidas) → instantáneo si el backend falla
//  3. OSRM + Overpass → último recurso

const OSRM = 'https://router.project-osrm.org/route/v1/driving';
const OVERPASS = 'https://overpass-api.de/api/interpreter';
const _cache = new Map();
const _pending = new Set(); // Evitar llamadas duplicadas

// ─────────────────────────────────────────────────────────────────────────────
// BACKEND PROXY: Llama al backend Django que hace la llamada a Gemini server-side
// Sin 429, sin CORS, sin API key expuesta en el browser
// ─────────────────────────────────────────────────────────────────────────────
async function buscarConGemini(oriNombre, dstNombre) {
    const pKey = `${oriNombre}_${dstNombre}`;
    if (_pending.has(pKey)) return null;
    _pending.add(pKey);
    try {
        const res = await clienteHttp.post('/api/salidas/itinerario/ia/municipios/', {
            origen: oriNombre,
            destino: dstNombre
        });
        _pending.delete(pKey);
        const lista = res.data?.municipios || res.data;
        return Array.isArray(lista) && lista.length ? lista : null;
    } catch (e) {
        _pending.delete(pKey);
        console.error('[Pueblos] Error Detallado IA:', {
            mensaje: e.message,
            status: e.response?.status,
            data: e.response?.data
        });
        return null;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// OSRM + OVERPASS: Último recurso con coords del mapa
// ─────────────────────────────────────────────────────────────────────────────
async function filtrarConOverpass(roadPts, ori, dst) {
    const lats = roadPts.map(p => p.lat), lngs = roadPts.map(p => p.lng);
    const pad = 0.15;
    const bbox = [
        (Math.min(...lats) - pad).toFixed(5), (Math.min(...lngs) - pad).toFixed(5),
        (Math.max(...lats) + pad).toFixed(5), (Math.max(...lngs) + pad).toFixed(5),
    ].join(',');

    let nodos = [];
    try {
        const query = `[out:json][timeout:20];(node["place"~"^(city|town)$"]["name"](${bbox}););out body;`;
        const ctl = new AbortController();
        const tid = setTimeout(() => ctl.abort(), 20000);
        const res = await fetch(OVERPASS, {
            method: 'POST', body: `data=${encodeURIComponent(query)}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            signal: ctl.signal,
        });
        clearTimeout(tid);
        nodos = (await res.json())?.elements || [];
    } catch (e) { console.warn('[Pueblos] Overpass error:', e.message); return []; }

    const seen = new Set(), candidatos = [];
    for (const n of nodos) {
        if (!n.lat || !n.lon || !n.tags?.name) continue;
        if (seen.has(n.tags.name.toLowerCase())) continue;
        const kmOri = distanciaKm(ori.lat, ori.lng, n.lat, n.lon);
        const kmDst = distanciaKm(dst.lat, dst.lng, n.lat, n.lon);
        if (kmOri < 5 || kmDst < 5) continue;
        if (distanciaMinAlaRuta(n.lat, n.lon, roadPts) > 8) continue;
        seen.add(n.tags.name.toLowerCase());
        candidatos.push({ nombre: n.tags.name, depto: n.tags['addr:state'] || '', lat: n.lat, lng: n.lon, kmDesdeOrigen: Math.round(kmOri) });
    }
    return candidatos.sort((a, b) => a.kmDesdeOrigen - b.kmDesdeOrigen);
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export async function buscarPueblosEnRuta(puntosRuta, routeCoords = null) {
    const ori = puntosRuta[0], dst = puntosRuta[puntosRuta.length - 1];
    if (!ori || !dst) return [];

    const oriNombre = ori.nombre || '';
    const dstNombre = dst.nombre || '';
    const oriCoords = (ori.lat && ori.lng) ? ori : null;
    const dstCoords = (dst.lat && dst.lng) ? dst : null;
    if (!oriNombre && !oriCoords) return [];
    if (!dstNombre && !dstCoords) return [];

    const key = `${oriNombre}_${dstNombre}`;
    if (_cache.has(key)) return _cache.get(key);

    // ── ÚNICO ORIGEN: GEMINI (datos verídicos) ──────────────────────────
    const geminiLista = await buscarConGemini(oriNombre, dstNombre);
    if (geminiLista?.length) {
        const distApprox = (oriCoords && dstCoords)
            ? distanciaKm(oriCoords.lat, oriCoords.lng, dstCoords.lat, dstCoords.lng) : 300;
        const resultado = geminiLista.map((m, i) => {
            const nombre = typeof m === 'string' ? m : (m.nombre || 'Municipio');
            const depto = typeof m === 'string' ? '' : (m.depto || '');
            return {
                id: `g_${i}_${nombre}`,
                nombre,
                depto,
                lat: null, lng: null,
                kmDesdeOrigen: Math.round(((i + 1) / (geminiLista.length + 1)) * distApprox),
                prioridad: 2, foto: null, descripcion: null, wikiUrl: null, _enriquecido: false,
            };
        });
        _cache.set(key, resultado);
        return resultado;
    }

    // Si Gemini no disponible → vacío (no mostrar datos no verídicos)
    console.warn('[Pueblos] Gemini no disponible — no se muestran pueblos');
    return [];
}

async function obtenerRoadPts(ori, dst) {
    try {
        const url = `${OSRM}/${ori.lng},${ori.lat};${dst.lng},${dst.lat}?overview=full&geometries=geojson`;
        const data = await (await fetch(url)).json();
        if (data.code !== 'Ok') return [ori, dst];
        return data.routes[0].geometry.coordinates
            .filter((_, i) => i % 3 === 0)
            .map(c => ({ lat: c[1], lng: c[0] }));
    } catch { return [ori, dst]; }
}

// ─────────────────────────────────────────────────────────────────────────────
// FASE 2: Wikipedia lazy para la página visible
// ─────────────────────────────────────────────────────────────────────────────


// src/modulos/profesor/componentes/logistica/enriquecerPueblosData.js
// Extraido de buscarPueblos.js para cumplir con Clean Code

export async function enriquecerPueblos(pueblos) {
    const sinEnriquecer = pueblos.filter(p => !p._enriquecido);
    if (!sinEnriquecer.length) return pueblos;

    const enriquecidos = await Promise.all(sinEnriquecer.map(async (p) => {
        try {
            const q = `${p.nombre} ${p.depto || ''} Colombia`;
            const sd = await (await fetch(
                `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*&srlimit=1`
            )).json();
            const title = sd?.query?.search?.[0]?.title;
            if (!title) throw new Error('no result');
            const sd2 = await (await fetch(
                `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
            )).json();
            return {
                ...p,
                foto: sd2?.thumbnail?.source || null,
                descripcion: sd2?.extract ? sd2.extract.slice(0, 240) + '…' : `Municipio a ~${p.kmDesdeOrigen}km del origen.`,
                wikiUrl: sd2?.content_urls?.desktop?.page || null,
                _enriquecido: true,
            };
        } catch {
            return { ...p, descripcion: `Municipio a ~${p.kmDesdeOrigen}km del origen${p.depto ? `, ${p.depto}` : ''}.`, _enriquecido: true };
        }
    }));

    const porId = Object.fromEntries(enriquecidos.map(e => [e.id, e]));
    return pueblos.map(p => porId[p.id] ?? p);
}

export async function cargarSalidaParaEdicion(editarId, token) {
    const res = await clienteHttp.get(`/api/salidas/core/${editarId}/`);
    const data = res.data;

    const formData = {
        nombre: data.nombre || '',
        asignatura: data.asignatura || '',
        semestre: data.semestre || '2026-1',
        facultad: data.facultad || '',
        programa: data.programa || '',
        num_estudiantes: data.num_estudiantes || 0,
        fecha_inicio: data.fecha_inicio || '',
        fecha_fin: data.fecha_fin || '',
        hora_inicio: data.hora_inicio || '',
        hora_fin: data.hora_fin || '',
        justificacion: data.justificacion || '',
        resumen: data.resumen || '',
        relacion_syllabus: data.relacion_syllabus || '',
        icono: data.icono || 'IcoMountain',
        color: data.color || '#16a34a',
        objetivo_general: data.planeacion?.obj_general || '',
        estrategia_metodologica: data.planeacion?.metodologia || '',
        objetivos_especificos: data.planeacion?.objetivos?.map(o => o.descripcion).join('\n') || '',
        punto_partida: (data.puntos_ruta || []).filter(p => !p.es_retorno).find(p => p.motivo === 'origen' || p.motivo === 'viaje')?.nombre
            || data.punto_partida || '',
        parada_max: (() => {
            const ida = (data.puntos_ruta || []).filter(p => !p.es_retorno);
            if (ida.length > 0) return ida[ida.length - 1].nombre;
            return data.parada_max || '';
        })(),
        // Reconstruir puntos completos para el mapa: separar IDA y RETORNO
        _puntosRuta: (() => {
            const ida = (data.puntos_ruta || []).filter(p => !p.es_retorno);
            if (ida.length < 2) return undefined;
            return ida.map(p => ({
                nombre: p.direccion || p.nombre,
                nombreParada: p.nombre,
                lat: p.latitud,
                lng: p.longitud,
                motivo: p.motivo || '',
                tiempoEstimado: p.tiempo_estimado || '',
                actividad: p.actividad || '',
                esHospedaje: p.es_hospedaje || false,
                fechaProgramada: p.fecha_programada || '',
                horaProgramada: p.hora_programada || '',
                notasItinerario: p.notas_itinerario || '',
                icono: p.icono || '',
                color: p.color || '',
                esRetorno: false,
            }));
        })(),
        _puntosRetorno: (() => {
            const ret = (data.puntos_ruta || []).filter(p => p.es_retorno);
            if (ret.length < 2) return undefined;
            return ret.map(p => ({
                nombre: p.direccion || p.nombre,
                nombreParada: p.nombre,
                lat: p.latitud,
                lng: p.longitud,
                motivo: p.motivo || '',
                tiempoEstimado: p.tiempo_estimado || '',
                actividad: p.actividad || '',
                esHospedaje: p.es_hospedaje || false,
                fechaProgramada: p.fecha_programada || '',
                horaProgramada: p.hora_programada || '',
                notasItinerario: p.notas_itinerario || '',
                icono: p.icono || '',
                color: p.color || '',
                esRetorno: true,
            }));
        })(),
        criterios_evaluacion: data.criterios_evaluacion?.map(c => c.descripcion).join('\n') || '',
        productos_esperados: data.productos_esperados || '',
        // Datos de cálculo de costo (persistidos)
        distancia_total_km: data.distancia_total_km || 0,
        duracion_dias: data.duracion_dias || 1,
        horas_viaje: data.horas_viaje || 9,
        costo_estimado: data.costo_estimado || 0,
        tipo_vehiculo_calculo: data.tipo_vehiculo_calculo || 'bus',
    };

    return {
        formData,
        esGrupal: data.es_grupal || false,
        profesoresAsociados: data.profesores_asociados || [],
    };
}

/**
 * Envía el payload al backend (crear o actualizar).
 */
export async function enviarSalida(editarId, payload, token) {
    if (editarId) {
        await clienteHttp.patch(`/api/salidas/core/${editarId}/`, payload);
        return '¡Salida actualizada con éxito!';
    } else {
        await clienteHttp.post(`/api/salidas/core/`, payload);
        return '¡Salida creada con éxito!';
    }
}

/**
 * Extrae un mensaje de error legible desde la respuesta DRF.
 */

