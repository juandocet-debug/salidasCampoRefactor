import { clienteHttp } from '@/shared/api/clienteHttp';

/**
 * Servicio para obtener la lista de salidas pendientes de asignación logística.
 * Pertenece a la capa de Aplicación/Infraestructura (según variante hexagonal en frontend).
 * @returns {Promise<Array>} Lista de salidas
 */
export async function obtenerSalidasPendientesLogistica() {
    const res = await clienteHttp.get('/api/salidas/logistica/pendientes/');
    return res.data;
}

/**
 * Obtener vehículos catalogados (flota propia y externa configurada)
 * @param {Object} opciones - Filtros opcionales: { fecha_inicio, fecha_fin, salida_id }
 */
export async function obtenerVehiculosDisponibles(opciones = {}) {
    const params = new URLSearchParams();
    if (opciones.fecha_inicio) params.append('fecha_inicio', opciones.fecha_inicio);
    if (opciones.fecha_fin) params.append('fecha_fin', opciones.fecha_fin);
    if (opciones.salida_id) params.append('salida_id', opciones.salida_id);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await clienteHttp.get(`/api/transporte/vehiculos/${query}`);
    return res.data;
}

/**
 * Servicio para asignar transporte a una salida.
 * @param {Object} payload DTO con la información de asignación
 * @returns {Promise<Object>} Respuesta de éxito
 */
export async function asignarTransporteLogistica(payload) {
    const res = await clienteHttp.post('/api/salidas/logistica/asignar/', payload);
    return res.data;
}

export async function limpiarAsignacionLogistica(salidaId) {
    const res = await clienteHttp.delete(`/api/salidas/logistica/asignar/?salida_id=${salidaId}`);
    return res.data;
}

export async function cambiarEstadoPreembarque(salidaId) {
    const res = await clienteHttp.post('/api/salidas/logistica/preembarque/', { salida_id: salidaId });
    return res.data;
}

/**
 * Servicio para registrar una novedad en la evaluación de una salida.
 * @param {Object} payload Nivel y mensaje de la novedad
 */
export async function registrarNovedadOperativa(payload) {
    const res = await clienteHttp.post('/api/salidas/logistica/novedades/', payload);
    return res.data;
}

/**
 * Servicio para asentar el cierre operativo de la logística.
 * @param {Object} payload Información base y checklist de retorno
 */
export async function registrarCierreOperativo(payload) {
    const res = await clienteHttp.post('/api/salidas/logistica/cierres/', payload);
    return res.data;
}

// ─── Empresas de Transporte Contratado ───────────────────────────────────────

export async function obtenerEmpresasContratadas() {
    const res = await clienteHttp.get('/api/transporte/empresas/');
    return res.data;
}

export async function crearEmpresaContratada(payload) {
    const res = await clienteHttp.post('/api/transporte/empresas/', payload);
    return res.data;
}

export async function eliminarEmpresaContratada(id) {
    const res = await clienteHttp.delete(`/api/transporte/empresas/${id}/`);
    return res.data;
}

export async function actualizarEmpresaContratada(id, payload) {
    const res = await clienteHttp.patch(`/api/transporte/empresas/${id}/`, payload);
    return res.data;
}

// ─── Conductores Externos ─────────────────────────────────────────────────────

export async function obtenerConductoresPorEmpresa(empresa_id) {
    const res = await clienteHttp.get(`/api/transporte/conductores/?empresa_id=${empresa_id}`);
    return res.data;
}

export async function crearConductorExterno(payload) {
    const res = await clienteHttp.post('/api/transporte/conductores/', payload);
    return res.data;
}

export async function eliminarConductorExterno(id) {
    const res = await clienteHttp.delete(`/api/transporte/conductores/${id}/`);
    return res.data;
}

export async function actualizarConductorExterno(id, payload) {
    const res = await clienteHttp.patch(`/api/transporte/conductores/${id}/`, payload);
    return res.data;
}

