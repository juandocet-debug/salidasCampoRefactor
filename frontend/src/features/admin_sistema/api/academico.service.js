import { clienteHttp } from '@/shared/api/clienteHttp';

// ── Endpoint masivo (Facultades + Programas + Materias + Ventanas) ─────────────
export async function obtenerCatalogosAcademicos() {
    const res = await clienteHttp.get('/api/admin/catalogos/');
    return res.data;
}

// ── Facultades ────────────────────────────────────────────────────────────────
const API_FAC = '/api/facultades/';

export async function crearFacultad(datos) {
    const res = await clienteHttp.post(API_FAC, datos);
    return res.data;
}
export async function actualizarFacultad(id, datos) {
    const res = await clienteHttp.patch(`${API_FAC}${id}/`, datos);
    return res.data;
}
export async function eliminarFacultad(id) {
    const res = await clienteHttp.delete(`${API_FAC}${id}/`);
    return res.data;
}

// ── Programas ─────────────────────────────────────────────────────────────────
const API_PROG = '/api/programas/';

export async function crearPrograma(datos) {
    const res = await clienteHttp.post(API_PROG, datos);
    return res.data;
}
export async function actualizarPrograma(id, datos) {
    const res = await clienteHttp.patch(`${API_PROG}${id}/`, datos);
    return res.data;
}
export async function eliminarPrograma(id) {
    const res = await clienteHttp.delete(`${API_PROG}${id}/`);
    return res.data;
}

// ── Materias ──────────────────────────────────────────────────────────────────
const API_MAT = '/api/materias/';

export async function obtenerMaterias(programa_id = null) {
    const params = programa_id ? `?programa_id=${programa_id}` : '';
    const res = await clienteHttp.get(`${API_MAT}${params}`);
    return res.data;
}
export async function crearMateria(datos) {
    const res = await clienteHttp.post(API_MAT, datos);
    return res.data;
}
export async function actualizarMateria(id, datos) {
    const res = await clienteHttp.patch(`${API_MAT}${id}/`, datos);
    return res.data;
}
export async function eliminarMateria(id) {
    const res = await clienteHttp.delete(`${API_MAT}${id}/`);
    return res.data;
}
