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
        </div>
    );
};

export default PaginaHistorico;
