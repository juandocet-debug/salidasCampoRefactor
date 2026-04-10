import React, { useState } from 'react';
import './TablaHistorico.css';

// SVG Icons
const IcoList = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
);

const IcoChevron = ({ abierto }) => (
    <svg
        width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
    >
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const IcoEditar = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const IcoEnviar = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const IcoBorrar = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
    </svg>
);

// ── Badge de estado ─────────────────────────────────────────────────────────
const ESTADO_CONFIG = {
    borrador:    { label: 'Borrador',    clase: 'borrador' },
    enviada:     { label: 'Enviada',     clase: 'enviada' },
    en_revision: { label: 'En Revisión', clase: 'proceso' },
    favorable:   { label: 'Favorable',   clase: 'aprobada' },
    aprobada:    { label: 'Aprobada',    clase: 'aprobada' },
    finalizada:  { label: 'Finalizada',  clase: 'finalizada' },
};

const estadoNormalizado = (e) => (e || 'borrador').toLowerCase();

// ── Formatear fecha ─────────────────────────────────────────────────────────
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const fmtFecha = (f) => {
    if (!f) return '—';
    const d = new Date(f + 'T00:00:00');
    return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
};

// ═════════════════════════════════════════════════════════════════════════════
const TablaHistorico = ({
    salidas = [],
    cargando = false,
    onEnviar,
    onEditar,
    onEliminar,
}) => {
    const [expandidoId, setExpandidoId] = useState(null);
    const toggleFila = (id) => setExpandidoId(expandidoId === id ? null : id);

    if (cargando) {
        return (
            <div className="tabla-historico">
                <div className="th-header">
                    <span className="th-titulo">Mis Salidas de Campo</span>
                </div>
                <div style={{ padding: '40px', color: '#64748b', textAlign: 'center' }}>
                    Cargando salidas...
                </div>
            </div>
        );
    }

    if (!salidas.length) {
        return (
            <div className="tabla-historico">
                <div className="th-header">
                    <span className="th-titulo">Mis Salidas de Campo</span>
                </div>
                <div style={{ padding: '40px', color: '#94a3b8', textAlign: 'center' }}>
                    No tienes salidas registradas aún.
                </div>
            </div>
        );
    }

    return (
        <div className="tabla-historico">
            <div className="th-header">
                <span className="th-titulo">Mis Salidas de Campo</span>
                <span className="th-ver-todos">{salidas.length} salida{salidas.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="th-lista">
                {salidas.map((item) => {
                    const esAbierto = expandidoId === item.id;
                    const est = estadoNormalizado(item.estado);
                    const cfg = ESTADO_CONFIG[est] || ESTADO_CONFIG.borrador;
                    const esBorrador = est === 'borrador';

                    return (
                        <div className={`th-item-container ${esAbierto ? 'th-item-container--abierto' : ''}`} key={item.id}>
                            <div className="th-item" onClick={() => toggleFila(item.id)}>
                                <div className="th-item__icono">
                                    <IcoList />
                                </div>
                                <div className="th-item__info">
                                    <h4 className="th-item__titulo">{item.nombre || 'Sin Nombre'}</h4>
                                    <span className="th-item__sub">
                                        {item.asignatura || 'Sin asignatura'}
                                        {item.num_estudiantes ? ` · ${item.num_estudiantes} estudiantes` : ''}
                                    </span>
                                </div>
                                <div className="th-item__meta">
                                    <span className="th-item__fecha">{fmtFecha(item.fecha_inicio)}</span>
                                    <span className={`th-item__badge th-item__badge--${cfg.clase}`}>
                                        {cfg.label}
                                    </span>

                                    {/* ── Acciones (solo borrador) ── */}
                                    {esBorrador && (
                                        <div className="th-item__acciones">
                                            <button
                                                className="th-btn-accion th-btn-accion--enviar"
                                                title="Enviar a revisión"
                                                onClick={(e) => { e.stopPropagation(); onEnviar?.(item); }}
                                            >
                                                <IcoEnviar />
                                            </button>
                                            <button
                                                className="th-btn-accion th-btn-accion--editar"
                                                title="Editar"
                                                onClick={(e) => { e.stopPropagation(); onEditar?.(item); }}
                                            >
                                                <IcoEditar />
                                            </button>
                                            <button
                                                className="th-btn-accion th-btn-accion--borrar"
                                                title="Eliminar"
                                                onClick={(e) => { e.stopPropagation(); onEliminar?.(item); }}
                                            >
                                                <IcoBorrar />
                                            </button>
                                        </div>
                                    )}

                                    <button className="th-btn-acordeon">
                                        <IcoChevron abierto={esAbierto} />
                                    </button>
                                </div>
                            </div>

                            {/* Panel Acordeón */}
                            <div className={`th-acordeon ${esAbierto ? 'th-acordeon--abierto' : ''}`}>
                                <div className="th-acordeon__contenido">
                                    <div className="th-acordeon__col">
                                        <span className="ac-label">Origen</span>
                                        <span className="ac-valor">{item.punto_partida || '—'}</span>
                                    </div>
                                    <div className="th-acordeon__col">
                                        <span className="ac-label">Destino</span>
                                        <span className="ac-valor">{item.parada_max || '—'}</span>
                                    </div>
                                    <div className="th-acordeon__col">
                                        <span className="ac-label">Fechas</span>
                                        <span className="ac-valor">
                                            {fmtFecha(item.fecha_inicio)} → {fmtFecha(item.fecha_fin)}
                                        </span>
                                    </div>
                                    <div className="th-acordeon__col">
                                        <span className="ac-label">Costo Estimado</span>
                                        <span className="ac-valor">
                                            {item.costo_estimado
                                                ? `$${Number(item.costo_estimado).toLocaleString('es-CO')}`
                                                : '—'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TablaHistorico;
