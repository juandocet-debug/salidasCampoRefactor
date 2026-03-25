import { clienteHttp } from '@/shared/api/clienteHttp';

/**
 * Endpoint unificado para obtener Facultades, Programas y Ventanas.
 */
export async function obtenerCatalogosAcademicos() {
    const res = await clienteHttp.get('/api/admin/catalogos/');
    return res.data;
}

/**
 * NOTA: El backend Django actualmente NO expone endpoints POST/PATCH/DELETE 
 * ni para facultades ni para programas. Se apuntan a /api/admin/catalogos/ 
 * (lo cual devolverá 405 Method Not Allowed) o a las rutas nominales 
 * (que darán 404). 
 * Se dejan preparados para cuando el backend los exponga.
 */
const API_FAC = '/api/facultades/';
const API_PROG = '/api/programas/';

export async function crearFacultad(datos) {
    const res = await clienteHttp.post(API_FAC, datos);
    return res.data;
}

export async function crearPrograma(datos) {
    const res = await clienteHttp.post(API_PROG, datos);
    return res.data;
}

export async function actualizarFacultad(id, datos) {
    const res = await clienteHttp.patch(`${API_FAC}${id}/`, datos);
    return res.data;
}

export async function actualizarPrograma(id, datos) {
    const res = await clienteHttp.patch(`${API_PROG}${id}/`, datos);
    return res.data;
}

export async function eliminarFacultad(id) {
    const res = await clienteHttp.delete(`${API_FAC}${id}/`);
    return res.data;
}

export async function eliminarPrograma(id) {
    const res = await clienteHttp.delete(`${API_PROG}${id}/`);
    return res.data;
}
