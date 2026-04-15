import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSalidas } from '@/features/salidas/presentacion/hooks/useSalidas';
import useAlertas from '@/shared/estado/useAlertas';
import TablaHistorico from '@/shared/componentes/generales/TablaHistorico/TablaHistorico';
import ModalConfirmar from '@/shared/componentes/generales/ModalConfirmar/ModalConfirmar';

const PaginaHistorico = () => {
    const navigate = useNavigate();
    const { agregarAlerta } = useAlertas();
    const { salidas, cargando, enviar, eliminar } = useSalidas();

    // ── Estado modales ─────────────────────────────────────────────────────
    const [salidaAEnviar,  setSalidaAEnviar]  = useState(null);
    const [salidaABorrar,  setSalidaABorrar]  = useState(null);
    const [salidaFeedback, setSalidaFeedback] = useState(null);
    const [procesando,     setProcesando]      = useState(false);

    // ── Handlers ───────────────────────────────────────────────────────────
    const handleEditar = (salida) => navigate(`/nueva-salida?editar=${salida.id}`);

    const handleConfirmarEnviar = async () => {
        if (!salidaAEnviar) return;
        setProcesando(true);
        try {
            await enviar(salidaAEnviar.id);
            agregarAlerta(`"${salidaAEnviar.nombre}" enviada a revisión del coordinador.`, 'exito');
            setSalidaAEnviar(null);
        } catch (err) {
            agregarAlerta(err.message || 'No se pudo enviar la salida.', 'error');
        } finally {
            setProcesando(false);
        }
    };

    const handleConfirmarBorrar = async () => {
        if (!salidaABorrar) return;
        setProcesando(true);
        try {
            await eliminar(salidaABorrar.id);
            agregarAlerta(`Salida "${salidaABorrar.nombre}" eliminada.`, 'exito');
            setSalidaABorrar(null);
        } catch (err) {
            agregarAlerta(err.message || 'No se pudo eliminar la salida.', 'error');
        } finally {
            setProcesando(false);
        }
    };

    return (
        <div style={{ padding: '0', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, width: '100%' }}>
                <br />
                <TablaHistorico
                    salidas={salidas}
                    cargando={cargando}
                    onEnviar={(s) => setSalidaAEnviar(s)}
                    onEditar={handleEditar}
                    onEliminar={(s) => setSalidaABorrar(s)}
                    onVerDictamen={(s) => setSalidaFeedback(s)}
                />
            </div>

            {/* ── Modal: Confirmar ENVÍO ────────────────────────────────────── */}
            {salidaAEnviar && (
                <ModalConfirmar
                    titulo="¿Enviar salida a revisión?"
                    descripcion={
                        <>
                            Se enviará <strong>"{salidaAEnviar.nombre}"</strong> al coordinador.
                            Una vez enviada, <strong>no podrás editarla ni eliminarla</strong>.
                        </>
                    }
                    labelConfirmar="Sí, enviar"
                    labelCargando="Enviando..."
                    cargando={procesando}
                    tipo="accion"
                    onConfirmar={handleConfirmarEnviar}
                    onCancelar={() => setSalidaAEnviar(null)}
                />
            )}

            {/* ── Modal: Confirmar ELIMINACIÓN ─────────────────────────────── */}
            {salidaABorrar && (
                <ModalConfirmar
                    titulo="¿Eliminar salida?"
                    descripcion={
                        <>
                            Se eliminará permanentemente <strong>"{salidaABorrar.nombre}"</strong>.
                            Esta acción no se puede deshacer.
                        </>
                    }
                    cargando={procesando}
                    onConfirmar={handleConfirmarBorrar}
                    onCancelar={() => setSalidaABorrar(null)}
                />
            )}

            {/* ── Modal: Concepto de Coordinación ─────────────────────────── */}
            {salidaFeedback && (
                <ModalConfirmar
                    titulo="Concepto de Coordinación"
                    tipo="accion"
                    labelConfirmar="Corregir Salida"
                    estiloContenedor={{ maxWidth: '850px', width: '95%' }}
                    onConfirmar={() => { setSalidaFeedback(null); handleEditar(salidaFeedback); }}
                    onCancelar={() => setSalidaFeedback(null)}
                    descripcion={
                        <div style={{ marginTop: '10px', textAlign: 'left', width: '100%', maxHeight: '60vh', overflowY: 'auto' }}>
                            <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
                                <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                    Concepto Técnico Oficial
                                </span>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
                                    {salidaFeedback.ultima_revision.concepto_final.replace(/_/g, ' ')}
                                </h3>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px', padding: '0 4px', width: '100%' }}>
                                {['pertinencia', 'objetivos', 'metodologia', 'viabilidad'].map((key, i) => {
                                    const item = salidaFeedback.ultima_revision[key];
                                    const labels = {
                                        'pertinencia': 'Pertinencia con Plan de Estudios',
                                        'objetivos': 'Coherencia de Objetivos',
                                        'metodologia': 'Metodología Adecuada',
                                        'viabilidad': 'Viabilidad Logística'
                                    };
                                    let bgColor = '#f1f5f9';
                                    let txColor = '#475569';
                                    if (item.estado === 'CUMPLE') { bgColor = '#dcfce7'; txColor = '#166534'; }
                                    else if (item.estado === 'PARCIAL') { bgColor = '#fef3c7'; txColor = '#92400e'; }
                                    else if (item.estado === 'NO_CUMPLE') { bgColor = '#fee2e2'; txColor = '#991b1b'; }

                                    return (
                                        <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontSize: '13px', fontWeight: '700', flexShrink: 0, marginTop: '2px' }}>
                                                {i + 1}
                                            </div>
                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                                                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1e293b', lineHeight: '1.3' }}>{labels[key]}</h4>
                                                    <span style={{ fontSize: '10.5px', fontWeight: '800', color: txColor, background: bgColor, padding: '4px 10px', borderRadius: '12px', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
                                                        {item.estado.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #f1f5f9', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                                    {item.obs || (item.estado === 'CUMPLE' ? <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>Evaluación satisfactoria. Sin observaciones adicionales detalladas por el revisor.</span> : 'Sin detalles proporcionados.')}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    }
                />
            )}
        </div>
    );
};

export default PaginaHistorico;
