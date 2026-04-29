import React, { useState } from 'react';

const VistaDecidirConsejo = ({ salida, onVolver }) => {
    const [tabActivo, setTabActivo] = useState('general');
    const [decision, setDecision] = useState('approved');
    const [motivo, setMotivo] = useState('');
    const [acta, setActa] = useState('');
    const [fechaActa, setFechaActa] = useState('');
    const [presupuestoConfirmado, setPresupuestoConfirmado] = useState(false);
    const [coordExpanded, setCoordExpanded] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Decisión Registrada: ${decision}\nActa: ${acta}`);
        onVolver();
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
            
            {/* LEFT PANEL: READ ONLY TABS */}
            <div>
                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid #cbd5e1', marginBottom: '24px', gap: '24px' }}>
                    {['general', 'academico', 'itinerario', 'presupuesto'].map(tab => (
                        <button 
                            key={tab}
                            style={{ 
                                padding: '12px 0', 
                                border: 'none', 
                                background: 'none', 
                                cursor: 'pointer', 
                                fontSize: '14px', 
                                fontWeight: tabActivo === tab ? '600' : '500', 
                                color: tabActivo === tab ? '#0f172a' : '#64748b', 
                                borderBottom: tabActivo === tab ? '2px solid #0f172a' : '2px solid transparent',
                                textTransform: 'capitalize'
                            }}
                            onClick={() => setTabActivo(tab)}
                        >
                            {tab === 'general' ? 'Información General' : tab === 'academico' ? 'Aspectos Académicos' : tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '300px' }}>
                    
                    {tabActivo === 'general' && (
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#0f172a' }}>Datos Básicos</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div><span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.05em' }}>Asignatura</span><p style={{ margin: '4px 0 0 0', color: '#334155', fontSize: '15px' }}>{salida.asignatura}</p></div>
                                <div><span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.05em' }}>Programa</span><p style={{ margin: '4px 0 0 0', color: '#334155', fontSize: '15px' }}>{salida.programa}</p></div>
                                <div><span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.05em' }}>Estudiantes</span><p style={{ margin: '4px 0 0 0', color: '#334155', fontSize: '15px' }}>25 Confirmados</p></div>
                                <div><span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.05em' }}>Fechas</span><p style={{ margin: '4px 0 0 0', color: '#334155', fontSize: '15px' }}>{salida.fecha}</p></div>
                            </div>
                        </div>
                    )}

                    {tabActivo === 'academico' && (
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#0f172a' }}>Resumen Académico</h3>
                            <div style={{ marginBottom: '20px' }}><span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.05em' }}>Objetivos de Aprendizaje</span><p style={{ margin: '4px 0 0 0', color: '#334155', fontSize: '15px' }}>Identificar fallas y realizar levantamientos estratigráficos básicos in-situ.</p></div>
                            <div><span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.05em' }}>Metodología</span><p style={{ margin: '4px 0 0 0', color: '#334155', fontSize: '15px' }}>Recorrido guiado con 4 paradas técnicas y trabajo en grupos.</p></div>
                        </div>
                    )}

                    {tabActivo === 'itinerario' && (
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#0f172a' }}>Itinerario Oficial</h3>
                            <p style={{ color: '#64748b' }}>El itinerario detallado de la salida se encuentra verificado por coordinación.</p>
                        </div>
                    )}

                    {tabActivo === 'presupuesto' && (
                        <div>
                            <div style={{ background: '#F9FAFB', padding: '20px', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                                <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.05em' }}>COSTO TOTAL SOLICITADO</span>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', margin: '8px 0' }}>{salida.costo} COP</div>
                                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Incluye factores administrativos (10%)</p>
                            </div>
                            
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <tbody>
                                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: '12px 0', color: '#475569' }}>Transporte</td><td style={{ textAlign: 'right', fontWeight: '500' }}>$2,500,000</td></tr>
                                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: '12px 0', color: '#475569' }}>Alojamiento</td><td style={{ textAlign: 'right', fontWeight: '500' }}>$1,200,000</td></tr>
                                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: '12px 0', color: '#475569' }}>Entradas</td><td style={{ textAlign: 'right', fontWeight: '500' }}>$500,000</td></tr>
                                    <tr><td style={{ padding: '12px 0', color: '#475569' }}>Imprevistos</td><td style={{ textAlign: 'right', fontWeight: '500' }}>$300,000</td></tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT PANEL: DECISION FORM */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', position: 'sticky', top: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                
                {/* Accordion Concepto */}
                <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Concepto Coordinador</span>
                    <div style={{ border: '1px solid #0f172a', borderRadius: '6px', overflow: 'hidden' }}>
                        <div onClick={() => setCoordExpanded(!coordExpanded)} style={{ background: '#f8fafc', padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: coordExpanded ? '1px solid #0f172a' : 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '16px' }}>📝</span><span style={{ fontWeight: 'bold', color: '#0f172a' }}>APROBADO</span></div>
                            <svg style={{ transform: coordExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                        {coordExpanded && (
                            <div style={{ padding: '16px', fontSize: '13px' }}>
                                <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}>"La salida está bien fundamentada y el itinerario es realista."</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span>1. Pertinencia</span><span style={{ fontWeight: 'bold', border: '1px solid #0f172a', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>CUMPLE</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span>2. Viabilidad</span><span style={{ fontWeight: 'bold', border: '1px solid #0f172a', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>CUMPLE</span></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Budget Alert */}
                <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Diagnóstico Financiero</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'white', border: '1px solid #0f172a', padding: '16px', borderRadius: '8px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>$</div>
                        <div>
                            <span style={{ display: 'block', fontWeight: 'bold', color: '#0f172a' }}>COSTO SEGURO</span>
                            <span style={{ fontSize: '13px', color: '#475569' }}>Representa el 0.9% del presupuesto.</span>
                        </div>
                    </div>
                </div>

                {/* Decision Form o Vista de Solo Lectura */}
                {salida.estado === 'favorable' ? (
                    <form onSubmit={handleSubmit}>
                        <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}>Decisión del Consejo</span>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                            {[
                                { value: 'approved', label: 'APROBAR' },
                                { value: 'rejected', label: 'RECHAZAR' },
                                { value: 'changes', label: 'SOLICITAR CAMBIOS' }
                            ].map(opt => (
                                <label key={opt.value} style={{ border: decision === opt.value ? '2px solid #0f172a' : '1px solid #cbd5e1', background: decision === opt.value ? '#f8fafc' : 'white', padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s', fontWeight: decision === opt.value ? '600' : '400' }}>
                                    <input type="radio" name="decision" checked={decision === opt.value} onChange={() => setDecision(opt.value)} style={{ accentColor: '#0f172a', transform: 'scale(1.2)' }} />
                                    {opt.label}
                                </label>
                            ))}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#0f172a' }}>Motivo / Observaciones</label>
                            <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', minHeight: '80px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} placeholder="Ingrese el motivo de la decisión..." />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#0f172a' }}>No. Acta *</label>
                                <input type="text" required value={acta} onChange={(e) => setActa(e.target.value)} style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box' }} placeholder="Ej: 004-2026" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#0f172a' }}>Fecha *</label>
                                <input type="date" required value={fechaActa} onChange={(e) => setFechaActa(e.target.value)} style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'start' }}>
                            <input type="checkbox" required id="budgetCheck" checked={presupuestoConfirmado} onChange={(e) => setPresupuestoConfirmado(e.target.checked)} style={{ marginTop: '4px', accentColor: '#0f172a' }} />
                            <label htmlFor="budgetCheck" style={{ fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>Confirmo que he verificado el impacto presupuestal y autorizo el compromiso de fondos.</label>
                        </div>

                        <button type="submit" style={{ width: '100%', background: '#0f172a', color: 'white', padding: '14px', fontWeight: 'bold', borderRadius: '8px', border: 'none', fontSize: '14px', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '0.05em' }}>REGISTRAR DECISIÓN OFICIAL</button>
                    </form>
                ) : (
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
                        <div style={{ background: '#e0e7ff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#4338ca' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        </div>
                        <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '16px' }}>Decisión Ya Emitida</h4>
                        <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '13px', lineHeight: '1.5' }}>
                            Esta salida ya cuenta con una decisión oficial del Consejo de Facultad y no puede ser alterada. Su estado actual es: <strong>{salida.estado.toUpperCase().replace('_', ' ')}</strong>.
                        </p>
                        <button onClick={onVolver} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', color: '#475569', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>Volver al Historial</button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default VistaDecidirConsejo;
