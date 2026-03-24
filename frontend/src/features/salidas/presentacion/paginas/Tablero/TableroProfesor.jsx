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

