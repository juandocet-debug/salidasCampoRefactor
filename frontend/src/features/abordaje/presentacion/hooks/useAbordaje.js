// src/funcionalidades/abordaje/estado/useAbordaje.js
// ─────────────────────────────────────────────────────────────────────────
// ESTADO del slice Abordaje — <100 líneas
// Custom hook con useState nativo (sin Zustand, igual que useSalidas)
// ─────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import {
    verificarCodigoAbordajeServicio,
    obtenerResumenAbordajeServicio
} from '@/features/abordaje/aplicacion/servicios';

/** Hook para el CONDUCTOR: verificar el código de un estudiante */
export function useConfirmarAbordaje(salidaId) {
    const [cargando, setCargando] = useState(false);
    const [error,    setError]    = useState(null);
    const [resultado,setResultado]= useState(null);

    const confirmar = useCallback(async (codigo) => {
        setCargando(true);
        setError(null);
        setResultado(null);
        try {
            const data = await verificarCodigoAbordajeServicio(salidaId, codigo);
            setResultado(data);
            return data;
        } catch (e) {
            const msg = e.message;
            setError(msg);
            throw e;
        } finally {
            setCargando(false);
        }
    }, [salidaId]);

    const limpiar = useCallback(() => {
        setError(null);
        setResultado(null);
    }, []);

    return { confirmar, cargando, error, resultado, limpiar };
}

/** Hook para el COORDINADOR: ver el resumen de abordaje en tiempo real */
export function useListaAbordaje(salidaId) {
    const [stats,   setStats]   = useState(null);
    const [cargando,setCargando]= useState(false);
    const [error,   setError]   = useState(null);

    const cargar = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            const data = await obtenerResumenAbordajeServicio(salidaId);
            setStats(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setCargando(false);
        }
    }, [salidaId]);

    return { stats, cargando, error, cargar };
}
