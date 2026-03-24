import React, { useState, useRef, useCallback } from 'react';
import { clienteHttp } from '@/shared/api/clienteHttp';
import useAutenticacion from '@/shared/hooks/useAutenticacion';
import { API_URL } from '@/shared/api/config';
import './BuscadorProfesores.css';

/**
 * BuscadorProfesores — Panel para buscar y seleccionar profesores asociados.
 * Se activa cuando el usuario marca "¿Salida grupal?".
 *
 * Props:
 *   esGrupal         : boolean
 *   setEsGrupal      : (bool) => void
 *   seleccionados    : [{ id, first_name, last_name, email }]
 *   setSeleccionados : (arr) => void
 */
export default function BuscadorProfesores({ esGrupal, setEsGrupal, seleccionados, setSeleccionados }) {
    const { token } = useAutenticacion();
    const [query, setQuery] = useState('');
    const [resultados, setResultados] = useState([]);
    const [buscando, setBuscando] = useState(false);
    const timerRef = useRef(null);

    // ── Debounced search ────────────────────────────────────────────────
    const buscar = useCallback((texto) => {
        clearTimeout(timerRef.current);
        if (texto.trim().length < 2) {
            setResultados([]);
            return;
        }
        timerRef.current = setTimeout(async () => {
            setBuscando(true);
            try {
                const res = await clienteHttp.get('/api/usuarios/buscar-profesores/', {
                    params: { q: texto.trim() },
                });
                // Filtrar profesores ya seleccionados
                const idsSeleccionados = new Set(seleccionados.map(p => p.id));
                setResultados(res.data.filter(p => !idsSeleccionados.has(p.id)));
            } catch {
                setResultados([]);
            } finally {
                setBuscando(false);
            }
        }, 350);
    }, [token, seleccionados]);

    const handleQueryChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        buscar(val);
    };

    const agregarProfesor = (prof) => {
        setSeleccionados([...seleccionados, prof]);
        setResultados(prev => prev.filter(p => p.id !== prof.id));
        setQuery('');
    };

    const quitarProfesor = (id) => {
        setSeleccionados(seleccionados.filter(p => p.id !== id));
    };

    const iniciales = (p) => {
        const f = (p.first_name || '?')[0];
        const l = (p.last_name || '?')[0];
        return `${f}${l}`.toUpperCase();
    };

    const nombreCompleto = (p) => {
        return `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.email;
    };

    return (
        <div className="bp-contenedor">
            {/* ── Toggle ─────────────────────────────────────── */}
            <div
                className={`bp-toggle-row ${esGrupal ? 'activo' : ''}`}
                onClick={() => setEsGrupal(!esGrupal)}
            >
                <label className="bp-switch" onClick={e => e.stopPropagation()}>
                    <input
                        type="checkbox"
                        checked={esGrupal}
                        onChange={() => setEsGrupal(!esGrupal)}
                    />
                    <span className="bp-switch__track" />
                </label>
                <div>
                    <div className="bp-toggle-label">¿Salida grupal?</div>
                    <div className="bp-toggle-desc">
                        Activa para agregar otros profesores a esta salida
                    </div>
                </div>
            </div>

            {/* ── Panel expandible ───────────────────────────── */}
            <div className={`bp-panel ${esGrupal ? 'abierto' : ''}`}>
                <div className="bp-panel-inner">
                    <div className="bp-panel-titulo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Profesores Asociados
                    </div>

                    {/* Chips de seleccionados */}
                    <div className="bp-seleccionados">
                        {seleccionados.length === 0 ? (
                            <span className="bp-vacio">Aún no has agregado profesores</span>
                        ) : (
                            seleccionados.map(prof => (
                                <div key={prof.id} className="bp-chip">
                                    <span className="bp-chip__avatar">{iniciales(prof)}</span>
                                    {nombreCompleto(prof)}
                                    <button
                                        type="button"
                                        className="bp-chip__quitar"
                                        onClick={() => quitarProfesor(prof.id)}
                                        title="Quitar"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Buscador */}
                    <div className="bp-busqueda-wrap">
                        <svg className="bp-busqueda-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            className="bp-busqueda-input"
                            placeholder="Buscar por nombre, cédula o correo..."
                            value={query}
                            onChange={handleQueryChange}
                        />
                    </div>

                    {/* Resultados */}
                    {buscando && (
                        <div className="bp-cargando">Buscando profesores…</div>
                    )}

                    {!buscando && query.length >= 2 && resultados.length === 0 && (
                        <div className="bp-sin-resultados">No se encontraron profesores</div>
                    )}

                    {resultados.length > 0 && (
                        <div className="bp-resultados">
                            {resultados.map(prof => (
                                <div
                                    key={prof.id}
                                    className="bp-resultado-item"
                                    onClick={() => agregarProfesor(prof)}
                                >
                                    <div className="bp-resultado-info">
                                        <span className="bp-resultado-nombre">{nombreCompleto(prof)}</span>
                                        <span className="bp-resultado-email">{prof.email}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="bp-resultado-agregar"
                                        onClick={(e) => { e.stopPropagation(); agregarProfesor(prof); }}
                                    >
                                        + Agregar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
