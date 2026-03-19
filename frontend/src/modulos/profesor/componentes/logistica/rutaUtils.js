// src/modulos/profesor/componentes/logistica/rutaUtils.js
// ─────────────────────────────────────────────────────────────────────────────
// Utilidades puras (sin estado) para cálculo de tiempos y normalización de paradas.
// ─────────────────────────────────────────────────────────────────────────────

export const MAX_HORAS_CONDUCTOR = 10;

/** Parsear "45 min", "1h 30min", "2 horas" → minutos. */
export function parsearMinutos(texto) {
    if (!texto) return 0;
    const limpio = texto.toLowerCase().replace(/,/g, '.').trim();
    let total = 0;
    const mH = limpio.match(/([\d.]+)\s*(h|hora|horas)/);
    if (mH) total += parseFloat(mH[1]) * 60;
    const mM = limpio.match(/([\d.]+)\s*(m|min|minuto|minutos)/);
    if (mM) total += parseFloat(mM[1]);
    if (total === 0 && /^\d+(\.\d+)?$/.test(limpio)) total = parseFloat(limpio);
    return Math.round(total);
}

/** Formatear minutos → "1h 30min" o "45min". */
export function fmtTiempo(min) {
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

/** Calcular tiempos de un tramo (conducción + paradas + hospedaje). */
export function calcularTiemposTramo(puntos, duracionMin) {
    const paradas       = puntos.slice(1, -1);
    const minParadas    = paradas.reduce((a, p) => a + parsearMinutos(p.tiempoEstimado), 0);
    const minConduccion = duracionMin || 0;
    const totalMin      = minConduccion + minParadas;
    return {
        minConduccion, minParadas, totalMin,
        totalHoras: totalMin / 60,
        excede:     totalMin / 60 > MAX_HORAS_CONDUCTOR,
        tieneHospedaje: paradas.some(p => p.motivo === 'hospedaje' || p.motivo === 'descanso_nocturno'),
    };
}

/** Normalizar datos crudos de PantallaParada a un punto de ruta estandarizado. */
export function crearDatosParada(data, esRetorno) {
    return {
        nombre:          data.ubicacion     || data.nombre,
        lat:             data.lat,
        lng:             data.lng,
        motivo:          data.motivo,
        tiempoEstimado:  data.tiempoEstimado,
        actividad:       data.actividad,
        nombreParada:    data.nombre,
        fechaProgramada: data.fechaProgramada || null,
        horaProgramada:  data.horaProgramada  || null,
        notasItinerario: data.notasItinerario || '',
        icono:           data.icono           || '',
        color:           data.color           || '',
        esRetorno,
    };
}

/** Geocodificar un nombre de lugar con Nominatim (Colombia). */
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
