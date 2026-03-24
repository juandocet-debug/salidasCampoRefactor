// src/modulos/autenticacion/estado/useAutenticacion.js
// ─────────────────────────────────────────────────────────────────
// STORE ZUSTAND — Estado global de sesión del usuario.
// Persiste el token JWT y los datos del usuario en localStorage.
// ─────────────────────────────────────────────────────────────────

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAutenticacion = create(
    persist(
        (set) => ({
            // ── Estado ──────────────────────────────────────────────────
            usuario: null,   // { id, email, first_name, last_name, rol }
            token: null,   // JWT access token

            // ── Acciones ─────────────────────────────────────────────────
            iniciarSesion: (usuario, token) => {
                set({ usuario, token });
            },

            cerrarSesion: () => {
                set({ usuario: null, token: null });
            },

            cambiarRol: (rol) => {
                set((state) => ({ usuario: { ...state.usuario, rol } }));
            },

            estaAutenticado: () => {
                // Función utilitaria — verificar si hay sesión activa
                const { token } = useAutenticacion.getState();
                return Boolean(token);
            },
        }),
        {
            name: 'otium-sesion',   // clave en localStorage
            partialize: (state) => ({ usuario: state.usuario, token: state.token }),
        }
    )
);

export default useAutenticacion;
