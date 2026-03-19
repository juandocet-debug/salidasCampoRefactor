// src/funcionalidades/checklist/api/checklistApi.js  (<50 líneas)

import { clienteHttp } from '../../../nucleo/api/clienteHttp';

const BASE = (asignacionId) => `/api/asignaciones/${asignacionId}/checklist`;

/** Obtiene el checklist con progreso de una asignación */
export async function obtenerChecklist(asignacionId) {
    const { data } = await clienteHttp.get(`${BASE(asignacionId)}/`);
    return data;  // { puede_iniciar, progreso, items, items_no_ok }
}

/** Conductor marca un ítem como ok/no_ok/na */
export async function marcarItem(asignacionId, itemId, estado, observacion = '') {
    const { data } = await clienteHttp.patch(
        `${BASE(asignacionId)}/items/${itemId}/`,
        { estado, observacion }
    );
    return data;
}
