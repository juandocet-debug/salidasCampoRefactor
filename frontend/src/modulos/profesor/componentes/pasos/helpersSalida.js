// src/modulos/profesor/paginas/helpersSalida.js
// ─────────────────────────────────────────────────────────────────────────────
// Helpers para PaginaNuevaSalida: construcción de payload, carga, y envío.
// Extraídos para mantener el componente principal bajo 200 líneas.
// ─────────────────────────────────────────────────────────────────────────────
import axios from 'axios';
import { API_URL } from '../../../../nucleo/api/config';

/**
 * Arma el payload a enviar al backend desde el form y estado grupal.
 */
export function construirPayload(form, esGrupal, profesoresAsociados) {
    return {
        nombre: form.nombre, asignatura: form.asignatura,
        semestre: form.semestre, facultad: form.facultad, programa: form.programa,
        num_estudiantes: form.num_estudiantes, justificacion: form.justificacion,
        fecha_inicio: form.fecha_inicio || null,
        fecha_fin: form.fecha_fin || null,
        hora_inicio: form.hora_inicio || null,
        hora_fin: form.hora_fin || null,
        icono: form.icono, color: form.color,
        resumen: form.resumen,
        relacion_syllabus: form.relacion_syllabus,
        productos_esperados: form.productos_esperados,
        objetivo_general: form.objetivo_general,
        objetivos_especificos: form.objetivos_especificos,
        estrategia_metodologica: form.estrategia_metodologica,
        punto_partida: form.punto_partida,
        parada_max: form.parada_max,
        puntos_ruta_data: form._puntosRuta || [],
        puntos_retorno_data: form._puntosRetorno || [],
        criterio_evaluacion_texto: form.criterios_evaluacion,
        es_grupal: esGrupal,
        profesores_asociados_ids: esGrupal ? profesoresAsociados.map(p => p.id) : [],
        // Datos de cálculo de costo (para recálculo automático)
        distancia_total_km: form.distancia_total_km || 0,
        duracion_dias: form.duracion_dias || 1,
        horas_viaje: form.horas_viaje || 9,
        costo_estimado: form.costo_estimado || 0,
        tipo_vehiculo_calculo: form.tipo_vehiculo_calculo || 'bus',
    };
}

/**
 * Carga los datos de una salida existente para edición.
 * Retorna { formData, esGrupal, profesoresAsociados } o lanza error.
 */
export async function cargarSalidaParaEdicion(editarId, token) {
    const res = await axios.get(`${API_URL}/api/profesor/salidas/${editarId}/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = res.data;

    const formData = {
        nombre: data.nombre || '',
        asignatura: data.asignatura || '',
        semestre: data.semestre || '2026-1',
        facultad: data.facultad || '',
        programa: data.programa || '',
        num_estudiantes: data.num_estudiantes || 0,
        fecha_inicio: data.fecha_inicio || '',
        fecha_fin: data.fecha_fin || '',
        hora_inicio: data.hora_inicio || '',
        hora_fin: data.hora_fin || '',
        justificacion: data.justificacion || '',
        resumen: data.resumen || '',
        relacion_syllabus: data.relacion_syllabus || '',
        icono: data.icono || 'IcoMountain',
        color: data.color || '#16a34a',
        objetivo_general: data.planeacion?.obj_general || '',
        estrategia_metodologica: data.planeacion?.metodologia || '',
        objetivos_especificos: data.planeacion?.objetivos?.map(o => o.descripcion).join('\n') || '',
        punto_partida: data.puntos_ruta?.find(p => p.tipo === 'origen')?.nombre
            || data.puntos_ruta?.[0]?.nombre || '',
        parada_max: data.puntos_ruta?.find(p => p.tipo === 'destino')?.nombre
            || data.puntos_ruta?.[data.puntos_ruta.length - 1]?.nombre || '',
        // Reconstruir puntos completos para el mapa: separar IDA y RETORNO
        _puntosRuta: (() => {
            const ida = (data.puntos_ruta || []).filter(p => !p.es_retorno);
            if (ida.length < 2) return undefined;
            return ida.map(p => ({
                nombre: p.direccion || p.nombre,
                nombreParada: p.nombre,
                lat: p.latitud,
                lng: p.longitud,
                motivo: p.motivo || '',
                tiempoEstimado: p.tiempo_estimado || '',
                actividad: p.actividad || '',
                esHospedaje: p.es_hospedaje || false,
                fechaProgramada: p.fecha_programada || '',
                horaProgramada: p.hora_programada || '',
                notasItinerario: p.notas_itinerario || '',
                icono: p.icono || '',
                color: p.color || '',
                esRetorno: false,
            }));
        })(),
        _puntosRetorno: (() => {
            const ret = (data.puntos_ruta || []).filter(p => p.es_retorno);
            if (ret.length < 2) return undefined;
            return ret.map(p => ({
                nombre: p.direccion || p.nombre,
                nombreParada: p.nombre,
                lat: p.latitud,
                lng: p.longitud,
                motivo: p.motivo || '',
                tiempoEstimado: p.tiempo_estimado || '',
                actividad: p.actividad || '',
                esHospedaje: p.es_hospedaje || false,
                fechaProgramada: p.fecha_programada || '',
                horaProgramada: p.hora_programada || '',
                notasItinerario: p.notas_itinerario || '',
                icono: p.icono || '',
                color: p.color || '',
                esRetorno: true,
            }));
        })(),
        criterios_evaluacion: data.criterios_evaluacion?.map(c => c.descripcion).join('\n') || '',
        productos_esperados: data.productos_esperados || '',
        // Datos de cálculo de costo (persistidos)
        distancia_total_km: data.distancia_total_km || 0,
        duracion_dias: data.duracion_dias || 1,
        horas_viaje: data.horas_viaje || 9,
        costo_estimado: data.costo_estimado || 0,
        tipo_vehiculo_calculo: data.tipo_vehiculo_calculo || 'bus',
    };

    return {
        formData,
        esGrupal: data.es_grupal || false,
        profesoresAsociados: data.profesores_asociados || [],
    };
}

/**
 * Envía el payload al backend (crear o actualizar).
 */
export async function enviarSalida(editarId, payload, token) {
    if (editarId) {
        await axios.patch(`${API_URL}/api/profesor/salidas/${editarId}/`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return '¡Salida actualizada con éxito!';
    } else {
        await axios.post(`${API_URL}/api/profesor/salidas/`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return '¡Salida creada con éxito!';
    }
}

/**
 * Extrae un mensaje de error legible desde la respuesta DRF.
 */
export function parsearErrorDRF(err) {
    const drfData = err.response?.data;
    if (drfData?.error) return drfData.error;
    if (drfData && typeof drfData === 'object') {
        const primerLlave = Object.keys(drfData)[0];
        if (primerLlave) return `Revisa el campo "${primerLlave}": ${drfData[primerLlave]}`;
    }
    return 'Error de servidor. Revisa los datos de la solicitud.';
}
