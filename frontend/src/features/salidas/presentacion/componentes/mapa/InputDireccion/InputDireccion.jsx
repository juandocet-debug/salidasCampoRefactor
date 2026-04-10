// src/modulos/profesor/componentes/mapa/InputDireccion.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Autocompletado de direcciones con Google Places API.
// Da direcciones exactas en todo Colombia (lo mismo que usa Uber/Waze).
// Fallback a Nominatim si no hay API key.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useRef, useEffect, useCallback } from 'react';
import { cargarGoogleMaps } from '@/features/salidas/presentacion/componentes/mapa/utils/googleMapsLoader';
import './InputDireccion.css';

const NOMINATIM = 'https://nominatim.openstreetmap.org/search';

export default function InputDireccion({
    valor = '', onChange, placeholder = 'Buscar dirección…',
    label = '', icono = 'A', pais = 'co',
}) {
    const [texto, setTexto] = useState(valor);
    const [sugerencias, setSugerencias] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [abierto, setAbierto] = useState(false);
    const [idx, setIdx] = useState(-1);
    const [google, setGoogle] = useState(false);
    const timer = useRef(null);
    const wrap = useRef(null);
    const autoSvc = useRef(null);
    const placeSvc = useRef(null);
    const dummyDiv = useRef(null);

    useEffect(() => { setTexto(valor); }, [valor]);

    // ── Cargar Google Maps ───────────────────────────────────────────
    useEffect(() => {
        cargarGoogleMaps()
            .then(gm => {
                autoSvc.current = new gm.places.AutocompleteService();
                dummyDiv.current = document.createElement('div');
                placeSvc.current = new gm.places.PlacesService(dummyDiv.current);
                setGoogle(true);
            })
            .catch(() => setGoogle(false));
    }, []);

    // ── Cerrar al clic fuera ─────────────────────────────────────────
    useEffect(() => {
        const h = e => {
            if (wrap.current && !wrap.current.contains(e.target)) setAbierto(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    // ── Buscar con Google ────────────────────────────────────────────
    const buscarGoogle = useCallback(q => {
        if (!autoSvc.current || q.length < 3) { setSugerencias([]); return; }
        setCargando(true);
        autoSvc.current.getPlacePredictions({
            input: q,
            componentRestrictions: { country: pais },
        }, (preds, status) => {
            setCargando(false);
            if (status !== 'OK' || !preds) { setSugerencias([]); return; }
            setSugerencias(preds.map(p => ({
                placeId: p.place_id,
                nombre: p.description,
                corto: p.structured_formatting?.main_text || p.description.split(',')[0],
                detalle: p.structured_formatting?.secondary_text || '',
            })));
            setAbierto(true);
            setIdx(-1);
        });
    }, [pais]);

    // ── Buscar con Nominatim (fallback) ──────────────────────────────
    const buscarFallback = useCallback(async q => {
        if (q.length < 3) { setSugerencias([]); return; }
        setCargando(true);
        try {
            let limpio = q.replace(/#/g, ' ');
            if (/^(calle|carrera|cra|cl|kr|av|diagonal|transversal)/i.test(limpio) &&
                !/bogot|medell|cali|barran/i.test(limpio)) limpio += ', Bogotá, Colombia';
            const params = new URLSearchParams({
                q: limpio, format: 'json', addressdetails: '1', limit: '5',
                countrycodes: pais, 'accept-language': 'es',
            });
            const res = await fetch(`${NOMINATIM}?${params}`, {
                headers: { 'User-Agent': 'OTIUM/1.0' },
            });
            const data = await res.json();
            setSugerencias(data.map(d => ({
                nombre: d.display_name,
                lat: parseFloat(d.lat),
                lng: parseFloat(d.lon),
                corto: d.display_name.split(',').slice(0, 3).join(',').trim(),
                detalle: d.display_name,
            })));
            setAbierto(true);
            setIdx(-1);
        } catch { setSugerencias([]); }
        finally { setCargando(false); }
    }, [pais]);

    // ── Input change ─────────────────────────────────────────────────
    const handleChange = e => {
        const v = e.target.value;
        setTexto(v);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            google ? buscarGoogle(v) : buscarFallback(v);
        }, 200);
    };
    // ── Seleccionar ──────────────────────────────────────────────────
    const seleccionar = s => {
        setTexto(s.nombre);
        setAbierto(false);
        setSugerencias([]);

        if (google && s.placeId && placeSvc.current) {
            placeSvc.current.getDetails(
                { placeId: s.placeId, fields: ['geometry', 'formatted_address'] },
                (place, status) => {
                    if (status === 'OK' && place?.geometry?.location) {
                        const dir = place.formatted_address || s.nombre;
                        setTexto(dir);
                        onChange?.({
                            nombre: dir,
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                        });
                    } else {
                        // Fallback si la API de Google Maps no puede obtener los detalles (ej: sin billing)
                        onChange?.({ nombre: s.nombre, lat: null, lng: null });
                    }
                }
            );
        } else {
            onChange?.({ nombre: s.nombre, lat: s.lat || null, lng: s.lng || null });
        }
    };

    // ── Teclado ──────────────────────────────────────────────────────
    const handleKey = e => {
        if (!abierto || !sugerencias.length) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault(); setIdx(i => Math.min(i + 1, sugerencias.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault(); setIdx(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && idx >= 0) {
            e.preventDefault(); seleccionar(sugerencias[idx]);
        } else if (e.key === 'Escape') setAbierto(false);
    };

    return (
        <div className="idir" ref={wrap}>
            {label && <span className="idir__label">{label}</span>}
            <div className="idir__input-wrap">
                <span className="idir__circulo">{icono}</span>
                <input className="idir__input" type="text" value={texto}
                    onChange={handleChange} onKeyDown={handleKey}
                    onFocus={() => sugerencias.length > 0 && setAbierto(true)}
                    placeholder={placeholder} autoComplete="off" />
                {cargando && <span className="idir__spinner" />}
            </div>

            {abierto && sugerencias.length > 0 && (
                <ul className="idir__lista">
                    {sugerencias.map((s, i) => (
                        <li key={s.placeId || `${s.lat}-${s.lng}-${i}`}
                            className={`idir__item ${i === idx ? 'idir__item--on' : ''}`}
                            onMouseEnter={() => setIdx(i)}
                            onClick={() => seleccionar(s)}>
                            <span className="idir__item-nombre">{s.corto}</span>
                            <span className="idir__item-detalle">{s.detalle}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
