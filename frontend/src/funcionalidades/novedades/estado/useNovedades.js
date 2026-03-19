// src/funcionalidades/novedades/estado/useNovedades.js  (<80 líneas)

import { useState, useCallback } from 'react';
import { listarNovedades, registrarNovedad, resolverNovedad } from '../api/novedadApi';

export function useNovedades(salidaId) {
    const [novedades, setNovedades] = useState([]);
    const [stats,     setStats]     = useState({ total: 0, criticas: 0, abiertas: 0 });
    const [cargando,  setCargando]  = useState(false);
    const [error,     setError]     = useState(null);

    const cargar = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            const data = await listarNovedades(salidaId);
            setNovedades(data.novedades ?? []);
            setStats({ total: data.total, criticas: data.criticas, abiertas: data.abiertas });
        } catch {
            setError('No se pudieron cargar las novedades.');
        } finally {
            setCargando(false);
        }
    }, [salidaId]);

    const registrar = useCallback(async (payload) => {
        const nueva = await registrarNovedad(salidaId, payload);
        await cargar();
        return nueva;
    }, [salidaId, cargar]);

    const resolver = useCallback(async (novedadId) => {
        await resolverNovedad(salidaId, novedadId);
        await cargar();
    }, [salidaId, cargar]);

    return { novedades, stats, cargando, error, cargar, registrar, resolver };
}
