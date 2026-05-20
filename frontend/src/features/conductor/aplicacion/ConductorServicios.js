const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;
export const loginConductor = async (cedula, telefono) => {
    try {
        const response = await fetch(`${API_URL}/conductor/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cedula, telefono })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Credenciales inválidas');
        return data;
    } catch (error) {
        throw error;
    }
};

export const obtenerMisViajes = async (conductorId, token) => {
    try {
        const response = await fetch(`${API_URL}/conductor/mis-viajes/?conductor_id=${conductorId}`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al obtener viajes');
        return data.datos || [];
    } catch (error) {
        throw error;
    }
};

export const obtenerDetalleSalida = async (salidaId) => {
    try {
        const response = await fetch(`${API_URL}/admin/salidas/${salidaId}/`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al obtener detalle');
        return data;
    } catch (error) {
        throw error;
    }
};

export const comentarParada = async (paradaId, comentario, token) => {
    try {
        const response = await fetch(`${API_URL}/conductor/comentar-parada/`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ parada_id: paradaId, comentario })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al guardar comentario');
        return data;
    } catch (error) {
        throw error;
    }
};

export const reportarNovedad = async (salidaId, nivel, mensaje, foto, token) => {
    try {
        const response = await fetch(`${API_URL}/conductor/reportar-novedad/`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ salida_id: salidaId, nivel, mensaje, foto })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al reportar novedad');
        return data;
    } catch (error) {
        throw error;
    }
};

export const notificarLlegada = async (salidaId, token) => {
    try {
        const response = await fetch(`${API_URL}/conductor/llegada/`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ salida_id: salidaId })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al notificar llegada');
        return data;
    } catch (error) {
        throw error;
    }
};

export const finalizarViaje = async (salidaId, token) => {
    try {
        const response = await fetch(`${API_URL}/conductor/finalizar/`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ salida_id: salidaId })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al finalizar viaje');
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Obtiene la lista de estudiantes inscritos en una salida (con foto y estado).
 * Reutiliza el endpoint del profesor — el conductor solo necesita leer la lista.
 * @param {number} salidaId - ID de la salida
 * @returns {Promise<Array>} Lista de inscritos con foto, nombre, estado
 */
export const obtenerEstudiantesSalida = async (salidaId) => {
    try {
        const response = await fetch(`${API_URL}/profesor/salidas/${salidaId}/inscritos/`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al obtener estudiantes');
        return Array.isArray(data) ? data : [];
    } catch (error) {
        throw error;
    }
};

/**
 * Marca una parada del itinerario como completada (checkpoint).
 */
export const marcarCheckpoint = async ({ salidaId, paradaId, paradaNombre, reportadoPor, usuarioId, notas, token }) => {
    const url = reportadoPor === 'profesor'
        ? `${API_URL}/profesor/checkpoint/`
        : `${API_URL}/conductor/checkpoint/`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
            salida_id: salidaId, parada_id: paradaId,
            parada_nombre: paradaNombre, reportado_por: reportadoPor,
            usuario_id: usuarioId, notas,
        }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al marcar checkpoint');
    return data;
};

/**
 * Desmarca una parada (quitar el check).
 */
export const desmarcarCheckpoint = async ({ salidaId, paradaId, reportadoPor, token }) => {
    const url = reportadoPor === 'profesor'
        ? `${API_URL}/profesor/checkpoint/`
        : `${API_URL}/conductor/checkpoint/`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ salida_id: salidaId, parada_id: paradaId, reportado_por: reportadoPor }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al desmarcar checkpoint');
    return data;
};

/**
 * Obtiene los checkpoints ya guardados de una salida.
 */
export const obtenerCheckpoints = async (salidaId) => {
    const response = await fetch(`${API_URL}/conductor/checkpoint/?salida_id=${salidaId}`);
    if (!response.ok) return [];
    return await response.json();
};
