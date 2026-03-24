// src/modulos/profesor/componentes/mapa/MapaRuta.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Mapa interactivo Leaflet + OSRM — marcadores con letras A, B, C…
// Fix: cancelToken previene race condition cuando el efecto corre antes que termine calcularRuta
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

const OSRM = 'https://router.project-osrm.org/route/v1/driving';
const BOGOTA = [4.6097, -74.0817];
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function MapaRuta({ puntos = [], onDistanciaCalculada }) {
    const mapRef = useRef(null);
    const instRef = useRef(null);
    const markRef = useRef([]);
    const routeRef = useRef(null);
    const cancelRef = useRef(false); // Cancela fetches colgados si el componente se desmonta

    // Inicializar mapa UNA sola vez
    useEffect(() => {
        if (instRef.current || !mapRef.current) return;
        cancelRef.current = false;
        try {
            instRef.current = L.map(mapRef.current, { zoomControl: false }).setView(BOGOTA, 6);
            // CartoDB Voyager — mapa moderno y limpio
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
            cancelRef.current = true; // Cancela cualquier fetch en vuelo
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
                const isOrigen = i === 0;
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

        if (validos.length >= 2) calcularRuta(validos, map);
        else onDistanciaCalculada?.({ distancia_km: 0, duracion_min: 0 });
    }, [puntos]);

    const calcularRuta = async (pts, map) => {
        try {
            const coords = pts.map(p => `${p.lng},${p.lat}`).join(';');
            const res = await fetch(`${OSRM}/${coords}?overview=full&geometries=geojson`);
            const data = await res.json();

            // Si el componente fue desmontado o el mapa destruido mientras esperábamos → salir
            if (cancelRef.current || !instRef.current || !instRef.current._container) return;

            if (data.code !== 'Ok' || !data.routes?.[0]) return;
            const r = data.routes[0];

            if (routeRef.current) {
                try { map.removeLayer(routeRef.current); } catch { /* ignore */ }
            }
            // Doble capa: glow azul + línea sólida encima
            const glowLayer = L.geoJSON(r.geometry, {
                style: { color: '#4A8DAC', weight: 10, opacity: 0.18, lineCap: 'round', lineJoin: 'round' },
            }).addTo(map);
            const lineLayer = L.geoJSON(r.geometry, {
                style: { color: '#345B8D', weight: 4, opacity: 0.9, lineCap: 'round', lineJoin: 'round' },
            }).addTo(map);
            routeRef.current = L.layerGroup([glowLayer, lineLayer]).addTo(map);

            onDistanciaCalculada?.({
                distancia_km: +(r.distance / 1000).toFixed(1),
                duracion_min: +(r.duration / 60).toFixed(0),
                // Coordenadas de la carretera real para búsqueda de municipios
                routeCoords: r.geometry.coordinates
                    .filter((_, i) => i % 5 === 0)
                    .map(c => ({ lat: c[1], lng: c[0] })),
            });
        } catch (e) { console.warn('OSRM error:', e); }
    };

    return <div ref={mapRef} className="mapa-ruta" />;
}
