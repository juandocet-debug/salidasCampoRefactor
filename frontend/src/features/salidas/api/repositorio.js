// src/funcionalidades/salidas/api/salidaApi.js
// ──────────────────────────────────────────────────────────────────────────
// ADAPTADOR HTTP del slice Salidas
// ──────────────────────────────────────────────────────────────────────────

import { clienteHttp } from '@/shared/api/clienteHttp';

const BASE = '/api/profesor/salidas';

// ── Consultas ──────────────────────────────────────────────────────────────

/** Retorna todas las salidas del profesor autenticado */
export async function listarMisSalidas() {
  const { data } = await clienteHttp.get(`${BASE}/`);
  return data;
}

/** Retorna el detalle de una salida por ID */
export async function obtenerSalida(id) {
  const { data } = await clienteHttp.get(`${BASE}/${id}/`);
  return data;
}

// ── Mutaciones ─────────────────────────────────────────────────────────────

/**
 * Crea una nueva salida en estado BORRADOR.
 * @param {object} payload - Campos del Paso 1 del wizard
 */
export async function crearSalida(payload) {
  const { data } = await clienteHttp.post(`${BASE}/`, payload);
  return data;
}

/**
 * Actualiza una salida existente (modo edición del wizard)
 * @param {number} id
 * @param {object} payload
 */
export async function actualizarSalida(id, payload) {
  const { data } = await clienteHttp.patch(`${BASE}/${id}/`, payload);
  return data;
}

/**
 * Mueve la salida de BORRADOR → ENVIADA
 * @param {number} id
 */
export async function enviarSolicitud(id) {
  const { data } = await clienteHttp.post(`${BASE}/${id}/enviar/`);
  return data;
}

/**
 * Cancela una salida activa
 * @param {number} id
 */
export async function cancelarSalida(id) {
  const { data } = await clienteHttp.post(`${BASE}/${id}/cancelar/`);
  return data;
}

/**
 * Elimina permanentemente una salida en estado BORRADOR.
 * @param {number} id
 */
export async function eliminarSalida(id) {
  await clienteHttp.delete(`${BASE}/${id}/`);
}
