import React, { useState } from 'react';
import RevisionPedagogicaPanel from './RevisionPedagogicaPanel';

export const VistaRevision = ({ salida, onVolver }) => {
    const [tabInfo, setTabInfo] = useState('general');

    // Layout de vista compartida (Pantalla completa o renderizado condicional en dashboard)
    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '30px' }}>
            
            {/* Header / Nav de devolverse */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '30px' }}>
                <button onClick={onVolver} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '15px', color: '#64748b' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Volver
                </button>
            </div>

            {/* Titulo Principal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <h1 style={{ margin: 0, fontSize: '28px', color: '#0f172a' }}>{salida?.nombre || 'Geología Estructural'}</h1>
                    <span style={{ background: '#0f172a', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        {salida?.codigo || 'SAL-2024-0045'}
                    </span>
                </div>
                <div style={{ background: '#e2e8f0', color: '#475569', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    PENDIENTE CONCEPTO
                </div>
            </div>

            {/* Contenedor Dividido */}
            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                
                {/* Lado Izquierdo: Información de la Salida */}
                <div style={{ flex: '1 1 65%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Tabs de Información */}
                    <div style={{ display: 'flex', gap: '30px', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
                        {[
                            { id: 'general', label: 'Información General' },
                            { id: 'academicos', label: 'Aspectos Académicos' },
                            { id: 'itinerario', label: 'Itinerario' },
                            { id: 'presupuesto', label: 'Presupuesto' }
                        ].map(t => (
                            <div 
                                key={t.id}
                                onClick={() => setTabInfo(t.id)}
                                style={{ 
                                    cursor: 'pointer', 
                                    fontSize: '15px', 
                                    fontWeight: tabInfo === t.id ? 'bold' : 'normal',
                                    color: tabInfo === t.id ? '#0f172a' : '#94a3b8',
                                    position: 'relative'
                                }}
                            >
                                {t.label}
                                {tabInfo === t.id && (
                                    <div style={{ position: 'absolute', bottom: '-11px', left: 0, right: 0, height: '3px', background: '#0f172a' }} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Contenido del Tab */}
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '30px', border: '1px solid #e2e8f0', minHeight: '400px' }}>
                        {tabInfo === 'general' && (
                            <div>
                                <h3 style={{ margin: '0 0 25px 0', fontSize: '18px', color: '#0f172a' }}>Datos Básicos</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                    <div>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px' }}>ASIGNATURA / CÓDIGO</p>
                                        <p style={{ margin: 0, fontSize: '15px', color: '#334155' }}>{salida?.asignatura || 'Sin Asignatura'} ({salida?.codigo || 'N/A'})</p>
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px' }}>PROGRAMA ACADÉMICO</p>
                                        <p style={{ margin: 0, fontSize: '15px', color: '#334155' }}>{salida?.programa_id ? `Programa ${salida.programa_id}` : 'No Definido'}</p>
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px' }}>PROFESOR RESPONSABLE</p>
                                        <p style={{ margin: 0, fontSize: '15px', color: '#334155' }}>{salida?.profesor_nombre || `Docente ID: ${salida?.profesor_id || 'N/A'}`}</p>
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px' }}>NÚMERO DE ESTUDIANTES</p>
                                        <p style={{ margin: 0, fontSize: '15px', color: '#334155' }}>{salida?.num_estudiantes || 0} Confirmados (Semestre {salida?.semestre || 'N/A'})</p>
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px' }}>FECHAS PROPUESTAS</p>
                                        <p style={{ margin: 0, fontSize: '15px', color: '#334155' }}>
                                            {salida?.fecha_inicio ? `${salida.fecha_inicio} (Salida)` : 'Fechas por definir'} 
                                            {salida?.fecha_fin ? ` - ${salida.fecha_fin} (Regreso)` : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {tabInfo === 'academicos' && (
                            <div>
                                <h3 style={{ margin: '0 0 25px 0', fontSize: '18px', color: '#0f172a' }}>Aspectos Académicos y Justificación</h3>
                                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#475569', textTransform: 'uppercase' }}>Justificación Pedagógica</h4>
                                    <p style={{ margin: 0, color: '#334155', lineHeight: '1.6', fontSize: '15px' }}>
                                        {salida?.justificacion || 'El profesor no ha proporcionado una justificación detallada para esta salida de campo.'}
                                    </p>
                                </div>
                            </div>
                        )}
                        {tabInfo === 'itinerario' && (
                            <div>
                                <h3 style={{ margin: '0 0 25px 0', fontSize: '18px', color: '#0f172a' }}>Itinerario Propuesto</h3>
                                <p style={{ color: '#64748b', fontSize: '15px' }}>
                                    (Los detalles de las paradas y ubicaciones del itinerario se cargarán desde la base de datos sin incluir el mapa, para optimizar la vista de evaluación).
                                </p>
                            </div>
                        )}
                        {tabInfo === 'presupuesto' && (
                            <div>
                                <h3 style={{ margin: '0 0 25px 0', fontSize: '18px', color: '#0f172a' }}>Presupuesto Estimado</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                    <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                                        <p style={{ margin: '0 0 5px 0', color: '#166534', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Costo Total Estimado</p>
                                        <p style={{ margin: 0, color: '#15803d', fontSize: '24px', fontWeight: 'bold' }}>
                                            ${Number(salida?.costo_estimado || 0).toLocaleString('es-CO')}
                                        </p>
                                    </div>
                                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <p style={{ margin: '0 0 5px 0', color: '#475569', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Aprobación Presupuestal</p>
                                        <p style={{ margin: 0, color: '#334155', fontSize: '15px' }}>Pendiente de asignación logística</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {tabInfo !== 'general' && tabInfo !== 'itinerario' && tabInfo !== 'academicos' && tabInfo !== 'presupuesto' && (
                            <p style={{ color: '#64748b' }}>Contenido de {tabInfo} (Simulado para demostración)</p>
                        )}
                    </div>
                </div>

                {/* Lado Derecho: Lista de Chequeo (Componente reutilizado, quitando diseño modal fijo) */}
                <div style={{ flex: '1 1 35%', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>LISTA DE CHEQUEO</h2>
                            <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>Valide cada criterio pedagógico.</p>
                        </div>
                        <button style={{ border: '1px solid #e2e8f0', background: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', display: 'flex', gap: '5px', alignItems: 'center' }}>
                            ↔ Expandir Panel
                        </button>
                    </div>
                    {/* Envolvemos el Panel actual con position static para que fluya en este contenedor en vez del overlay */}
                    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 200px)', display: 'flex' }}>
                        <div style={{ transform: 'none', position: 'static', width: '100%', height: '100%', boxShadow: 'none' }}>
                            {/* Cargamos el panel pasándole una flag para estilo estático si toca, o lo ajustamos */}
                            <RevisionPedagogicaPanel salida={salida} onCerrar={onVolver} isStatic={true} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VistaRevision;
