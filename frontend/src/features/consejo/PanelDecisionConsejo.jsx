import React, { useState } from 'react';
import useAlertas from '@/shared/estado/useAlertas';

const MAPA_CONCEPTO = {
    FAVORABLE: { texto: 'FAVORABLE', color: '#10b981', bg: '#ecfdf5' },
    FAVORABLE_CON_AJUSTES: { texto: 'FAVORABLE CON AJUSTES', color: '#f59e0b', bg: '#fffbeb' },
    NO_FAVORABLE: { texto: 'NO FAVORABLE', color: '#ef4444', bg: '#fef2f2' },
};

const PanelDecisionConsejo = ({ salida, onVolver }) => {
    const [decision, setDecision] = useState('aprobado');
    const [motivo, setMotivo] = useState('');
    const [fechaActa, setFechaActa] = useState('');
    const [presupuestoConfirmado, setPresupuestoConfirmado] = useState(false);
    const [coordExpanded, setCoordExpanded] = useState(false);
    const [loading, setLoading] = useState(false);

    const { agregarAlerta } = useAlertas();

    const revision = salida?.revision_coordinador;
    const conceptoInfo = revision
        ? (MAPA_CONCEPTO[revision.concepto_final] || { texto: revision.concepto_final, color: '#64748b', bg: '#f8fafc' })
        : null;

    const costoEstimado = salida?.costo_estimado || 0;
    const PRESUPUESTO_ANUAL = 500000000;
    const pctPresupuesto = PRESUPUESTO_ANUAL > 0 ? ((costoEstimado / PRESUPUESTO_ANUAL) * 100).toFixed(1) : '0.0';
    const costoFormateado = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(costoEstimado);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (decision === 'ajustes' && !fechaActa) { agregarAlerta('La fecha límite para los ajustes es obligatoria.', 'advertencia'); return; }

        setLoading(true);
        try {
            const resp = await fetch(`http://localhost:8000/api/salidas/consejo/decision/${salida.id}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    concepto_financiero: decision,
                    observaciones: motivo,
                    fecha_acta: fechaActa,
                    concejal_id: 1,
                }),
            });
            const data = await resp.json();
            if (resp.ok) {
                agregarAlerta(`¡Decisión del Consejo registrada exitosamente!`, 'exito');
                if (onVolver) onVolver();
            } else {
                agregarAlerta('Error: ' + (data.error || 'Petición inválida.'), 'error');
            }
        } catch (err) {
            console.error(err);
            agregarAlerta('Error de conexión con el servidor.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const estilosBtn = (optValue) => {
        const esActivo = decision === optValue;
        if (optValue === 'aprobado') return esActivo
            ? { background: '#10b981', color: '#fff', border: '1px solid #10b981', boxShadow: '0 4px 10px -2px rgba(16, 185, 129, 0.4)' }
            : { background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' };
        if (optValue === 'ajustes') return esActivo
            ? { background: '#f59e0b', color: '#fff', border: '1px solid #f59e0b', boxShadow: '0 4px 10px -2px rgba(245, 158, 11, 0.4)' }
            : { background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' };
        if (optValue === 'rechazado') return esActivo
            ? { background: '#ef4444', color: '#fff', border: '1px solid #ef4444', boxShadow: '0 4px 10px -2px rgba(239, 68, 68, 0.4)' }
            : { background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' };
        return {};
    };

    const renderBadgeCriterio = (estado) => {
        switch(estado) {
            case 'CUMPLE': return <span style={{ background: '#d1fae5', color: '#065f46', border: '1px solid #34d399', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>✓ CUMPLE</span>;
            case 'PARCIAL': return <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fbbf24', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>⚠ PARCIAL</span>;
            case 'NO_CUMPLE': return <span style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #f87171', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>✕ NO CUMPLE</span>;
            default: return <span style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>SIN EVALUAR</span>;
        }
    };

    return (
        <div style={{ padding: '0 24px 24px', width: '100%', boxSizing: 'border-box' }}>

            {/* Concepto del Coordinador - UX Mejorada */}
            <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#475569', fontWeight: '800', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Concepto Previo del Coordinador</span>
                
                <div style={{ 
                    background: '#fff',
                    border: '1px solid',
                    borderColor: coordExpanded ? (conceptoInfo ? conceptoInfo.color : '#cbd5e1') : '#e2e8f0',
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    boxShadow: coordExpanded ? `0 0 0 1px ${conceptoInfo ? conceptoInfo.color : '#e2e8f0'}22` : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 0.3s ease'
                }}>
                    <div 
                        onClick={() => setCoordExpanded(!coordExpanded)} 
                        style={{ 
                            padding: '14px 18px', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            background: coordExpanded ? '#f8fafc' : '#fff',
                            borderBottom: coordExpanded ? '1px solid #e2e8f0' : 'none'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ 
                                width: '36px', height: '36px', borderRadius: '8px', 
                                background: conceptoInfo ? conceptoInfo.bg : '#f1f5f9', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: `1px solid ${conceptoInfo ? conceptoInfo.color : '#cbd5e1'}44`
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={conceptoInfo ? conceptoInfo.color : '#94a3b8'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Concepto Final Coordinación</span>
                                {conceptoInfo ? (
                                    <span style={{ color: conceptoInfo.color, fontWeight: '800', fontSize: '14px', letterSpacing: '0.5px' }}>{conceptoInfo.texto}</span>
                                ) : (
                                    <span style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic', fontWeight: '500' }}>Pendiente / Sin registro</span>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>{coordExpanded ? 'Ocultar detalles' : 'Ver detalle'}</span>
                            <div style={{ background: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                <svg style={{ transform: coordExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', color: '#475569' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </div>
                    </div>

                    {coordExpanded && revision && (
                        <div style={{ padding: '20px', display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                            {/* Pertinencia */}
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
                                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }}></span> Pertinencia
                                    </span>
                                    {renderBadgeCriterio(revision.pertinencia_estado)}
                                </div>
                                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: '1.5', background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                                    "{revision.pertinencia_obs || 'Sin observaciones registradas.'}"
                                </p>
                            </div>

                            {/* Objetivos */}
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
                                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6', flexShrink: 0 }}></span> Objetivos
                                    </span>
                                    {renderBadgeCriterio(revision.objetivos_estado)}
                                </div>
                                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: '1.5', background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                                    "{revision.objetivos_obs || 'Sin observaciones registradas.'}"
                                </p>
                            </div>

                            {/* Metodología */}
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
                                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }}></span> Metodología
                                    </span>
                                    {renderBadgeCriterio(revision.metodologia_estado)}
                                </div>
                                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: '1.5', background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                                    "{revision.metodologia_obs || 'Sin observaciones registradas.'}"
                                </p>
                            </div>

                            {/* Viabilidad */}
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
                                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }}></span> Viabilidad
                                    </span>
                                    {renderBadgeCriterio(revision.viabilidad_estado)}
                                </div>
                                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: '1.5', background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                                    "{revision.viabilidad_obs || 'Sin observaciones registradas.'}"
                                </p>
                            </div>
                        </div>
                    )}
                    {coordExpanded && !revision && (
                        <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                            <svg style={{ margin: '0 auto 8px', color: '#cbd5e1' }} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                            <p style={{ margin: 0 }}>No hay evaluación detallada disponible para esta salida.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Diagnóstico Financiero */}
            <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>Diagnóstico Financiero</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#fff', border: '1px solid #cbd5e1', padding: '12px 14px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', border: '1px solid #e2e8f0', flexShrink: 0 }}>$</div>
                    <div>
                        <span style={{ display: 'block', fontWeight: 'bold', color: '#0f172a', fontSize: '13px', marginBottom: '2px' }}>{costoFormateado} — {pctPresupuesto}% del presupuesto</span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Impacto estimado sobre el presupuesto anual de la facultad.</span>
                    </div>
                </div>
            </div>

            {/* Formulario de Decisión */}
            <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#0f172a', fontWeight: '800', letterSpacing: '1px', display: 'block', marginBottom: '12px' }}>Mando de Decisión Oficial</span>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button type="button" onClick={() => setDecision('aprobado')} style={{ flex: 1, padding: '10px 0', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '11px', letterSpacing: '0.5px', transition: 'all 0.2s ease', ...estilosBtn('aprobado') }}>✓ APROBAR</button>
                    <button type="button" onClick={() => setDecision('ajustes')} style={{ flex: 1, padding: '10px 0', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '11px', letterSpacing: '0.5px', transition: 'all 0.2s ease', ...estilosBtn('ajustes') }}>⚠ AJUSTES</button>
                    <button type="button" onClick={() => setDecision('rechazado')} style={{ flex: 1, padding: '10px 0', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '11px', letterSpacing: '0.5px', transition: 'all 0.2s ease', ...estilosBtn('rechazado') }}>✕ RECHAZAR</button>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <textarea
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        style={{ width: '100%', border: '1px solid #cbd5e1', background: '#f8fafc', borderRadius: '8px', padding: '12px', minHeight: '60px', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', color: '#334155', resize: 'none', transition: 'border-color 0.2s' }}
                        placeholder={decision === 'aprobado' ? 'Observaciones finales opcionales...' : 'Especifique obligatoriamente el motivo de la decisión...'}
                        onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = '#94a3b8'; e.target.style.outline = 'none'; }}
                        onBlur={(e) => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#cbd5e1'; }}
                    />
                </div>

                {decision === 'ajustes' && (
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Fecha Límite para Ajustes *</label>
                        <input type="date" required value={fechaActa} onChange={(e) => setFechaActa(e.target.value)} style={{ width: '100%', border: '1px solid #cbd5e1', background: '#f8fafc', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', boxSizing: 'border-box', color: '#0f172a' }} />
                    </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', background: '#eff6ff', padding: '12px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                    <input type="checkbox" required id="budgetCheck" checked={presupuestoConfirmado} onChange={(e) => setPresupuestoConfirmado(e.target.checked)} style={{ marginTop: '1px', width: '14px', height: '14px', accentColor: '#1d4ed8' }} />
                    <label htmlFor="budgetCheck" style={{ fontSize: '11px', color: '#1e3a8a', lineHeight: '1.4', fontWeight: '600' }}>Que ha revisado el presupuesto de salidas asignado y autoriza su agendamiento de acuerdo a disponibilidad logística.</label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', background: loading ? '#cbd5e1' : '#0f172a', color: 'white', padding: '12px', fontWeight: '800', borderRadius: '8px', border: 'none', fontSize: '12px', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '1px', boxShadow: loading ? 'none' : '0 4px 6px -1px rgba(15, 23, 42, 0.4)', transition: 'all 0.2s ease' }}
                    onMouseOver={(e) => { if (!loading) e.target.style.transform = 'translateY(-1px)'; }}
                    onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; }}
                >{loading ? 'Registrando...' : 'REGISTRAR DECISIÓN'}</button>
            </form>
        </div>
    );
};

export default PanelDecisionConsejo;
