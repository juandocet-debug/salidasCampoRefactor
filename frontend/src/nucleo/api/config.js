// src/nucleo/api/config.js
/**
 * Extrae la URL de la API de variables de entorno de Vite de forma centralizada.
 * Si no está definida en .env, falla elegantemente o asume el servidor local por defecto para desarrollo,
 * pero no debe quemarse en cada archivo individualmente.
 */

const getApiUrl = () => {
    // Vite inyecta import.meta.env
    const url = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return url.replace(/\/$/, ''); // Limpiamos la última barra diagonal si existe
};

export const API_URL = getApiUrl();
