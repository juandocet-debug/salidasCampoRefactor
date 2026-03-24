// src/salidas/dominio/reglas.js
// ─────────────────────────────────────────────────────────────────────────────
// REGLAS DE NEGOCIO (Cálculos puros, transformaciones, validaciones)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validaciones de cada paso del formulario de Nueva Salida.
 * Retorna null si todo OK, o un string con el mensaje de error.
 */
export function validarPaso(pasoActivo, form) {
    if (pasoActivo === 1) {
        if (!form.nombre.trim()) return "El nombre de la salida es obligatorio.";
        if (!form.asignatura.trim()) return "La asignatura es obligatoria.";
        if (!form.semestre.trim()) return "El semestre es obligatorio.";
        if (!form.facultad.trim()) return "La facultad es obligatoria (Ej: Ciencias).";
        if (!form.programa.trim()) return "El programa es obligatorio (Ej: Biología).";
        if (!form.num_estudiantes || parseInt(form.num_estudiantes) < 1) return "El número de estudiantes debe ser mayor a 0.";
        if (!form.fecha_inicio) return "La fecha de inicio es obligatoria.";
        if (!form.fecha_fin) return "La fecha de finalización es obligatoria.";
        if (!form.justificacion.trim()) return "La justificación académica es obligatoria.";
    }
    if (pasoActivo === 2) {
        if (!form.objetivo_general.trim()) return "El objetivo general es obligatorio.";
        if (!form.objetivos_especificos.trim()) return "Liste al menos dos objetivos específicos.";
        if (!form.estrategia_metodologica.trim()) return "Especifique una estrategia metodológica.";
    }
    if (pasoActivo === 3) {
        const origen = form._puntosRuta?.[0]?.nombre || "";
        const destino = form._puntosRuta?.[(form._puntosRuta?.length || 1) - 1]?.nombre || "";
        
        if (!origen.trim()) return "El punto de partida es obligatorio.";
        if (!destino.trim()) return "Especifique el lugar de destino o ruta máx.";
        if (form._requiereHospedaje) return "El viaje excede 10 horas. Debe agregar una parada de hospedaje antes de continuar.";
    }
    return null; // OK
}

// src/modulos/profesor/componentes/logistica/hotelUtils.js
// ─────────────────────────────────────────────────────────────────────────────
// Utilidades para búsqueda de hoteles: distancias, puntos de ruta, etc.
// ─────────────────────────────────────────────────────────────────────────────

export const PRECIO_LABELS = ['Gratis', '$ Económico', '$$ Moderado', '$$$ Costoso', '$$$$ Premium'];
export const PRECIO_COLORS = ['#10b981', '#22c55e', '#f59e0b', '#f97316', '#ef4444'];
export const MAX_DIST_KM = 60;

/** Distancia Haversine en km. */
export function distanciaKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Punto interpolado al ~65% de la ruta para buscar hoteles. */
export function puntoParaHospedaje(puntos) {
    const validos = puntos.filter(p => p.lat && p.lng);
    if (validos.length < 2) return null;
    const ori = validos[0], dst = validos[validos.length - 1];
    return { lat: ori.lat + (dst.lat - ori.lat) * 0.65, lng: ori.lng + (dst.lng - ori.lng) * 0.65 };
}

/** Distancia mínima de un punto a cualquier nodo de la ruta. */
export function distanciaMinAlaRuta(lat, lng, puntos) {
    const validos = puntos.filter(p => p.lat && p.lng);
    let min = Infinity;
    for (const p of validos) {
        const d = distanciaKm(lat, lng, p.lat, p.lng);
        if (d < min) min = d;
    }
    return min;
}

/** Normaliza resultado de Google Places a formato limpio. */
export function normalizarHotel(r, puntosRuta) {
    return {
        placeId: r.place_id,
        nombre: r.name,
        direccion: r.vicinity || '',
        rating: r.rating || 0,
        totalResenas: r.user_ratings_total || 0,
        precioNivel: r.price_level ?? -1,
        lat: r.geometry.location.lat(),
        lng: r.geometry.location.lng(),
        distRuta: distanciaMinAlaRuta(r.geometry.location.lat(), r.geometry.location.lng(), puntosRuta),
    };
}

// rutasConocidasDiccionario.js
// DICCIONARIO: Rutas colombianas conocidas para fallback extra-rápido

