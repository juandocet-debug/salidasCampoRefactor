// src/funcionalidades/abordaje/api/abordajeApi.js
// ──────────────────────────────────────────────────────────────────────────
// ADAPTADOR HTTP del slice Abordaje — <100 líneas
// ──────────────────────────────────────────────────────────────────────────

import { clienteHttp } from '../../../nucleo/api/clienteHttp';

const BASE_EST  = (salidaId) => `/api/estudiante/salidas/${salidaId}`;
const BASE_COND = (salidaId) => `/api/conductor/salidas/${salidaId}`;
const BASE_COORD = (salidaId) => `/api/coordinador/salidas/${salidaId}`;

// ── Estudiante ─────────────────────────────────────────────────────────────

/** Estudiante activa su código de 6 chars para el día de la salida */
export async function activarCodigo(salidaId, fotoUrl) {
    const { data } = await clienteHttp.post(
        `${BASE_EST(salidaId)}/activar-codigo/`,
        { foto_url: fotoUrl }
    );
    return data;  // { codigo, expira_en }
}

// ── Conductor / Profesor ───────────────────────────────────────────────────

/** Conductor o Profesor confirman el abordaje ingresando el código del estudiante */
export async function confirmarAbordaje(salidaId, codigo) {
    const { data } = await clienteHttp.post(
        `${BASE_COND(salidaId)}/confirmar-abordaje/`,
        { codigo: codigo.toUpperCase() }
    );
    return data;  // { abordado, estudiante_id, verificado_en }
}

// ── Coordinador── ──────────────────────────────────────────────────────────

/** Lista de abordaje con estadísticas (total / abordados / pendientes / %) */
export async function listarAbordaje(salidaId) {
    const { data } = await clienteHttp.get(
        `${BASE_COORD(salidaId)}/abordaje/`
    );
    return data;
}
