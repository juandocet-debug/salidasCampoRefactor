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
    pendiente_ajuste: { label: 'Pendiente Ajuste', clase: 'riesgo' },
    rechazada:   { label: 'Rechazada',   clase: 'peligro' }
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
    onVerDictamen,
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
                                <div className="th-item__meta" style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, justifyContent: 'flex-end' }}>
                                    
                                    {/* ── Mini Stepper de Progreso ── */}
                                    <div className="th-mini-stepper" style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.9 }}>
                                        {(() => {
                                            const tieneConsejo = Boolean(item.decision_consejo);
                                            const etapas = [
                                                { id: 1, name: 'Borrador', states: ['borrador'] },
                                                { id: 2, name: 'Coordinación', states: tieneConsejo
                                                    ? ['enviada', 'en_revision', 'rechazada']
                                                    : ['enviada', 'en_revision', 'rechazada', 'pendiente_ajuste'] },
                                                { id: 3, name: 'Consolidado', states: tieneConsejo
                                                    ? ['favorable', 'ajustada', 'favorable_con_ajustes', 'pendiente_ajuste']
                                                    : ['favorable', 'ajustada', 'favorable_con_ajustes'] },
                                                { id: 4, name: 'Logística', states: ['aprobada', 'en_preparacion'] },
                                                { id: 5, name: 'Ejecución', states: ['en_ejecucion', 'finalizada', 'cerrada'] },
                                            ];
                                            return etapas;
                                        })().map((etapa, idx, arr) => {

                                            const uiOrden = arr.findIndex(e => e.states.includes(est)) + 1 || 1;
                                            const isActive = uiOrden === etapa.id;
                                            const isPast = uiOrden > etapa.id;
                                            
                                            return (
                                                <React.Fragment key={etapa.id}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                                        <div style={{ 
                                                            width: isActive ? '12px' : '8px', 
                                                            height: isActive ? '12px' : '8px', 
                                                            borderRadius: '50%',
                                                            background: isPast ? '#10b981' : isActive ? '#3b82f6' : '#e2e8f0',
                                                            boxShadow: isActive ? '0 0 0 3px rgba(59,130,246,0.2)' : 'none',
                                                            transition: 'all 0.3s'
                                                        }} title={etapa.name} />
                                                        {isActive && <span style={{ fontSize: '9px', fontWeight: '800', color: '#3b82f6', position: 'absolute', transform: 'translateY(16px)', letterSpacing: '0.5px' }}>{etapa.name.substring(0,5).toUpperCase()}</span>}
                                                    </div>
                                                    {idx < arr.length - 1 && (
                                                        <div style={{ width: '16px', height: '2px', background: isPast ? '#10b981' : '#e2e8f0', borderRadius: '1px' }} />
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </div>

                                    <span className="th-item__fecha" style={{ minWidth: '80px', textAlign: 'right' }}>{fmtFecha(item.fecha_inicio)}</span>
                                    
                                    {/* ── Smart Badge Contextual ── */}
                                    {(() => {
                                        let b_text = cfg.label;
                                        let b_actor = '';
                                        let b_emoji = '';
                                        
                                        if (est === 'favorable') { b_text = 'Favorable'; b_actor = 'Coordinación'; b_emoji = '✅'; }
                                        else if (est === 'favorable_con_ajustes') { b_text = 'Con Ajustes'; b_actor = 'Coordinación'; b_emoji = '✅'; }
                                        else if (est === 'pendiente_ajuste') {
                                            if (item.decision_consejo) {
                                                b_text = 'Ajustes Req.'; b_actor = 'Consejo'; b_emoji = '⚠️';
                                            } else {
                                                b_text = 'Ajustes Req.'; b_actor = 'Coordinación'; b_emoji = '⚠️';
                                            }
                                        }
                                        else if (est === 'rechazada') { b_text = 'Improcedente'; b_actor = 'Coordinación'; b_emoji = '🚫'; }
                                        else if (est === 'en_revision') { b_text = 'Evaluando'; b_actor = 'Coordinador'; b_emoji = '⏳'; }
                                        else if (est === 'aprobada') { b_text = 'Aprobada'; b_actor = 'Logística'; b_emoji = '🎯'; }
                                        else if (est === 'borrador') { b_text = 'Borrador'; b_actor = 'Profesor'; b_emoji = '📝'; }
                                        else if (est === 'enviada') { b_text = 'Enviada'; b_actor = 'Sistema'; b_emoji = '📨'; }

                                        return (
                                            <div className={`th-item__badge th-item__badge--${cfg.clase}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px' }}>
                                                {b_emoji && <span style={{ fontSize: '12px' }}>{b_emoji}</span>}
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
                                                    <span style={{ fontSize: '11px', fontWeight: '800' }}>{b_text}</span>
                                                    {b_actor && <span style={{ fontSize: '9px', fontWeight: '600', opacity: 0.75, letterSpacing: '0.2px' }}>{b_actor}</span>}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    
                                    {/* Etiqueta de Feedback si tiene revision y fue devuelta */}
                                    {(item.ultima_revision || item.decision_consejo) && (est === 'pendiente_ajuste' || est === 'rechazada') && (
                                        <div 
                                            onClick={(e) => { e.stopPropagation(); onVerDictamen?.(item); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', background: est === 'rechazada' ? '#fee2e2' : '#fef3c7', padding: '6px 12px', borderRadius: '20px', border: `1px solid ${est === 'rechazada' ? '#f87171' : '#fbbf24'}` }}
                                        >
                                            <svg width="14" height="14" fill="none" stroke={est === 'rechazada' ? '#991b1b' : '#b45309'} strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                            <span style={{ color: est === 'rechazada' ? '#991b1b' : '#b45309', fontWeight: '800', fontSize: '10px', letterSpacing: '0.5px' }}>
                                                {item.decision_consejo ? 'VER CONCEPTO CONSEJO' : 'VER CONCEPTO'}
                                            </span>
                                        </div>
                                    )}


                                    {/* ── Acciones (editar/borrar si no ha escalado irremediablemente) ── */}
                                    {(est === 'borrador' || est === 'pendiente_ajuste' || est === 'rechazada') && (
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

                                    <button className="th-btn-acordeon" style={{ marginLeft: '6px' }}>
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
