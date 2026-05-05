// src/features/admin_sistema/api/directorio.service.js
import axios from 'axios';
import { API_URL } from '@/shared/api/config';

const getHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
});

export const directorioService = {
    /**
     * Obtiene el historial de cargas del directorio activo.
     */
    listarHistorial: async (token) => {
        try {
            const res = await axios.get(`${API_URL}/api/admin/directorio/`, {
                headers: getHeaders(token),
            });
            return res.data;
        } catch (error) {
            console.error('Error al listar historial:', error);
            throw error;
        }
    },

    /**
     * Sube un nuevo archivo CSV para cargar/actualizar el directorio de estudiantes.
     * @param {File} archivo 
     * @param {string} token 
     */
    cargarDirectorio: async (archivo, token) => {
        try {
            const formData = new FormData();
            formData.append('archivo', archivo);

            const res = await axios.post(`${API_URL}/api/admin/directorio/`, formData, {
                headers: {
                    ...getHeaders(token),
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res.data;
        } catch (error) {
            console.error('Error al subir directorio CSV:', error);
            if (error.response && error.response.data && error.response.data.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Error de conexión con el servidor al subir el archivo.');
        }
    },

    /**
     * Elimina una carga previa por su ID.
     * @param {number} cargaId 
     * @param {string} token 
     */
    eliminarCarga: async (cargaId, token) => {
        try {
            await axios.delete(`${API_URL}/api/admin/directorio/${cargaId}/`, {
                headers: getHeaders(token),
            });
            return true;
        } catch (error) {
            console.error('Error al eliminar carga:', error);
            if (error.response && error.response.data && error.response.data.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Error al intentar eliminar la carga.');
        }
    }
};
