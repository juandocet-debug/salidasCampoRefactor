import React, { useState, useEffect, useCallback } from 'react';
import { CardKPI } from '../../../shared/componentes/generales/Tarjetas/Tarjetas';
import { obtenerSalidasEnEjecucion } from '../aplicacion/servicios';

// ─── Helpers ────────────────────────────────────────────────────────────────

const ESTADO_CONFIG = {
    en_ejecucion:   { label: 'En Ejecución',   bg: '#dcfce7', color: '#15803d' },
    preembarque:    { label: 'Pre-embarque',    bg: '#f3e8ff', color: '#7e22ce' },
    lista_ejecucion:{ label: 'Lista / Agendada',bg: '#e0f2fe', color: '#0369a1' },
    en_preparacion: { label: 'En Preparación', bg: '#fef9c3', color: '#854d0e' },
};

const estadoChip = (estado) => {
    const cfg = ESTADO_CONFIG[estado] ?? { label: estado, bg: '#f1f5f9', color: '#475569' };
    return (
        <span style={{
            background: cfg.bg, color: cfg.color,
            padding: '3px 10px', borderRadius: 20,
            fontSize: 11, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
            {estado === 'en_ejecucion' && (
                <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#22c55e', display: 'inline-block',
                    animation: 'pulse 1.5s infinite',
                }} />
            )}
            {cfg.label}
        </span>
    );
};

// ─── Componente principal ────────────────────────────────────────────────────

