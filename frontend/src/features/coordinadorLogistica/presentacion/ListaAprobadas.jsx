import React, { useState, useEffect } from 'react';
import { CardKPI } from '../../../shared/componentes/generales/Tarjetas/Tarjetas';
import { obtenerSalidasPendientesLogistica } from '../aplicacion/servicios';

const ListaAprobadas = ({ onAsignar }) => {
    const [salidas, setSalidas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtro, setFiltro] = useState('todas'); // urbana, regional, larga
    const [expandidoId, setExpandidoId] = useState(null);

    const toggleFila = (id) => {
        setExpandidoId(expandidoId === id ? null : id);
    };

    useEffect(() => {
        setCargando(true);
        obtenerSalidasPendientesLogistica()
            .then(data => {
                if (Array.isArray(data)) {
                    setSalidas(data);
                }
                setCargando(false);
            })
            .catch(error => {
                console.error("Error obteniendo salidas logísticas:", error);
                setCargando(false);
            });
    }, []);

    const metricas = {
        total: salidas.length,
        urbanas: salidas.filter(s => s.categoria === 'urbana').length,
        regionales: salidas.filter(s => s.categoria === 'regional').length,
    };

    return (
        <div>
            {/* Header del panel */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', color: '#0f172a', margin: '0 0 4px' }}>Salidas por Asignar</h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Salidas con aprobación del Consejo esperando gestión logística.</p>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <CardKPI 
                    label="Pendientes Totales" 
                    value={cargando ? '-' : metricas.total} 
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>} 
                    iconBg="#eff6ff" iconColor="#3b82f6" 
                />
                <CardKPI 
                    label="Urbanas (Cortas)" 
                    value={cargando ? '-' : metricas.urbanas} 
                    iconBg="#ecfdf5" iconColor="#10b981" 
                />
                <CardKPI 
                    label="Regionales (Medias)" 
                    value={cargando ? '-' : metricas.regionales} 
                    iconBg="#fffbeb" iconColor="#f59e0b" 
                />
            </div>

            {/* Tabla */}
            <div className="herr-tabla-wrapper">
                {cargando ? (
                    <div className="herr-vacio">Cargando datos logísticos...</div>
                ) : salidas.length === 0 ? (
                    <div className="herr-vacio">No hay salidas pendientes de asignación.</div>
                ) : (
                    <table className="herr-tabla">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Facultad</th>
                                <th>Categoría</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salidas.map(s => {
                                const isExpanded = expandidoId === s.id;
                                const costoFormateado = s.costo_estimado ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(s.costo_estimado) : '$ 0';
                                
                                return (
                                    <React.Fragment key={s.id}>
                                        <tr 
                                            style={{ 
                                                borderBottom: isExpanded ? 'none' : '1px solid #e2e8f0', 
                                                background: isExpanded ? '#fafaf9' : 'transparent',
                                                transition: 'background 0.2s ease', 
                                                cursor: 'pointer' 
                                            }} 
                                            onClick={() => toggleFila(s.id)}
                                        >
                                            <td>
                                                <code style={{ background: '#f1f5f9', padding: '2px 7px', borderRadius: 4, fontSize: 12 }}>
                                                    {s.codigo}
                                                </code>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{s.nombre}</div>
                                            </td>
                                            <td>{s.facultad}</td>
                                            <td>
                                                <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                                                    {s.categoria ? s.categoria.toUpperCase() : 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="herr-acciones">
                                                    <button 
                                                        className="herr-action-circle" 
                                                        title="Asignar Recursos"
                                                        onClick={(e) => { e.stopPropagation(); onAsignar?.(s); }}
                                                        style={{ color: '#0ea5e9', borderColor: '#e0f2fe', background: '#f0f9ff' }}
                                                    >
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                            <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        className="herr-btn herr-btn--ghost herr-btn--sm"
                                                        onClick={(e) => { e.stopPropagation(); onAsignar?.(s); }}
                                                    >
                                                        Asignar
                                                    </button>
                                                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: '0 5px' }}>
                                                        <svg style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="6 9 12 15 18 9"></polyline>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr style={{ background: '#fafaf9', borderBottom: '1px solid #e2e8f0' }}>
                                                <td colSpan="5" style={{ padding: '0 16px 16px 16px' }}>
                                                    <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr) minmax(0, 1fr)', gap: '40px', whiteSpace: 'normal', boxSizing: 'border-box' }}>
                                                        {/* Columna 1: Itinerario */}
                                                        <div>
                                                            <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>Itinerario</h4>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                                <span style={{ color: '#64748b', fontSize: '13px', width: '80px', flexShrink: 0 }}>Destino:</span>
                                                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.destino || 'Múltiples destinos / Sin Definir'}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                                <span style={{ color: '#64748b', fontSize: '13px', width: '80px', flexShrink: 0 }}>Salida:</span>
                                                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{s.fecha_inicio ? `${s.fecha_inicio} a las ${s.hora_inicio || '06:00'}` : 'Por definir'}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                                <span style={{ color: '#64748b', fontSize: '13px', width: '80px', flexShrink: 0 }}>Llegada:</span>
                                                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{s.fecha_fin ? `${s.fecha_fin} a las ${s.hora_fin || '18:00'}` : 'Por definir'}</span>
                                                            </div>
                                                        </div>

                                                        {/* Columna 2: Pasajeros */}
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                            <div>
                                                                <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>Manifesto de Pasajeros</h4>
                                                                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                                    <div style={{ textAlign: 'center' }}>
                                                                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>{s.num_estudiantes || 0}</div>
                                                                        <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Estudiantes</div>
                                                                    </div>
                                                                    <div style={{ width: '1px', height: '30px', background: '#e2e8f0' }}></div>
                                                                    <div style={{ textAlign: 'center' }}>
                                                                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>{s.num_docentes || 0}</div>
                                                                        <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Docentes</div>
                                                                    </div>
                                                                    <div style={{ width: '1px', height: '30px', background: '#e2e8f0' }}></div>
                                                                    <div style={{ textAlign: 'center', background: '#f8fafc', padding: '6px 12px', borderRadius: '8pxBorder' }}>
                                                                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>{(s.num_estudiantes || 0) + (s.num_docentes || 0)}</div>
                                                                        <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total Pax.</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Columna 3: Resumen Estratégico */}
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                            <div>
                                                                <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>Resumen Estratégico</h4>
                                                                
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                                    <span style={{ color: '#64748b', fontSize: '13px', width: '90px', flexShrink: 0 }}>Distancia:</span>
                                                                    <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{s.distancia_km || 0} km</span>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                                    <span style={{ color: '#64748b', fontSize: '13px', width: '90px', flexShrink: 0 }}>Duración:</span>
                                                                    <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{s.duracion_dias || 1} días</span>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                                    <span style={{ color: '#64748b', fontSize: '13px', width: '90px', flexShrink: 0 }}>Viaje Aprox:</span>
                                                                    <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{s.horas_viaje || 0} horas</span>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                                    <span style={{ color: '#64748b', fontSize: '13px', width: '90px', flexShrink: 0 }}>Viáticos Aprox:</span>
                                                                    <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{s.viaticos_estimados ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(s.viaticos_estimados) : '$ 0'}</span>
                                                                </div>

                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                                    <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>Costo Proyectado:</span>
                                                                    <span style={{ color: '#059669', fontSize: '16px', fontWeight: '800' }}>{costoFormateado}</span>
                                                                </div>
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
                )}
            </div>
        </div>
    );
};

export default ListaAprobadas;
