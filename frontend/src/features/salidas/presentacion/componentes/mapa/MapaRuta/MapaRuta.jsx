// src/modulos/profesor/componentes/mapa/MapaRuta.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Mapa interactivo Leaflet — marcadores con letras A, B, C…
// Distancia calculada con Haversine (sin OSRM) — no depende de ninguna API externa.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapaRuta.css';

// Fix íconos Leaflet/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

const BOGOTA = [4.6097, -74.0817];
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Haversine: distancia en km entre dos puntos {lat, lng} */
function haversine(a, b) {
    const R = 6371;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLng = (b.lng - a.lng) * Math.PI / 180;
    const sinLat = Math.sin(dLat / 2);
    const sinLng = Math.sin(dLng / 2);
    const c = 2 * Math.asin(Math.sqrt(
        sinLat * sinLat +
        Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * sinLng * sinLng
    ));
    return +(R * c).toFixed(1);
}

/** Distancia total de una lista de puntos usando Haversine */
function distanciaTotal(puntos) {
    let km = 0;
    for (let i = 0; i < puntos.length - 1; i++) {
        km += haversine(puntos[i], puntos[i + 1]);
    }
    return +km.toFixed(1);
}

export default function MapaRuta({ puntos = [], onDistanciaCalculada }) {
    const mapRef  = useRef(null);
    const instRef = useRef(null);
    const markRef = useRef([]);
    const routeRef = useRef(null);

    // Inicializar mapa UNA sola vez
    useEffect(() => {
        if (instRef.current || !mapRef.current) return;
        try {
            instRef.current = L.map(mapRef.current, { zoomControl: false }).setView(BOGOTA, 6);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap © CARTO',
                subdomains: 'abcd',
                maxZoom: 19,
            }).addTo(instRef.current);
            L.control.zoom({ position: 'bottomright' }).addTo(instRef.current);
        } catch (e) {
            console.warn('Leaflet init error:', e);
        }
        return () => {
            try { instRef.current?.remove(); } catch { /* ignore */ }
            instRef.current = null;
        };
    }, []);

    // Actualizar marcadores y ruta cuando cambian los puntos
    useEffect(() => {
        const map = instRef.current;
        if (!map) return;

        // Limpiar capas anteriores
        markRef.current.forEach(m => { try { map.removeLayer(m); } catch { /* ignore */ } });
        markRef.current = [];
        if (routeRef.current) {
            try { map.removeLayer(routeRef.current); } catch { /* ignore */ }
            routeRef.current = null;
        }

        const validos = puntos.filter(p => p.lat && p.lng);
        if (!validos.length) { map.setView(BOGOTA, 6); return; }

        // Marcadores: origen=verde, destino=rojo, paradas=teal
        validos.forEach((p, i) => {
            try {
                const isOrigen  = i === 0;
                const isDestino = i === validos.length - 1;
                const bgColor = isOrigen ? '#16a34a' : isDestino ? '#dc2626' : '#4A8DAC';
                const letra = LETRAS[i] || '•';
                const icon = L.divIcon({
                    className: 'mapa-marker-custom',
                    html: `<div class="mapa-marker-dot" style="background:${bgColor}">${letra}</div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                });
                const popupLabel = isOrigen ? 'Origen' : isDestino ? 'Destino' : 'Parada';
                const m = L.marker([p.lat, p.lng], { icon })
                    .addTo(map)
                    .bindPopup(`<div style="font-family:Inter,sans-serif;min-width:120px"><b style="color:${bgColor}">${letra}. ${p.nombreParada || p.nombre || 'Punto'}</b><br/><small style="color:#64748b">${popupLabel}</small></div>`);
                markRef.current.push(m);
            } catch { /* ignore */ }
        });

        try {
            map.fitBounds(L.latLngBounds(validos.map(p => [p.lat, p.lng])), { padding: [50, 50], maxZoom: 14 });
        } catch { /* ignore */ }

        if (validos.length >= 2) {
            let activo = true;
            const latlngsStr = validos.map(p => `${p.lng},${p.lat}`).join(';');
            const url = `https://router.project-osrm.org/route/v1/driving/${latlngsStr}?overview=full&geometries=geojson`;

            const attemptFetch = async () => {
                try {
                    let res = await fetch(url);
                    let data = await res.json();
                    
                    // Si OSRM falla (ej. NoRoute por un solo-sentido atrapado), probar el inverso
                    if (data.code !== 'Ok' && validos.length >= 2) {
                        const latlngsRev = [...validos].reverse().map(p => `${p.lng},${p.lat}`).join(';');
                        const urlRev = `https://router.project-osrm.org/route/v1/driving/${latlngsRev}?overview=full&geometries=geojson`;
                        const resRev = await fetch(urlRev);
                        const dataRev = await resRev.json();
                        if (dataRev.code === 'Ok') {
                            // Invertir coordenadas del dibujo para que fluya del origen al destino
                            dataRev.routes[0].geometry.coordinates.reverse();
                            data = dataRev;
                        }
                    }
                    return data;
                } catch (e) {
                    return { code: 'Error' };
                }
            };

            attemptFetch()
                .then(data => {
                    if (!activo || !instRef.current) return;
                    let routePts = [];
                    let km = 0;

                    if (data.code === 'Ok') {
                        routePts = data.routes[0].geometry.coordinates.map(c => ({ lat: c[1], lng: c[0] }));
                        km = data.routes[0].distance / 1000;
                    } else {
                        routePts = validos.map(p => ({ lat: p.lat, lng: p.lng }));
                        km = distanciaTotal(validos);
                    }

                    try {
                        const pts = routePts.map(p => [p.lat, p.lng]);
                        const glowLayer = L.polyline(pts, { color: '#4A8DAC', weight: 10, opacity: 0.18, lineCap: 'round', lineJoin: 'round' }).addTo(map);
                        const lineLayer = L.polyline(pts, { color: '#345B8D', weight: 4,  opacity: 0.9,  lineCap: 'round', lineJoin: 'round' }).addTo(map);
                        routeRef.current = L.layerGroup([glowLayer, lineLayer]).addTo(map);
                        map.fitBounds(L.latLngBounds(pts), { padding: [50, 50], maxZoom: 14 });
                    } catch { /* ignore */ }

                    onDistanciaCalculada?.({
                        distancia_km: +km.toFixed(1),
                        duracion_min: 0,
                        routeCoords: routePts,
                    });
                })
                .catch(() => {
                    if (!activo || !instRef.current) return;
                    const km = distanciaTotal(validos);
                    const pts = validos.map(p => [p.lat, p.lng]);
                    try {
                        const glowLayer = L.polyline(pts, { color: '#4A8DAC', weight: 10, opacity: 0.18, lineCap: 'round', lineJoin: 'round' }).addTo(map);
                        const lineLayer = L.polyline(pts, { color: '#345B8D', weight: 4,  opacity: 0.9,  lineCap: 'round', lineJoin: 'round' }).addTo(map);
                        routeRef.current = L.layerGroup([glowLayer, lineLayer]).addTo(map);
                        map.fitBounds(L.latLngBounds(pts), { padding: [50, 50], maxZoom: 14 });
                    } catch { /* ignore */ }

                    onDistanciaCalculada?.({
                        distancia_km: km,
                        duracion_min: 0,
                        routeCoords: validos.map(p => ({ lat: p.lat, lng: p.lng })),
                    });
                });

            return () => { activo = false; };
        } else {
            onDistanciaCalculada?.({ distancia_km: 0, duracion_min: 0 });
        }
    }, [puntos]);

    return <div ref={mapRef} className="mapa-ruta" />;
}