const MonitoreoEjecucionPanel = () => {
    const [salidas, setSalidas]     = useState([]);
    const [cargando, setCargando]   = useState(true);
    const [error, setError]         = useState(null);
    const [busqueda, setBusqueda]   = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [expandidoId, setExpandidoId]  = useState(null);

    const cargar = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            const data = await obtenerSalidasEnEjecucion();
            setSalidas(data);
        } catch (e) {
            setError('No se pudieron cargar las salidas en ejecución.');
            setSalidas([]);
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    // KPIs
    const total      = salidas.length;
    const enCurso    = salidas.filter(s => s.estado === 'en_ejecucion').length;
    const preembarque = salidas.filter(s => s.estado === 'preembarque').length;
    const agendadas  = salidas.filter(s => s.estado === 'lista_ejecucion').length;

    // Filtros
    const facultades = [...new Set(salidas.map(s => s.facultad).filter(Boolean))].sort();
    const [filtroFacultad, setFiltroFacultad] = useState('');

    const salidasFiltradas = salidas.filter(s => {
        const q = busqueda.toLowerCase();
        const matchBusqueda = !busqueda || [s.codigo, s.nombre, s.asignatura, s.profesor_nombre]
            .some(v => (v || '').toLowerCase().includes(q));
        const matchEstado   = !filtroEstado   || s.estado === filtroEstado;
        const matchFacultad = !filtroFacultad || s.facultad === filtroFacultad;
        return matchBusqueda && matchEstado && matchFacultad;
    });

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, color: '#0f172a', margin: '0 0 4px' }}>
                    Monitoreo en Ejecución
                </h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>
                    Salidas que han iniciado o están próximas a ejecutarse.
                </p>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                <CardKPI
                    label="Total Activas"
                    value={cargando ? '—' : total}
                    icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>}
                    iconBg="#eff6ff" iconColor="#3b82f6"
                />
                <CardKPI
                    label="En Ejecución"
                    value={cargando ? '—' : enCurso}
                    icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>}
                    iconBg="#dcfce7" iconColor="#16a34a"
                />
                <CardKPI
                    label="Pre-embarque"
                    value={cargando ? '—' : preembarque}
                    icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>}
                    iconBg="#f3e8ff" iconColor="#7e22ce"
                />
                <CardKPI
                    label="Agendadas"
                    value={cargando ? '—' : agendadas}
                    icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
                    iconBg="#e0f2fe" iconColor="#0369a1"
                />
            </div>

            {/* Error banner */}
            {error && (
                <div style={{ marginBottom: 16, padding: '10px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#dc2626', fontSize: 13, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span>⚠️ {error}</span>
                    <button onClick={cargar} style={{ marginLeft: 'auto', padding: '4px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                        Reintentar
                    </button>
                </div>
            )}

            {/* Barra de filtros */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16, justifyContent: 'flex-end' }}>
                {/* Buscar */}
                <div style={{ position: 'relative', width: 280 }}>
                    <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input
                        type="text"
                        placeholder="Buscar por código, nombre o docente..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        style={{ width: '100%', padding: '10px 16px 10px 38px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>

                {/* Filtro estado */}
                <select
                    value={filtroEstado}
                    onChange={e => setFiltroEstado(e.target.value)}
                    style={{ padding: '0 12px', border: '1px solid #e2e8f0', borderRadius: 8, height: 40, fontSize: 13, color: filtroEstado ? '#0f172a' : '#94a3b8', outline: 'none', background: 'white', cursor: 'pointer' }}
                >
                    <option value="">Todos los estados</option>
                    <option value="en_ejecucion">En Ejecución</option>
                    <option value="preembarque">Pre-embarque</option>
                    <option value="lista_ejecucion">Lista / Agendada</option>
                    <option value="en_preparacion">En Preparación</option>
                </select>

                {/* Filtro facultad */}
                <select
                    value={filtroFacultad}
                    onChange={e => setFiltroFacultad(e.target.value)}
                    style={{ padding: '0 12px', border: '1px solid #e2e8f0', borderRadius: 8, height: 40, fontSize: 13, color: filtroFacultad ? '#0f172a' : '#94a3b8', outline: 'none', background: 'white', cursor: 'pointer' }}
                >
                    <option value="">Todas las Facultades</option>
                    {facultades.map(f => <option key={f} value={f}>{f}</option>)}
                </select>

                {/* Recargar */}
                <button
                    onClick={cargar}
                    title="Actualizar datos"
                    style={{ height: 40, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', borderRadius: 8, background: 'white', cursor: 'pointer', color: '#64748b', flexShrink: 0 }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
                </button>

                {/* Limpiar filtros */}
                {(busqueda || filtroEstado || filtroFacultad) && (
                    <button
                        onClick={() => { setBusqueda(''); setFiltroEstado(''); setFiltroFacultad(''); }}
                        style={{ height: 40, padding: '0 14px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc', color: '#475569', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        Limpiar
                    </button>
                )}
            </div>

            {/* Tabla */}
            <div className="herr-tabla-wrapper">
                <table className="herr-tabla">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre / Docente</th>
                            <th>Facultad</th>
                            <th>Fecha Inicio</th>
                            <th>Destino</th>
                            <th>Estudiantes</th>
                            <th>Estado</th>
                            <th>Transporte</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr><td colSpan="8"><div className="herr-vacio">Cargando salidas en ejecución...</div></td></tr>
                        ) : salidasFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan="8">
                                    <div className="herr-vacio" style={{ padding: '48px 24px', textAlign: 'center' }}>
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" style={{ marginBottom: 12 }}>
                                            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                                        </svg>
                                        <div style={{ color: '#94a3b8', fontSize: 14 }}>
                                            {salidas.length === 0
                                                ? 'No hay salidas en ejecución actualmente.'
                                                : 'Ninguna salida coincide con los filtros.'}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : salidasFiltradas.map(s => {
                            const isExpanded = expandidoId === s.id;
                            return (
                                <React.Fragment key={s.id}>
                                    <tr
                                        style={{
                                            cursor: 'pointer',
                                            background: isExpanded ? '#f8fafc'
                                                : s.estado === 'en_ejecucion' ? '#f0fdf4'
                                                : s.estado === 'preembarque'  ? '#faf5ff'
                                                : 'transparent',
                                            borderBottom: isExpanded ? 'none' : '1px solid #e2e8f0',
                                            transition: 'background 0.2s',
                                        }}
                                        onClick={() => setExpandidoId(isExpanded ? null : s.id)}
                                    >
                                        {/* Código */}
                                        <td>
                                            <code style={{ background: '#f1f5f9', padding: '2px 7px', borderRadius: 4, fontSize: 12 }}>
                                                {s.codigo}
                                            </code>
                                        </td>

                                        {/* Nombre + docente */}
                                        <td>
                                            <div style={{ fontWeight: 600, color: '#1e293b' }}>{s.nombre}</div>
                                            {s.nota_cambio && (
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4, padding: '3px 8px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 6, fontSize: 10, fontWeight: 600, color: '#b91c1c' }}>
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                                    {s.nota_cambio}
                                                </div>
                                            )}
                                            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                                                👨‍🏫 {s.profesor_nombre || 'Docente'}
                                            </div>
                                        </td>

                                        {/* Facultad */}
                                        <td style={{ fontSize: 13, color: '#475569' }}>{s.facultad || '—'}</td>

                                        {/* Fecha inicio */}
                                        <td style={{ fontSize: 13, color: '#475569', whiteSpace: 'nowrap' }}>
                                            {s.fecha_inicio
                                                ? <>{s.fecha_inicio}<br/><span style={{ fontSize: 11, color: '#94a3b8' }}>{s.hora_inicio || '06:00'}</span></>
                                                : '—'}
                                        </td>

                                        {/* Destino */}
                                        <td style={{ fontSize: 13, color: '#334155', maxWidth: 160 }}>
                                            {s.parada_max || s.punto_partida || '—'}
                                        </td>

                                        {/* Estudiantes */}
                                        <td>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 10px' }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                                <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{s.num_estudiantes || 0}</span>
                                            </div>
                                        </td>

                                        {/* Estado */}
                                        <td>{estadoChip(s.estado)}</td>

                                        {/* Transporte */}
                                        <td style={{ fontSize: 12, color: '#475569', maxWidth: 140 }}>
                                            {s.empresa_asignada || (
                                                <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Sin asignar</span>
                                            )}
                                        </td>
                                    </tr>

                                    {/* Fila expandida */}
                                    {isExpanded && (
                                        <tr style={{ background: '#fafaf9', borderBottom: '1px solid #e2e8f0' }}>
                                            <td colSpan="8" style={{ padding: '0 16px 16px' }}>
                                                <div style={{
                                                    padding: '16px 20px', background: '#fff',
                                                    borderRadius: 8, border: '1px solid #f1f5f9',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                                    gap: 20,
                                                }}>
                                                    <div>
                                                        <h4 style={{ margin: '0 0 10px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>Itinerario</h4>
                                                        <div style={{ fontSize: 13, color: '#475569', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                            <div><span style={{ color: '#94a3b8', marginRight: 8 }}>Salida:</span>{s.fecha_inicio || '—'} {s.hora_inicio || ''}</div>
                                                            <div><span style={{ color: '#94a3b8', marginRight: 8 }}>Regreso:</span>{s.fecha_fin || '—'} {s.hora_fin || ''}</div>
                                                            <div><span style={{ color: '#94a3b8', marginRight: 8 }}>Destino:</span>{s.parada_max || '—'}</div>
                                                            <div><span style={{ color: '#94a3b8', marginRight: 8 }}>Partida:</span>{s.punto_partida || '—'}</div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 style={{ margin: '0 0 10px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>Académico</h4>
                                                        <div style={{ fontSize: 13, color: '#475569', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                            <div><span style={{ color: '#94a3b8', marginRight: 8 }}>Asignatura:</span>{s.asignatura || '—'}</div>
                                                            <div><span style={{ color: '#94a3b8', marginRight: 8 }}>Semestre:</span>{s.semestre || '—'}</div>
                                                            <div><span style={{ color: '#94a3b8', marginRight: 8 }}>Docente:</span>{s.profesor_nombre || '—'}</div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 style={{ margin: '0 0 10px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>Logística</h4>
                                                        <div style={{ fontSize: 13, color: '#475569', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                            <div><span style={{ color: '#94a3b8', marginRight: 8 }}>Transporte:</span>{s.empresa_asignada || 'Sin asignar'}</div>
                                                            <div><span style={{ color: '#94a3b8', marginRight: 8 }}>Conductor:</span>{s.conductor_asignado || '—'}</div>
                                                            <div><span style={{ color: '#94a3b8', marginRight: 8 }}>Cupo:</span>{s.num_estudiantes || 0} estudiantes</div>
                                                            <div><span style={{ color: '#94a3b8', marginRight: 8 }}>Costo aprox.:</span>
                                                                {s.costo_estimado
                                                                    ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(s.costo_estimado)
                                                                    : '$ 0'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 style={{ margin: '0 0 10px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>Acceso</h4>
                                                        <div style={{ fontSize: 13, color: '#475569', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                            <div><span style={{ color: '#94a3b8', marginRight: 8 }}>Código PIN:</span>
                                                                <code style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, fontSize: 13, letterSpacing: 2, fontWeight: 700 }}>
                                                                    {s.pin_acceso || 'N/A'}
                                                                </code>
                                                            </div>
                                                            <div><span style={{ color: '#94a3b8', marginRight: 8 }}>Estado:</span>{estadoChip(s.estado)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Conteo de resultados */}
            {!cargando && salidasFiltradas.length > 0 && (
                <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8', textAlign: 'right' }}>
                    Mostrando {salidasFiltradas.length} de {salidas.length} salidas activas
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>
        </div>
    );
};

export default MonitoreoEjecucionPanel;