export const RUTAS_CONOCIDAS = {
    // Bogotá → Medellín vía Honda / Magdalena Medio
    'bogota_medellin': {
        aliases_ori: ['bogot', 'bogotá'],
        aliases_dst: ['medell'],
        municipios: [
            { nombre: 'Mosquera', depto: 'Cundinamarca' },
            { nombre: 'Funza', depto: 'Cundinamarca' },
            { nombre: 'Madrid', depto: 'Cundinamarca' },
            { nombre: 'Facatativá', depto: 'Cundinamarca' },
            { nombre: 'Albán', depto: 'Cundinamarca' },
            { nombre: 'Villeta', depto: 'Cundinamarca' },
            { nombre: 'Guaduas', depto: 'Cundinamarca' },
            { nombre: 'Honda', depto: 'Tolima' },
            { nombre: 'La Dorada', depto: 'Caldas' },
            { nombre: 'Puerto Triunfo', depto: 'Antioquia' },
            { nombre: 'Doradal', depto: 'Antioquia' },
            { nombre: 'Puerto Nare', depto: 'Antioquia' },
            { nombre: 'Maceo', depto: 'Antioquia' },
            { nombre: 'Cisneros', depto: 'Antioquia' },
            { nombre: 'Santo Domingo', depto: 'Antioquia' },
            { nombre: 'Barbosa', depto: 'Antioquia' },
            { nombre: 'Copacabana', depto: 'Antioquia' },
            { nombre: 'Bello', depto: 'Antioquia' },
        ],
    },
    // Medellín → Bogotá (sentido inverso)
    'medellin_bogota': {
        aliases_ori: ['medell'],
        aliases_dst: ['bogot', 'bogotá'],
        municipios: [
            { nombre: 'Bello', depto: 'Antioquia' },
            { nombre: 'Copacabana', depto: 'Antioquia' },
            { nombre: 'Barbosa', depto: 'Antioquia' },
            { nombre: 'Santo Domingo', depto: 'Antioquia' },
            { nombre: 'Cisneros', depto: 'Antioquia' },
            { nombre: 'Maceo', depto: 'Antioquia' },
            { nombre: 'Puerto Nare', depto: 'Antioquia' },
            { nombre: 'Puerto Triunfo', depto: 'Antioquia' },
            { nombre: 'Doradal', depto: 'Antioquia' },
            { nombre: 'La Dorada', depto: 'Caldas' },
            { nombre: 'Honda', depto: 'Tolima' },
            { nombre: 'Guaduas', depto: 'Cundinamarca' },
            { nombre: 'Villeta', depto: 'Cundinamarca' },
            { nombre: 'Albán', depto: 'Cundinamarca' },
            { nombre: 'Facatativá', depto: 'Cundinamarca' },
            { nombre: 'Madrid', depto: 'Cundinamarca' },
            { nombre: 'Funza', depto: 'Cundinamarca' },
        ],
    },
    // Bogotá → Cali vía Espinal / Girardot
    'bogota_cali': {
        aliases_ori: ['bogot', 'bogotá'],
        aliases_dst: ['cali', 'vale', 'valle'],
        municipios: [
            { nombre: 'Soacha', depto: 'Cundinamarca' },
            { nombre: 'Sibaté', depto: 'Cundinamarca' },
            { nombre: 'Fusagasugá', depto: 'Cundinamarca' },
            { nombre: 'Melgar', depto: 'Tolima' },
            { nombre: 'Flandes', depto: 'Tolima' },
            { nombre: 'Espinal', depto: 'Tolima' },
            { nombre: 'Guamo', depto: 'Tolima' },
            { nombre: 'Purificación', depto: 'Tolima' },
            { nombre: 'Neiva', depto: 'Huila' },
            { nombre: 'Campoalegre', depto: 'Huila' },
            { nombre: 'Hobo', depto: 'Huila' },
            { nombre: 'La Plata', depto: 'Huila' },
            { nombre: 'Popayán', depto: 'Cauca' },
            { nombre: 'Santander de Quilichao', depto: 'Cauca' },
            { nombre: 'Palmira', depto: 'Valle del Cauca' },
        ],
    },
    // Bogotá → Cartagena vía Bucaramanga / Costa
    'bogota_cartagena': {
        aliases_ori: ['bogot', 'bogotá'],
        aliases_dst: ['cartagena', 'bolívar', 'bolivar'],
        municips: [
            { nombre: 'Tunja', depto: 'Boyacá' },
            { nombre: 'Duitama', depto: 'Boyacá' },
            { nombre: 'Sogamoso', depto: 'Boyacá' },
            { nombre: 'Aguazul', depto: 'Casanare' },
            { nombre: 'Bucaramanga', depto: 'Santander' },
            { nombre: 'Barrancabermeja', depto: 'Santander' },
            { nombre: 'San Alberto', depto: 'César' },
            { nombre: 'Aguachica', depto: 'César' },
            { nombre: 'El Banco', depto: 'Magdalena' },
            { nombre: 'Magangué', depto: 'Bolívar' },
        ]
    },
    // Bogotá → Bucaramanga
    'bogota_bucaramanga': {
        aliases_ori: ['bogot', 'bogotá'],
        aliases_dst: ['bucaramanga', 'santander'],
        municipios: [
            { nombre: 'Tunja', depto: 'Boyacá' },
            { nombre: 'Barbosa', depto: 'Santander' },
            { nombre: 'Vélez', depto: 'Santander' },
            { nombre: 'Socorro', depto: 'Santander' },
            { nombre: 'San Gil', depto: 'Santander' },
            { nombre: 'Aratoca', depto: 'Santander' },
            { nombre: 'Los Santos', depto: 'Santander' },
            { nombre: 'Floridablanca', depto: 'Santander' },
        ],
    },
};

