// src/modulos/profesor/paginas/TableroProfesor.jsx
// ─────────────────────────────────────────────────────────────────
// TABLERO DEL PROFESOR — Usa el slice funcionalidades/salidas
// ─────────────────────────────────────────────────────────────────

import React, { useEffect } from 'react';
import { useSalidas } from '@/features/salidas/presentacion/hooks/useSalidas';
import './TableroProfesor.css';

import KpisProfesor         from '@/features/salidas/presentacion/componentes/KpisProfesor/KpisProfesor';
import BarraAccionesProfesor from '@/features/salidas/presentacion/componentes/BarraAccionesProfesor/BarraAccionesProfesor';
import ListaTarjetasProfesor from '@/features/salidas/presentacion/componentes/ListaTarjetasProfesor/ListaTarjetasProfesor';
import WidgetCalendarioProfesor from '@/features/salidas/presentacion/componentes/WidgetCalendarioProfesor/WidgetCalendarioProfesor';
import WidgetUsuariosProfesor   from '@/features/salidas/presentacion/componentes/WidgetUsuariosProfesor/WidgetUsuariosProfesor';
import useAlertas from '@/shared/estado/useAlertas';
import ModalConfirmar from '@/shared/componentes/generales/ModalConfirmar/ModalConfirmar';

const TableroProfesor = () => {
    const { agregarAlerta } = useAlertas();
    const { salidas, cargando, error, cargar, eliminar, enviar } = useSalidas();

    const [salidaAEnviar, setSalidaAEnviar] = React.useState(null);
    const [enviando, setEnviando] = React.useState(false);

    const handleConfirmarEnviar = async () => {
        if (!salidaAEnviar) return;
        setEnviando(true);
        try {
            await enviar(salidaAEnviar.id);
            agregarAlerta(`"${salidaAEnviar.nombre}" enviada a revisión.`, 'exito');
            setSalidaAEnviar(null);
        } catch (err) {
            agregarAlerta(err.message || 'No se pudo enviar la salida.', 'error');
        } finally {
            setEnviando(false);
        }
    };

    useEffect(() => { cargar(); }, [cargar]);

    useEffect(() => {
        if (error) agregarAlerta(error, 'error');
    }, [error, agregarAlerta]);

    // Refresca al volver a la pestaña (ej: tras crear una salida)
    useEffect(() => {
        const onFocus = () => cargar();
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [cargar]);

    return (
        <>
            <div className="tablero-prof">
                <div className="tablero-prof__principal">
                    <KpisProfesor salidas={salidas} cargando={cargando} />
                    <BarraAccionesProfesor />
                    <ListaTarjetasProfesor
                        salidas={salidas}
                        cargando={cargando}
                        onSalidaEliminada={(id) => eliminar(id)}
                        onSalidaEnviada={(s) => setSalidaAEnviar(s)}
                    />
                </div>
                <div className="tablero-prof__lateral">
                    <WidgetCalendarioProfesor />
                    <WidgetUsuariosProfesor />
                </div>
            </div>
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
                    cargando={enviando}
                    tipo="accion"
                    onConfirmar={handleConfirmarEnviar}
                    onCancelar={() => setSalidaAEnviar(null)}
                />
            )}
        </>
    );
};

export default TableroProfesor;

