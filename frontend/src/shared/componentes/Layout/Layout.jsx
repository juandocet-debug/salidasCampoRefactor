// src/nucleo/componentes/Layout/Layout.jsx
// ─────────────────────────────────────────────────────────────────
// LAYOUT PRINCIPAL — Ensambla Sidebar + Encabezado + Contenido.
// Detecta el rol del usuario y pasa las secciones correctas al Sidebar.
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BarraLateral from '../BarraLateral/BarraLateral';
import Encabezado from '../Encabezado/Encabezado';
import { obtenerMenuPorRol } from './menuPorRol.jsx';
import './Layout.css';



// ── Mapa de rutas a títulos de página ────────────────────────────
const TITULOS = {
    '/tablero': 'Mis Salidas en Proceso',
    '/historico': 'Historial Completo de Salidas',
    '/salidas': 'Mis Salidas',
    '/nueva-salida': 'Nueva Salida',
    '/revisiones': 'Revisiones',
    '/parametros': 'Parámetros',
    '/herramientas': 'Herramientas del Sistema',
    '/checklist': 'Checklist Vehículo',
    '/novedades': 'Novedades',
    '/mi-codigo': 'Mi Código de Abordaje',
    '/documentos': 'Mis Documentos',
    '/usuarios': 'Gestión de Usuarios',
};

// ── Componente Layout ────────────────────────────────────────────
export default function Layout({ usuario, onCerrarSesion }) {
    const location = useLocation();
    const [sidebarMini, setSidebarMini] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const secciones = obtenerMenuPorRol(usuario?.rol || '');
    const titulo = TITULOS[location.pathname] || 'OTIUM';

    // Cerrar sidebar en navegación móvil
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Escuchar el ancho del sidebar para ajustar el margen del contenido
    const handleSidebarToggle = (mini) => setSidebarMini(mini);

    return (
        <div className="layout">

            {/* Backdrop Mobile */}
            {mobileOpen && <div className="layout__backdrop" onClick={() => setMobileOpen(false)} />}

            {/* Sidebar */}
            <BarraLateral
                secciones={secciones}
                usuario={usuario}
                onCerrarSesion={onCerrarSesion}
                onToggle={handleSidebarToggle}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* Área principal */}
            <main className={`layout__principal ${sidebarMini ? 'sidebar-mini' : ''}`}>

                {/* Encabezado Componentizado */}
                <Encabezado
                    titulo={titulo}
                    usuario={usuario}
                    onToggleMenu={() => setMobileOpen(true)}
                />

                {/* Contenido de la página activa (inyectado por React Router) */}
                <div className="layout__contenido">
                    <Outlet />
                </div>

            </main>
        </div >
    );
}
