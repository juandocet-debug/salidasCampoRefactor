// src/modulos/profesor/componentes/mapa/ModalHospedajeHelpers.js
import { distanciaKm, distanciaMinAlaRuta } from '../logistica/hotelUtils';

const NOMINATIM = 'https://nominatim.openstreetmap.org';
const SEGMENT_KM = 50; // Buscar un pueblo cada ~50km del trayecto

function interpolar(a, b, t) {
    return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t };
}

export async function fetchWikipedia(nombre) {
    try {
        const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(nombre + ' municipio Colombia')}&format=json&origin=*&srlimit=1`;
        const sr = await fetch(searchUrl);
        const sd = await sr.json();
        const title = sd?.query?.search?.[0]?.title;
        if (!title) return null;

        const summUrl = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
        const sr2 = await fetch(summUrl);
        const sd2 = await sr2.json();
        return {
            descripcion: sd2?.extract ? sd2.extract.slice(0, 220) + '…' : null,
            foto: sd2?.thumbnail?.source || null,
            wikiUrl: sd2?.content_urls?.desktop?.page || null,
        };
    } catch {
        return null;
    }
}

export async function buscarPueblosEnRutaHospedaje(puntosRuta) {
    const v = puntosRuta.filter(p => p.lat && p.lng);
    if (v.length < 2) return [];

    const ori = v[0], dst = v[v.length - 1];
    const distTotal = distanciaKm(ori.lat, ori.lng, dst.lat, dst.lng);
    if (distTotal < 20) return [];

    const seen = new Set();
    const pueblos = [];
    const pasos = Math.max(1, Math.floor(distTotal / SEGMENT_KM));

    for (let i = 1; i <= pasos; i++) {
        const pct = Math.min(i / (pasos + 1), 0.95);
        const pt = interpolar(ori, dst, pct);
        const kmDesdeOrigen = Math.round(pct * distTotal);

        try {
            const url = `${NOMINATIM}/reverse?lat=${pt.lat}&lon=${pt.lng}&format=json&accept-language=es&zoom=10`;
            const res = await fetch(url, { headers: { 'User-Agent': 'OTIUM-Salidas/1.0' } });
            if (!res.ok) continue;
            const data = await res.json();

            const addr = data.address || {};
            const nombre = addr.city || addr.town || addr.village || addr.municipality || addr.county || data.display_name?.split(',')[0];
            const depto = addr.state || '';
            if (!nombre || seen.has(nombre)) continue;
            seen.add(nombre);

            const lat = parseFloat(data.lat);
            const lng = parseFloat(data.lon);

            const distRuta = distanciaMinAlaRuta(lat, lng, v);
            if (distRuta > 50) continue; 

            const wiki = await fetchWikipedia(nombre);

            pueblos.push({
                id: nombre,
                nombre,
                depto,
                lat, lng,
                kmDesdeOrigen,
                distRuta: Math.round(distRuta),
                descripcion: wiki?.descripcion || `Municipio ubicado a ~${kmDesdeOrigen}km del origen en el departamento de ${depto}.`,
                foto: wiki?.foto || null,
                wikiUrl: wiki?.wikiUrl || null,
            });

            await new Promise(r => setTimeout(r, 1000));
        } catch {
        }
    }

    return pueblos.sort((a, b) => a.kmDesdeOrigen - b.kmDesdeOrigen);
}
