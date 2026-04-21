import React, { useState } from 'react';
import { EtiquetaPill } from '../../../shared/componentes/generales/ElementosUX/ElementosUX';

const MonitoreoEjecucionPanel = () => {
    // Mocks de salidas actuales en curso
    const enEjecucion = [
        { id: 101, codigo: 'SAL-003', destino: 'Villa de Leyva', prof: 'Carlos Rodriguez', vehiculo: 'UPN-001 (Microbús)', fase: 'en_ruta_destino' },
        { id: 102, codigo: 'SAL-004', destino: 'Embalse Neusa', prof: 'Laura Gomez', vehiculo: 'Contratado (TransExpress)', fase: 'actividad_pedagogica' }
    ];

    const novedades = [
        { id: 1, salida_id: 101, nivel: 'alta', mensaje: 'Retraso de 40 mins por trancón en la autopista Norte.', hora: '08:45 AM' },
        { id: 2, salida_id: 102, nivel: 'baja', mensaje: 'Llegada exitosa al destino.', hora: '09:00 AM' }
    ];

    const getNivelColor = (nivel) => {
        switch(nivel) {
            case 'critica': return { bg: '#fee2e2', text: '#ef4444', icon: '🔴' };
            case 'alta': return { bg: '#ffedd5', text: '#f97316', icon: '🟠' };
            case 'media': return { bg: '#e0f2fe', text: '#0ea5e9', icon: '🔵' };
            default: return { bg: '#f1f5f9', text: '#64748b', icon: '⚪' };
        }
    };

    return (
        <div style={{ padding: '30px', background: '#f8fafc', minHeight: '100vh', animation: 'fadeIn 0.3s' }}>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#0f172a' }}>Monitor Operativo en Tiempo Real</h1>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Rastreo de salidas en ejecución y panel de novedades.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 400px', gap: '25px' }}>
                
                {/* Visualización de Viajes Actuales */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <h3 style={{ margin: 0, color: '#334155', fontSize: '16px' }}>En Ejecución (Activas)</h3>
                    {enEjecucion.map(s => (
                        <div key={s.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>{s.codigo} - {s.destino}</h4>
                                    <span style={{ color: '#64748b', fontSize: '13px' }}>{s.vehiculo} | Coord: {s.prof}</span>
                                </div>
                                <EtiquetaPill texto="En Curso" color="blue" />
                            </div>
                            
                            {/* Línea de tiempo simple */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', marginTop: '20px' }}>
                                <div style={{ position: 'absolute', top: '10px', left: '10%', right: '10%', height: '3px', background: '#e2e8f0', zIndex: 0 }}></div>
                                <div style={{ position: 'absolute', top: '10px', left: '10%', right: s.fase === 'actividad_pedagogica' ? '50%' : '90%', height: '3px', background: '#3b82f6', zIndex: 1, transition: '0.4s' }}></div>
                                
                                {['Salida', 'Ruta', 'Destino', 'Regreso'].map((paso, i) => {
                                    const activo = (s.fase === 'en_ruta_destino' && i <= 1) || (s.fase === 'actividad_pedagogica' && i <= 2);
                                    return (
                                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', zIndex: 2 }}>
                                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: activo ? '#3b82f6' : '#fff', border: activo ? 'none' : '2px solid #cbd5e1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                                                {activo && '✓'}
                                            </div>
                                            <span style={{ fontSize: '11px', color: activo ? '#334155' : '#94a3b8', fontWeight: activo ? 'bold' : 'normal' }}>{paso}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Panel lateral de Novedades */}
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', borderRadius: '12px 12px 0 0' }}>
                        <h3 style={{ margin: 0, color: '#334155', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                            Bitácora de Novedades
                        </h3>
                    </div>
                    
                    <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
                        {novedades.map(nov => {
                            const config = getNivelColor(nov.nivel);
                            return (
                                <div key={nov.id} style={{ padding: '15px', background: '#fff', border: '1px solid #e2e8f0', borderLeft: `4px solid ${config.text}`, borderRadius: '8px', marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>{config.icon} SAL-10{nov.salida_id}</span>
                                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{nov.hora}</span>
                                    </div>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>{nov.mensaje}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0' }}>
                        <button style={{ width: '100%', padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                            + Registrar Novedad Manual
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MonitoreoEjecucionPanel;
