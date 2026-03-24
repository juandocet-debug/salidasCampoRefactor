// src/funcionalidades/novedades/api/novedadApi.js  (<60 líneas)

import { clienteHttp } from '@/shared/api/clienteHttp';

const BASE = (salidaId) => `/api/salidas/${salidaId}/novedades`;

/** Lista todas las novedades de una salida con stats */
export async function listarNovedades(salidaId) {
    const { data } = await clienteHttp.get(`${BASE(salidaId)}/`);
    return data;  // { novedades, total, criticas, abiertas }
}

/** Conductor registra un incidente durante la ejecución */
export async function registrarNovedad(salidaId, payload) {
    const { data } = await clienteHttp.post(`${BASE(salidaId)}/`, payload);
    return data;
}

/** Coordinador marca una novedad como resuelta */
export async function resolverNovedad(salidaId, novedadId) {
    const { data } = await clienteHttp.post(`${BASE(salidaId)}/${novedadId}/resolver/`);
    return data;
}
