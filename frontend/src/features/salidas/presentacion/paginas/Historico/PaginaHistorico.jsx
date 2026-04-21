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

    // ── Modal del Consejo ─────────────────────────────────────────────────
    const renderModalConsejo = () => {
        if (!salidaFeedback || !salidaFeedback.decision_consejo) return null;
        const dc = salidaFeedback.decision_consejo;
        const MAPA = {
            aprobado:  { texto: 'APROBADO',  color: '#10b981', bg: '#ecfdf5' },
            rechazado: { texto: 'RECHAZADO', color: '#ef4444', bg: '#fef2f2' },
            ajustes:   { texto: 'EN AJUSTE', color: '#f59e0b', bg: '#fffbeb' },
        };
        const conceptoInfo = MAPA[dc.concepto_financiero] || { texto: (dc.concepto_financiero || '').toUpperCase(), color: '#64748b', bg: '#f8fafc' };

        return (
            <ModalConfirmar
                titulo="Concepto del Consejo de Facultad"
                tipo="info"
                labelConfirmar={null}
                labelCancelar="Cerrar"
                estiloContenedor={{ maxWidth: '600px', width: '95%' }}
                onConfirmar={null}
                onCancelar={() => setSalidaFeedback(null)}
                descripcion={
                    <div style={{ textAlign: 'left', width: '100%' }}>
                        {/* Encabezado */}
                        <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
                            <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                Decisión Oficial del Consejo
                            </span>
                            <span style={{ display: 'inline-block', padding: '6px 20px', borderRadius: '20px', fontSize: '16px', fontWeight: '800', color: conceptoInfo.color, background: conceptoInfo.bg, border: `1px solid ${conceptoInfo.color}44`, letterSpacing: '0.5px' }}>
                                {conceptoInfo.texto}
                            </span>
                        </div>

                        {/* Observaciones */}
                        {dc.observaciones && (
                            <div style={{ marginBottom: '16px' }}>
                                <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Observaciones del Consejo</span>
                                <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: '#92400e', lineHeight: '1.5', wordBreak: 'break-word' }}>
                                    {dc.observaciones}
                                </div>
                            </div>
                        )}

                        {/* Acta y fecha */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                            {dc.acta && (
                                <div>
                                    <span style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>No. Acta</span>
                                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>{dc.acta}</span>
                                </div>
                            )}
                            {dc.fecha_acta && (
                                <div>
                                    <span style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Fecha Límite de Ajuste</span>
                                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>{dc.fecha_acta}</span>
                                </div>
                            )}
                        </div>

                        <p style={{ marginTop: '16px', fontSize: '12px', color: '#64748b', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '10px 12px' }}>
                            ⚠️ El Consejo de Facultad ha solicitado ajustes. Por favor realice las correcciones necesarias y vuelva a enviar la salida para una nueva revisión.
                        </p>
                    </div>
                }
            />
        );
    };

    // ── Modal de Coordinación ─────────────────────────────────────────────
    const renderModalCoordinacion = () => {
        if (!salidaFeedback || salidaFeedback.decision_consejo) return null;
        const rev = salidaFeedback.ultima_revision;
        if (!rev) return null;

        const labels = {
            pertinencia: 'Pertinencia con Plan de Estudios',
            objetivos:   'Coherencia de Objetivos',
            metodologia: 'Metodología Adecuada',
            viabilidad:  'Viabilidad Logística',
        };

        return (
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
                                {rev.concepto_final.replace(/_/g, ' ')}
                            </h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px', padding: '0 4px', width: '100%' }}>
                            {['pertinencia', 'objetivos', 'metodologia', 'viabilidad'].map((key, i) => {
                                const item = rev[key];
                                let bgColor = '#f1f5f9', txColor = '#475569';
                                if (item.estado === 'CUMPLE')    { bgColor = '#dcfce7'; txColor = '#166534'; }
                                else if (item.estado === 'PARCIAL')   { bgColor = '#fef3c7'; txColor = '#92400e'; }
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
                                                {item.obs || (item.estado === 'CUMPLE'
                                                    ? <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>Evaluación satisfactoria. Sin observaciones adicionales detalladas por el revisor.</span>
                                                    : 'Sin detalles proporcionados.')}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                }
            />
        );
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

            {/* ── Modal: Concepto (se auto-selecciona según el origen del ajuste) */}
            {renderModalCoordinacion()}
            {renderModalConsejo()}
        </div>
    );
};

export default PaginaHistorico;
