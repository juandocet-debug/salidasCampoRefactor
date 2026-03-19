// src/modulos/profesor/componentes/logistica/hotelUtils.js
// ─────────────────────────────────────────────────────────────────────────────
// Utilidades para búsqueda de hoteles: distancias, puntos de ruta, etc.
// ─────────────────────────────────────────────────────────────────────────────

export const PRECIO_LABELS = ['Gratis', '$ Económico', '$$ Moderado', '$$$ Costoso', '$$$$ Premium'];
export const PRECIO_COLORS = ['#10b981', '#22c55e', '#f59e0b', '#f97316', '#ef4444'];
export const MAX_DIST_KM = 60;

/** Distancia Haversine en km. */
export function distanciaKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Punto interpolado al ~65% de la ruta para buscar hoteles. */
export function puntoParaHospedaje(puntos) {
    const validos = puntos.filter(p => p.lat && p.lng);
    if (validos.length < 2) return null;
    const ori = validos[0], dst = validos[validos.length - 1];
    return { lat: ori.lat + (dst.lat - ori.lat) * 0.65, lng: ori.lng + (dst.lng - ori.lng) * 0.65 };
}

/** Distancia mínima de un punto a cualquier nodo de la ruta. */
export function distanciaMinAlaRuta(lat, lng, puntos) {
    const validos = puntos.filter(p => p.lat && p.lng);
    let min = Infinity;
    for (const p of validos) {
        const d = distanciaKm(lat, lng, p.lat, p.lng);
        if (d < min) min = d;
    }
    return min;
}

/** Normaliza resultado de Google Places a formato limpio. */
export function normalizarHotel(r, puntosRuta) {
    return {
        placeId: r.place_id,
        nombre: r.name,
        direccion: r.vicinity || '',
        rating: r.rating || 0,
        totalResenas: r.user_ratings_total || 0,
        precioNivel: r.price_level ?? -1,
        lat: r.geometry.location.lat(),
        lng: r.geometry.location.lng(),
        distRuta: distanciaMinAlaRuta(r.geometry.location.lat(), r.geometry.location.lng(), puntosRuta),
    };
}
