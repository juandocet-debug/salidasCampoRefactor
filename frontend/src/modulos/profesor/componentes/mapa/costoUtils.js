// src/modulos/profesor/componentes/mapa/costoUtils.js
// ─────────────────────────────────────────────────────────────────────────────
// Funciones puras para el cálculo de costos de transporte.
// Sin estado — 100% testeables de forma aislada.
// ─────────────────────────────────────────────────────────────────────────────

/** Formatea un número como moneda COP. */
export const cop = n => '$' + Math.round(n).toLocaleString('es-CO');

/** Rendimiento (km/gal) según tipo de vehículo. */
export function getRendimiento(params, tipoVehiculo) {
    return params[`rendimiento_${tipoVehiculo}`] || params.rendimiento || 8;
}

/** Auto-sugiere el tipo de vehículo según la cantidad de estudiantes. */
export function tipoVehiculoSugerido(numEstudiantes) {
    const n = parseInt(numEstudiantes) || 0;
    if (n <= 12) return 'camioneta';
    if (n <= 25) return 'buseta';
    return 'bus';
}

/**
 * Devuelve las opciones de tipo de vehículo disponibles según el número de pasajeros.
 * Si supera la capacidad máxima de un tipo, se habilitan múltiples.
 */
export function getOpcionesVehiculo(pax) {
    if (pax <= 15) return ['camioneta'];
    if (pax <= 30) return ['buseta'];
    if (pax <= 50) return ['bus'];
    return ['bus', 'buseta']; // > 50 → varios vehículos
}

/**
 * Calcula el desglose completo de horas por tramo de jornada.
 * Retorna: { heManana, ordinarias, heTarde, heNoche, horasExtraTotal, horasEfectivas }
 */
export function calcularJornada({ horasTotales, horasBuffer, maxHorasViaje, duracionDias, horaInicio }) {
    const horasEfectivas = Math.min(
        horasTotales + horasBuffer,
        maxHorasViaje * duracionDias,
    );

    let hInicio = 8;
    if (horaInicio) {
        const [hi, mi] = horaInicio.split(':').map(Number);
        hInicio = hi + (mi || 0) / 60;
    }

    let heManana = 0, ordinarias = 0, heTarde = 0, heNoche = 0;

    const factorDias = duracionDias === 1 ? 1 : duracionDias;

    if (hInicio < 8) {
        heManana = Math.min(8 - hInicio, horasEfectivas);
    }
    let restante = horasEfectivas - heManana;
    ordinarias   = Math.min(restante, 9 * factorDias);  restante -= ordinarias;
    heTarde      = Math.min(restante, 1 * factorDias);  restante -= heTarde;
    heNoche      = Math.min(restante, 2 * factorDias);

    return {
        heManana, ordinarias, heTarde, heNoche,
        horasExtraTotal: heManana + heTarde + heNoche,
        horasEfectivas,
    };
}

/**
 * Calcula el costo total y su desglose dado un set de parámetros y valores de ruta.
 */
export function calcularCostos({
    distanciaKm, duracionDias, horasTotales, pax,
    tipoVehiculo, capacidadVehiculo, params,
    horaInicio,
}) {
    const rend         = getRendimiento(params, tipoVehiculo);
    const numVehiculos = Math.ceil(pax / capacidadVehiculo) || 1;

    const combustible    = (distanciaKm / rend) * params.precio_galon * numVehiculos;
    const viaticos       = Math.max(0.5, duracionDias - 0.5);
    const costoConductor = viaticos * params.costo_noche * numVehiculos;

    const jornada = calcularJornada({
        horasTotales,
        horasBuffer:    params.horas_buffer   || 0,
        maxHorasViaje:  params.max_horas_viaje || 10,
        duracionDias,
        horaInicio,
    });

    const costoHE1 = (jornada.heManana + jornada.heTarde) * (params.costo_hora_extra  || 11000) * numVehiculos;
    const costoHE2 =  jornada.heNoche                     * (params.costo_hora_extra_2 || 15000) * numVehiculos;
    const costoExtra = costoHE1 + costoHE2;

    return {
        combustible, costoConductor, costoExtra,
        total: combustible + costoConductor + costoExtra,
        numVehiculos, viaticos,
        jornada,
    };
}
