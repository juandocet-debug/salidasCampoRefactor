import React, { useState } from 'react';

export const TablaConsejo = ({ salidas, onDecidir }) => {
    const [expandidoId, setExpandidoId] = useState(null);

    const toggleFila = (id) => {
        setExpandidoId(expandidoId === id ? null : id);
    };

    if (salidas.length === 0) {
        return (
            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: '12px', background: '#f8fafc' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '10px' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                <p style={{ margin: 0 }}>No hay decisiones pendientes para mostrar.</p>
            </div>
        );
    }

    return (
        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px', whiteSpace: 'nowrap' }}>
                <thead>
                    <tr style={{ background: '#f8fafc', color: '#475569', fontWeight: '600' }}>
                        <th style={{ padding: '16px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e2e8f0' }}>Programa</th>
                        <th style={{ padding: '16px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e2e8f0' }}>Asignatura</th>
                        <th style={{ padding: '16px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e2e8f0' }}>Fecha</th>
                        <th style={{ padding: '16px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e2e8f0' }}>Costo Est.</th>
                        <th style={{ padding: '16px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e2e8f0' }}>Concepto Coord.</th>
                        <th style={{ padding: '16px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>Estado</th>
                        <th style={{ padding: '16px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {salidas.map(s => {
                        const isExpanded = expandidoId === s.id;
                        
                        // Etiquetas de Estado contextualizadas para el CONSEJO
                        let badgeStyle = { background: '#f1f5f9', color: '#64748b', border: 'none' };
                        let badgeText = s.estado ? s.estado.toUpperCase() : 'DESCONOCIDO';
                        
                        if (s.estado === 'favorable') {
                            badgeStyle = { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }; // Ámbar - Requiere atención del consejo
                            badgeText = 'POR DECIDIR';
                        } else if (s.estado === 'aprobada') {
                            badgeStyle = { background: '#ecfdf5', color: '#10b981', border: 'none' };
                            badgeText = 'APROBADA';
                        } else if (s.estado === 'rechazada') {
                            badgeStyle = { background: '#fef2f2', color: '#ef4444', border: 'none' };
                            badgeText = 'RECHAZADA';
                        } else if (s.estado === 'pendiente_ajuste') {
                            badgeStyle = { background: '#e0e7ff', color: '#4338ca', border: 'none' };
                            badgeText = 'EN AJUSTES';
                        }

                        // Variables mapeadas del backend DTO
                        const costoFormateado = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(s.costo_estimado || 0);
                        const esConceptoFavorable = s.revision_coordinador?.concepto_final === 'FAVORABLE';
                        
                        return (
                            <React.Fragment key={s.id}>
                                <tr style={{ 
                                    borderBottom: isExpanded ? 'none' : '1px solid #f1f5f9', 
                                    background: isExpanded ? '#fafaf9' : 'transparent',
                                    transition: 'background 0.2s ease', 
                                    cursor: 'pointer' 
                                }} onClick={() => toggleFila(s.id)}>
                                    
                                    <td style={{ padding: '16px 20px', color: '#64748b' }}>
                                        {s.programa_id ? `Programa ${s.programa_id}` : 'N/A'}
                                    </td>
                                    
                                    <td style={{ padding: '16px 20px', color: '#334155' }}>
                                        <div style={{ fontWeight: '600' }}>{s.asignatura || 'Sin Asignatura'}</div>
                                    </td>
                                    
                                    <td style={{ padding: '16px 20px', color: '#64748b' }}>
                                        {s.fecha_inicio || 'Sin Definir'}
                                    </td>
                                    
                                    <td style={{ padding: '16px 20px', color: '#334155', fontWeight: '600' }}>
                                        {costoFormateado}
                                    </td>
                                    
                                    <td style={{ padding: '16px 20px' }}>
                                        {esConceptoFavorable ? (
                                            <span style={{ fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                                Favorable
                                            </span>
                                        ) : (
                                            <span style={{ fontWeight: 600, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                                Con Obs.
                                            </span>
                                        )}
                                    </td>
                                    
                                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                        <span style={{ 
                                            padding: '4px 10px', 
                                            borderRadius: '20px', 
                                            fontSize: '10px', 
                                            fontWeight: '700', 
                                            letterSpacing: '0.5px',
                                            ...badgeStyle 
                                        }}>
                                            {badgeText}
                                        </span>
                                    </td>
                                    
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                                            
                                            {/* Botón Circular con Icono (Decidir / Ver) */}
                                            <button 
                                                title="Revisar"
                                                disabled={s.estado === 'pendiente_ajuste'}
                                                style={{ 
                                                    width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                                    background: s.estado === 'pendiente_ajuste' ? '#f8fafc' : '#fff', 
                                                    border: '1px solid #e2e8f0', 
                                                    borderRadius: '50%', 
                                                    color: s.estado === 'pendiente_ajuste' ? '#cbd5e1' : '#3b82f6', 
                                                    boxShadow: s.estado === 'pendiente_ajuste' ? 'none' : '0 2px 4px rgba(0,0,0,0.05)', 
                                                    cursor: s.estado === 'pendiente_ajuste' ? 'not-allowed' : 'pointer', 
                                                    transition: 'all 0.2s' 
                                                }}
                                                onClick={(e) => { 
                                                    if(s.estado !== 'pendiente_ajuste') {
                                                        e.stopPropagation(); 
                                                        onDecidir?.(s);
                                                    }
                                                }}>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            </button>
                                            
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
                                        <td colSpan="7" style={{ padding: '0 20px 20px 20px' }}>
                                            <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '40px', whiteSpace: 'normal' }}>
                                                
                                                {/* Columna 1: Resumen General */}
                                                <div>
                                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>Resumen General</h4>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                        <span style={{ color: '#64748b', fontSize: '13px', width: '80px' }}>Lugar:</span>
                                                        <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{s.destino || 'No especificado'}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                        <span style={{ color: '#64748b', fontSize: '13px', width: '80px' }}>Proyectados:</span>
                                                        <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{s.num_estudiantes || 0} Estudiantes</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                        <span style={{ color: '#64748b', fontSize: '13px', width: '80px' }}>Salida:</span>
                                                        <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{s.nombre || 'Sin Nombre'}</span>
                                                    </div>
                                                </div>

                                                {/* Columna 2: Objetivo y Justificación */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                    <div>
                                                        <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>Objetivo Principal</h4>
                                                        <p style={{ margin: 0, color: '#475569', fontSize: '13px', lineHeight: '1.5', fontStyle: s.objetivo_general ? 'normal' : 'italic' }}>
                                                            {s.objetivo_general || 'El docente no ha especificado el objetivo de esta salida.'}
                                                        </p>
                                                    </div>
                                                    
                                                    {s.justificacion && (
                                                        <div>
                                                            <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>Justificación Pedagógica</h4>
                                                            <p style={{ margin: 0, color: '#475569', fontSize: '13px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                {s.justificacion}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Columna 3: Concepto de Coordinación & Finanzas */}
                                                <div>
                                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>Concepto Previo & Finanzas</h4>
                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px', background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                                                        <span style={{ color: '#64748b', fontSize: '13px' }}>Coord:</span>
                                                        <span style={{ color: '#475569', fontSize: '12.5px', lineHeight: '1.4', fontStyle: (s.revision_coordinador?.pertinencia_obs || s.revision_coordinador?.objetivos_obs || s.revision_coordinador?.metodologia_obs || s.revision_coordinador?.viabilidad_obs) ? 'normal' : 'italic' }}>
                                                            {s.revision_coordinador ? 
                                                                (s.revision_coordinador.pertinencia_obs || s.revision_coordinador.objetivos_obs || s.revision_coordinador.metodologia_obs || s.revision_coordinador.viabilidad_obs || 'Sin observaciones registradas.') 
                                                                : 'Esperando revisión del Coordinador.'}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                                                        <span style={{ color: '#64748b', fontSize: '13px' }}>Costo Proyectado:</span>
                                                        <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: '800' }}>{costoFormateado}</span>
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
    );
};
