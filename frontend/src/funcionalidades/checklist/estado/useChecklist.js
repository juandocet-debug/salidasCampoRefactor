// src/funcionalidades/checklist/estado/useChecklist.js  (<80 líneas)

import { useState, useCallback } from 'react';
import { obtenerChecklist, marcarItem } from '../api/checklistApi';

export function useChecklist(asignacionId) {
    const [checklist,  setChecklist]  = useState(null);
    const [cargando,   setCargando]   = useState(false);
    const [marcando,   setMarcando]   = useState(null); // id del ítem en proceso
    const [error,      setError]      = useState(null);

    const cargar = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            const data = await obtenerChecklist(asignacionId);
            setChecklist(data);
        } catch {
            setError('No se pudo cargar el checklist.');
        } finally {
            setCargando(false);
        }
    }, [asignacionId]);

    const marcar = useCallback(async (itemId, estado, observacion = '') => {
        setMarcando(itemId);
        try {
            await marcarItem(asignacionId, itemId, estado, observacion);
            await cargar(); // Refresca el progreso
        } finally {
            setMarcando(null);
        }
    }, [asignacionId, cargar]);

    return {
        checklist,
        cargando,
        marcando,
        error,
        cargar,
        marcar,
        puedeIniciar: checklist?.puede_iniciar ?? false,
        progreso:     checklist?.progreso ?? { porcentaje: 0, completados: 0, total: 0 },
    };
}
