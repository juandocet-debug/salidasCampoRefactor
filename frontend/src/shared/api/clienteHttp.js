// src/nucleo/api/clienteHttp.js
// ──────────────────────────────────────────────────────────────────────
// CLIENTE HTTP CENTRALIZADO
//
// Instancia de Axios con interceptores:
//  - REQUEST:  añade el token JWT del store Zustand automáticamente
//  - RESPONSE: si recibe 401, cierra la sesión (token expirado)
//
// Las funciones en los slices (salidaApi.js, abordajeApi.js, etc.)
// usan este cliente — nunca crean su propio axios.
// ──────────────────────────────────────────────────────────────────────

import axios from 'axios';
import { API_URL } from '@/shared/api/config';

// ── Inyección de Dependencias (Arquitectura Hexagonal) ──────────
// Evitamos que el adaptador genérico HTTP dependa directamente de un módulo
// de dominio (autenticación) usando inyección de dependencias.
let obtenerToken = null;
let enCierreSesion = null;

export const configurarAdaptadorHttp = (getAuthToken, onLogout) => {
    obtenerToken = getAuthToken;
    enCierreSesion = onLogout;
};

export const clienteHttp = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// ── Interceptor de REQUEST: inyecta el token automáticamente ────────────

clienteHttp.interceptors.request.use((config) => {
    if (obtenerToken) {
        const token = obtenerToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    // Si el payload es FormData, eliminar el Content-Type para que
    // el navegador lo genere automáticamente con el multipart boundary correcto.
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    return config;
});

// ── Interceptor de RESPONSE: manejo global de 401 ──────────────────────

clienteHttp.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (enCierreSesion) {
                enCierreSesion();
            }
            if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
