// src/modulos/profesor/componentes/mapa/MiniMapaParada.jsx
// Mini mapa que muestra la ruta completa A→B + paradas existentes + punto nuevo resaltado
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function MiniMapaParada({ lat, lng, nombre, puntosRuta = [], routeCoords = null }) {
    const mapRef = useRef(null);
    const instRef = useRef(null);
    const layersRef = useRef([]);

    // Inicializar mapa una sola vez
    useEffect(() => {
        if (!mapRef.current || instRef.current) return;
        instRef.current = L.map(mapRef.current, {
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false,
        }).setView([lat || 4.61, lng || -74.08], 10);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '© CARTO',
            subdomains: 'abcd',
            maxZoom: 19,
        }).addTo(instRef.current);

        return () => {
            try { instRef.current?.remove(); } catch { /* ignore */ }
            instRef.current = null;
        };
    }, []);

    // Redibujar cuando cambian los puntos o la ubicación seleccionada
    useEffect(() => {
        const map = instRef.current;
        if (!map) return;

        // Limpiar capas anteriores
        layersRef.current.forEach(l => { try { map.removeLayer(l); } catch { /* ignore */ } });
        layersRef.current = [];

        const allPoints = [];

        // 1️⃣ Dibujar ruta OSRM si existe
        if (routeCoords && routeCoords.length >= 2) {
            const latlngs = routeCoords.map(c => [c.lat, c.lng]);

            // Glow
            const glow = L.polyline(latlngs, {
                color: '#4A8DAC', weight: 8, opacity: 0.15,
                lineCap: 'round', lineJoin: 'round',
            }).addTo(map);
            // Línea sólida
            const line = L.polyline(latlngs, {
                color: '#345B8D', weight: 3, opacity: 0.85,
                lineCap: 'round', lineJoin: 'round',
            }).addTo(map);
            layersRef.current.push(glow, line);
        }

        // 2️⃣ Marcadores existentes (puntosRuta)
        const validos = puntosRuta.filter(p => p.lat && p.lng);
        validos.forEach((p, i) => {
            const isOrigen = i === 0;
            const isDestino = i === validos.length - 1;
            const bg = isOrigen ? '#16a34a' : isDestino ? '#dc2626' : '#64748b';
            const icon = L.divIcon({
                className: '',
                html: `<div style="
                    width:22px;height:22px;border-radius:50%;
                    background:${bg};color:#fff;
                    border:2.5px solid #fff;
                    box-shadow:0 1px 6px rgba(0,0,0,0.25);
                    display:flex;align-items:center;justify-content:center;
                    font-size:0.58rem;font-weight:800;font-family:Inter,sans-serif;
                ">${LETRAS[i] || '•'}</div>`,
                iconSize: [22, 22],
                iconAnchor: [11, 11],
            });
            const m = L.marker([p.lat, p.lng], { icon }).addTo(map);
            layersRef.current.push(m);
            allPoints.push([p.lat, p.lng]);
        });

        // 3️⃣ Punto nuevo (resaltado, más grande y azul OTIUM)
        if (lat && lng) {
            const newIcon = L.divIcon({
                className: '',
                html: `<div style="
                    width:32px;height:32px;border-radius:50%;
                    background:#4A8DAC;color:#fff;
                    border:3px solid #fff;
                    box-shadow:0 2px 12px rgba(74,141,172,0.55);
                    display:flex;align-items:center;justify-content:center;
                    font-size:1rem;
                ">📍</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
            });
            const newMarker = L.marker([lat, lng], { icon: newIcon })
                .addTo(map)
                .bindPopup(
                    `<b style="font-family:Inter,sans-serif;font-size:0.78rem;color:#4A8DAC">${nombre || 'Nueva parada'}</b>`,
                    { closeButton: false }
                )
                .openPopup();
            layersRef.current.push(newMarker);
            allPoints.push([lat, lng]);
        }

        // 4️⃣ Ajustar bounds a todos los puntos visibles
        if (allPoints.length >= 2) {
            try {
                map.fitBounds(L.latLngBounds(allPoints), { padding: [24, 24], maxZoom: 13 });
            } catch { /* ignore */ }
        } else if (allPoints.length === 1) {
            map.setView(allPoints[0], 13);
        }
    }, [lat, lng, nombre, puntosRuta, routeCoords]);

    if (!lat || !lng) return null;

    return (
        <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            height: '180px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 2px 12px rgba(74,141,172,0.1)',
            position: 'relative',
        }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            {/* Badge leyenda */}
            <div style={{
                position: 'absolute', bottom: 6, left: 8,
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(4px)',
                borderRadius: 6,
                padding: '3px 8px',
                fontSize: '0.62rem',
                fontWeight: 600,
                color: '#475569',
                zIndex: 999,
                pointerEvents: 'none',
                display: 'flex',
                gap: 8,
            }}>
                <span style={{ color: '#16a34a' }}>● Origen</span>
                <span style={{ color: '#4A8DAC' }}>📍 Nueva</span>
                <span style={{ color: '#dc2626' }}>● Destino</span>
            </div>
        </div>
    );
}
