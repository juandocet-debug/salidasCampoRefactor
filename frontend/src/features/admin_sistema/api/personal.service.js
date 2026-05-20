import axios from 'axios';
import { API_URL } from '@/shared/api/config';

const getHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
});

export const personalService = {
    listarPersonal: async (token) => {
        const res = await axios.get(`${API_URL}/api/admin/personal/`, {
            headers: getHeaders(token)
        });
        return res.data;
    },

    crearPersonal: async (datos, token) => {
        const res = await axios.post(`${API_URL}/api/admin/personal/`, datos, {
            headers: getHeaders(token)
        });
        return res.data;
    },

    editarPersonal: async (id, datos, token) => {
        const res = await axios.put(`${API_URL}/api/admin/personal/${id}/`, datos, {
            headers: getHeaders(token)
        });
        return res.data;
    },

    eliminarPersonal: async (id, token) => {
        const res = await axios.delete(`${API_URL}/api/admin/personal/${id}/`, {
            headers: getHeaders(token)
        });
        return res.data;
    }
};
