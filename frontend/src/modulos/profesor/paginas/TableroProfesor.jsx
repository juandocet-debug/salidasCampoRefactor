// src/modulos/profesor/paginas/TableroProfesor.jsx
// ─────────────────────────────────────────────────────────────────
// TABLERO DEL PROFESOR — Usa el slice funcionalidades/salidas
// ─────────────────────────────────────────────────────────────────

import React, { useEffect } from 'react';
import { useSalidas } from '../../../funcionalidades/salidas/estado/useSalidas';
import './TableroProfesor.css';

import KpisProfesor         from '../componentes/tablero/KpisProfesor';
import BarraAccionesProfesor from '../componentes/tablero/BarraAccionesProfesor';
import ListaTarjetasProfesor from '../componentes/tablero/ListaTarjetasProfesor';
import WidgetCalendarioProfesor from '../componentes/tablero/WidgetCalendarioProfesor';
import WidgetUsuariosProfesor   from '../componentes/tablero/WidgetUsuariosProfesor';
import useAlertas from '../../../nucleo/estado/useAlertas';

const TableroProfesor = () => {
    const { agregarAlerta } = useAlertas();
    const { salidas, cargando, error, cargar, eliminar } = useSalidas();

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
        <div className="tablero-prof">
            <div className="tablero-prof__principal">
                <KpisProfesor salidas={salidas} cargando={cargando} />
                <BarraAccionesProfesor />
                <ListaTarjetasProfesor
                    salidas={salidas}
                    cargando={cargando}
                    onSalidaEliminada={(id) => eliminar(id)}
                />
            </div>
            <div className="tablero-prof__lateral">
                <WidgetCalendarioProfesor />
                <WidgetUsuariosProfesor />
            </div>
        </div>
    );
};

export default TableroProfesor;

