// src/rutas/RutasProtegidas.jsx
// ─────────────────────────────────────────────────────────────────
// GUARDIA DE RUTAS — Redirige a /login si no hay sesión activa.
// ─────────────────────────────────────────────────────────────────

import { Navigate, Outlet } from 'react-router-dom';
import useAutenticacion from '../modulos/autenticacion/estado/useAutenticacion';

export default function RutasProtegidas() {
    const token = useAutenticacion(s => s.token);
    return token ? <Outlet /> : <Navigate to="/login" replace />;
}