export function buscarEnDiccionario(oriNombre, dstNombre) {
    if (!oriNombre || !dstNombre) return null;
    const ori = oriNombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const dst = dstNombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const [, ruta] of Object.entries(RUTAS_CONOCIDAS)) {
        const matchOri = ruta.aliases_ori.some(a => ori.includes(a));
        const matchDst = ruta.aliases_dst.some(a => dst.includes(a));
        if (matchOri && matchDst) return ruta.municipios || ruta.municips;
    }
    return null;
}

// src/modulos/profesor/componentes/logistica/rutaUtils.js
// ─────────────────────────────────────────────────────────────────────────────
// Utilidades puras (sin estado) para cálculo de tiempos y normalización de paradas.
// ─────────────────────────────────────────────────────────────────────────────

export const MAX_HORAS_CONDUCTOR = 10;

/** Parsear "45 min", "1h 30min", "2 horas" → minutos. */
export function parsearMinutos(texto) {
    if (!texto) return 0;
    const limpio = texto.toLowerCase().replace(/,/g, '.').trim();
    let total = 0;
    const mH = limpio.match(/([\d.]+)\s*(h|hora|horas)/);
    if (mH) total += parseFloat(mH[1]) * 60;
    const mM = limpio.match(/([\d.]+)\s*(m|min|minuto|minutos)/);
    if (mM) total += parseFloat(mM[1]);
    if (total === 0 && /^\d+(\.\d+)?$/.test(limpio)) total = parseFloat(limpio);
    return Math.round(total);
}

/** Formatear minutos → "1h 30min" o "45min". */
export function fmtTiempo(min) {
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

/** Calcular tiempos de un tramo (conducción + paradas + hospedaje). */
export function calcularTiemposTramo(puntos, duracionMin) {
    const paradas       = puntos.slice(1, -1);
    const minParadas    = paradas.reduce((a, p) => a + parsearMinutos(p.tiempoEstimado), 0);
    const minConduccion = duracionMin || 0;
    const totalMin      = minConduccion + minParadas;
    return {
        minConduccion, minParadas, totalMin,
        totalHoras: totalMin / 60,
        excede:     totalMin / 60 > MAX_HORAS_CONDUCTOR,
        tieneHospedaje: paradas.some(p => p.motivo === 'hospedaje' || p.motivo === 'descanso_nocturno'),
    };
}

/** Normalizar datos crudos de PantallaParada a un punto de ruta estandarizado. */
export function crearDatosParada(data, esRetorno) {
    return {
        nombre:          data.ubicacion     || data.nombre,
        lat:             data.lat,
        lng:             data.lng,
        motivo:          data.motivo,
        tiempoEstimado:  data.tiempoEstimado,
        actividad:       data.actividad,
        nombreParada:    data.nombre,
        fechaProgramada: data.fechaProgramada || null,
        horaProgramada:  data.horaProgramada  || null,
        notasItinerario: data.notasItinerario || '',
        icono:           data.icono           || '',
        color:           data.color           || '',
        esRetorno,
    };
}

/** Geocodificar un nombre de lugar con Nominatim (Colombia). */

// src/modulos/profesor/paginas/helpersSalida.js
// ─────────────────────────────────────────────────────────────────────────────
// Helpers para PaginaNuevaSalida: construcción de payload, carga, y envío.
// Extraídos para mantener el componente principal bajo 200 líneas.
// ─────────────────────────────────────────────────────────────────────────────

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
        punto_partida: form._puntosRuta?.[0]?.nombre || form.punto_partida || "",
        parada_max: form._puntosRuta?.[(form._puntosRuta?.length || 1) - 1]?.nombre || form.parada_max || "",
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
export function parsearErrorDRF(err) {
    const drfData = err.response?.data;
    if (drfData?.error) return drfData.error;
    if (drfData && typeof drfData === 'object') {
        const primerLlave = Object.keys(drfData)[0];
        if (primerLlave) return `Revisa el campo "${primerLlave}": ${drfData[primerLlave]}`;
    }
    return 'Error de servidor. Revisa los datos de la solicitud.';
}

