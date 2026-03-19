// buscarPueblos.js — Municipios en ruta: Backend Gemini proxy + Diccionario + OSRM fallback
// PRIORIDAD:
//  1. Backend Django /api/nucleo/municipios-en-ruta/ → llama Gemini server-side (sin 429)
//  2. Diccionario interno (rutas conocidas) → instantáneo si el backend falla
//  3. OSRM + Overpass → último recurso
import { distanciaKm, distanciaMinAlaRuta } from './hotelUtils';
import { buscarEnDiccionario } from './rutasConocidasDiccionario';

const API_MUNICIPIOS = 'http://localhost:8000/api/nucleo/municipios-en-ruta/';
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
        const res = await fetch(API_MUNICIPIOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ origen: oriNombre, destino: dstNombre }),
        });
        _pending.delete(pKey);
        if (!res.ok) { console.warn('[Pueblos] Backend error:', res.status); return null; }
        const data = await res.json();
        const lista = data?.municipios;
        console.log(`[Pueblos] Backend IA (Groq): ${lista?.length ?? 0} municipios`);
        return Array.isArray(lista) && lista.length ? lista : null;
    } catch (e) {
        _pending.delete(pKey);
        console.warn('[Pueblos] Backend no disponible:', e.message);
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
        const resultado = geminiLista.map((m, i) => ({
            id: `g_${i}_${m.nombre}`,
            nombre: m.nombre, depto: m.depto || '',
            lat: null, lng: null,
            kmDesdeOrigen: Math.round(((i + 1) / (geminiLista.length + 1)) * distApprox),
            prioridad: 2, foto: null, descripcion: null, wikiUrl: null, _enriquecido: false,
        }));
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
export { enriquecerPueblos } from './enriquecerPueblosData';
