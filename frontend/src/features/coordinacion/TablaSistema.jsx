import React, { useState } from 'react';

export const TablaSistema = ({ salidas = [], cargando = false, titulo = "Sistema", onRevisar, vistaActiva = 'pendientes' }) => {
    const [expandidoId, setExpandidoId] = useState(null);

    const toggleFila = (id) => {
        setExpandidoId(expandidoId === id ? null : id);
    };

    if (cargando) return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Cargando tabla...</div>;

    if (salidas.length === 0) {
        return (
            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: '12px', background: '#f8fafc' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '10px' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                <p style={{ margin: 0 }}>No hay salidas para mostrar en esta vista.</p>
            </div>
        );
    }

    return (
        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px', whiteSpace: 'nowrap' }}>
                <thead>
                    <tr style={{ background: '#f8fafc', color: '#475569', fontWeight: '600' }}>
                        <th style={{ padding: '16px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e2e8f0' }}>Profesor Encargado</th>
                        <th style={{ padding: '16px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e2e8f0' }}>Asignatura</th>
                        <th style={{ padding: '16px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e2e8f0' }}>Destino / Lugar</th>
                        <th style={{ padding: '16px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e2e8f0' }}>Fechas Estimadas</th>
                        <th style={{ padding: '16px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>Estado</th>
                        <th style={{ padding: '16px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {salidas.map(s => {
                        const esPendiente = vistaActiva === 'pendientes' || s.estado === 'EN_REVISION';
                        const prof = s.profesor_nombre || s.profesor || 'Carlos Méndez';
                        const dest = s.destino || 'PNN Chingaza, Colombia';
                        const feInicio = s.fecha_inicio ? new Date(s.fecha_inicio).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Mar 2026';
                        const feFin = s.fecha_fin ? new Date(s.fecha_fin).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '17 Mar 2026';
                        const codigo = s.codigo || `SAL-004${s.id}`;
                        const isExpanded = expandidoId === s.id;

                        // Estilos de pills idénticos a los del sistema del cliente (video)
                        const badgeStyle = esPendiente 
                            ? { background: '#f1f5f9', color: '#64748b', border: '1px dashed #cbd5e1' }
                            : { background: '#ecfdf5', color: '#10b981', border: 'none' };

                        return (
                            <React.Fragment key={s.id}>
                                <tr style={{ 
                                    borderBottom: isExpanded ? 'none' : '1px solid #f1f5f9', 
                                    background: isExpanded ? '#fafaf9' : 'transparent',
                                    transition: 'background 0.2s ease', 
                                    cursor: 'pointer' 
                                }} onClick={() => toggleFila(s.id)}>
                                    
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img src={`https://i.pravatar.cc/150?u=${s.id}`} alt={prof} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                                            <span style={{ color: '#334155', fontWeight: '500' }}>{prof}</span>
                                        </div>
                                    </td>
                                    
                                    <td style={{ padding: '16px 20px', color: '#64748b' }}>{s.nombre || 'Geología Estructural'}</td>
                                    <td style={{ padding: '16px 20px', color: '#64748b' }}>{dest}</td>
                                    <td style={{ padding: '16px 20px', color: '#64748b' }}>{feInicio} - {feFin}</td>
                                    
                                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                        <span style={{ 
                                            padding: '4px 10px', 
                                            borderRadius: '20px', 
                                            fontSize: '10px', 
                                            fontWeight: '700', 
                                            letterSpacing: '0.5px',
                                            ...badgeStyle 
                                        }}>
                                            {esPendiente ? 'POR REVISAR' : 'APROBADA'}
                                        </span>
                                    </td>
                                    
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                                            
                                            {/* Botones de acción elegantes */}
                                            {esPendiente ? (
                                                <button 
                                                    title="Evaluar Salida"
                                                    style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', color: '#3b82f6', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'all 0.2s' }}
                                                    onClick={(e) => { e.stopPropagation(); onRevisar?.(s); }}>
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                                </button>
                                            ) : (
                                                <button 
                                                    title="Ver Detalles"
                                                    style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', color: '#64748b', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'all 0.2s' }}
                                                    onClick={(e) => e.stopPropagation()}>
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                                </button>
                                            )}
                                            
                                            {/* Chevron para Acordeon */}
                                            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: 0 }}>
                                                <svg 
                                                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} 
                                                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                >
                                                    <polyline points="6 9 12 15 18 9"></polyline>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                
                                {/* Fila Expandida (Acordeón) */}
                                {isExpanded && (
                                    <tr style={{ background: '#fafaf9', borderBottom: '1px solid #e2e8f0' }}>
                                        <td colSpan="6" style={{ padding: '0 20px 20px 20px' }}>
                                            <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) 1fr 1fr', gap: '30px' }}>
                                                
                                                {/* Sección 1: Resumen del Grupo */}
                                                <div>
                                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>Resumen Académico</h4>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px' }}>
                                                        <span style={{ color: '#64748b', width: '90px' }}>Programa:</span>
                                                        <span style={{ color: '#1e293b', fontWeight: '500' }}>{s.programa_id ? `Prog. ${s.programa_id}` : 'No definido'}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px' }}>
                                                        <span style={{ color: '#64748b', width: '90px' }}>Estudiantes:</span>
                                                        <span style={{ color: '#1e293b', fontWeight: '500' }}>{s.num_estudiantes || 0} Confirmados</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                        <span style={{ color: '#64748b', width: '90px' }}>Semestre:</span>
                                                        <span style={{ color: '#1e293b', fontWeight: '500' }}>{s.semestre || 'No definido'}</span>
                                                    </div>
                                                </div>

                                                {/* Sección 2: Itinerario Rápido */}
                                                <div>
                                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>Logística Clave</h4>
                                                    <p style={{ margin: '0 0 8px 0', color: '#475569', fontSize: '12px' }}>{s.num_estudiantes > 0 ? '✓ Cupos Asignados' : '⚠ Sin estimación de cupos'}</p>
                                                    <p style={{ margin: '0 0 8px 0', color: '#475569', fontSize: '12px' }}>{s.fecha_inicio ? '✓ Calendario definido' : '⚠ Fechas por confirmar'}</p>
                                                    <p style={{ margin: '0', color: '#ef4444', fontSize: '12px' }}>⚠ Revisión Pedagógica Pendiente</p>
                                                </div>
                                                
                                                {/* Sección 3: Acciones Rápidas Cortas */}
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: '10px' }}>
                                                    {esPendiente && (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); onRevisar?.(s); }}
                                                            style={{ width: '100%', padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', justifyContent: 'center', gap: '6px', alignItems: 'center' }}>
                                                            <span>Ingresar a Revisión Completa</span>
                                                        </button>
                                                    )}
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
    );
};
