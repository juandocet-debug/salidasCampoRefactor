// src/funcionalidades/salidas/estado/useSalidas.js
// ──────────────────────────────────────────────────────────────────────────
// ESTADO LOCAL del slice Salidas
//
// Patrón: Custom Hook con useState + useEffect.
// NO usa Zustand ni Redux — mantenemos el estado simple con React nativo,
// tal como lo tiene el resto del proyecto.
//
// Este hook encapsula:
//  - La lista de salidas del profesor
//  - Los estados de carga y error
//  - Las acciones: cargar, crear, enviar
// ──────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { listarMisSalidas, crearSalida, enviarSolicitud, eliminarSalida } from '../api/salidaApi';

/**
 * Hook que gestiona el estado de las salidas del profesor autenticado.
 *
 * @returns {{
 *   salidas: array,
 *   cargando: boolean,
 *   error: string|null,
 *   cargar: function,
 *   recargar: function,
 *   crear: function,
 *   enviar: function,
 *   eliminar: function,
 * }}
 */
export function useSalidas() {
  const [salidas, setSalidas]   = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError]       = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await listarMisSalidas();
      setSalidas(data);
    } catch (e) {
      setError(e?.response?.data?.detail || 'Error al cargar las salidas.');
    } finally {
      setCargando(false);
    }
  }, []);

  // Carga inicial automática
  useEffect(() => { cargar(); }, [cargar]);

  /**
   * Crea una nueva salida y recarga la lista.
   * @param {object} payload
   * @returns {object} Salida creada
   */
  const crear = useCallback(async (payload) => {
    const nueva = await crearSalida(payload);
    await cargar();
    return nueva;
  }, [cargar]);

  /**
   * Envía una solicitud (BORRADOR → ENVIADA) y recarga.
   * @param {number} id
   */
  const enviar = useCallback(async (id) => {
    await enviarSolicitud(id);
    await cargar();
  }, [cargar]);

  /**
   * Elimina una salida por ID y recarga la lista.
   * @param {number} id
   */
  const eliminar = useCallback(async (id) => {
    await eliminarSalida(id);
    await cargar();
  }, [cargar]);

  return {
    salidas,
    cargando,
    error,
    cargar,
    recargar: cargar,
    crear,
    enviar,
    eliminar,
  };
}
