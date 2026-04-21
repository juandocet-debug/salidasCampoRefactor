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
 */
export async function obtenerVehiculosDisponibles() {
    const res = await clienteHttp.get('/api/transporte/vehiculos/');
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
