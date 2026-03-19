// src/nucleo/componentes/BarraLateral/BarraLateral.jsx
import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import useAutenticacion from '../../../modulos/autenticacion/estado/useAutenticacion';
import './BarraLateral.css';
import './BarraLateralFooter.css';

const IMG_LOGO = 'https://i.ibb.co/XZsj8qY2/Dise-o-sin-t-tulo-1.png';

const IcoChevron = ({ mini }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {mini ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
    </svg>
);

const IcoSalir = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
);

// Item individual — sabe si está activo para renderizar las curvitas
function NavItem({ item, mini }) {
    const { pathname } = useLocation();
    const isActive = pathname === item.ruta || pathname.startsWith(item.ruta + '/');

    return (
        <NavLink
            to={item.ruta}
            title={mini ? item.etiqueta : undefined}
            className={`sb__item${isActive ? ' sb__item--on' : ''}`}
        >
            <span className="sb__ico">{item.icono}</span>
            <span className="sb__label">{item.etiqueta}</span>
            {/* Curvitas solo cuando está activo — montadas para evitar glitch visual de flecha */}
            {isActive && (
                <>
                    <span className="sb__curva-top" />
                    <span className="sb__curva-bot" />
                </>
            )}
        </NavLink>
    );
}

export default function BarraLateral({ secciones, usuario, onCerrarSesion, onToggle, mobileOpen }) {
    const [mini, setMini] = useState(false);
    const [menuRolesAbierto, setMenuRolesAbierto] = useState(false);
    const navigate = useNavigate();
    const cambiarRol = useAutenticacion(s => s.cambiarRol);

    const toggle = () => {
        const next = !mini;
        setMini(next);
        onToggle?.(next);
    };

    const iniciales = usuario?.nombre
        ? usuario.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : '??';

    // Opciones de roles disponibles
    const rolesDisponibles = [
        { id: 'profesor', label: 'Profesor' },
        { id: 'coordinador_academico', label: 'Coord. Académico' },
        { id: 'consejo', label: 'Consejo' },
        { id: 'coordinador_salidas', label: 'Coord. Salidas' },
        { id: 'admin_sistema', label: 'Admin Sistema' },
        { id: 'conductor', label: 'Conductor' },
        { id: 'estudiante', label: 'Estudiante' }
    ];

    const etiquetaRolActual = rolesDisponibles.find(r => r.id === usuario?.rol)?.label || usuario?.rol;

    return (
        <aside className={`sb ${mini ? 'sb--mini' : ''} ${mobileOpen ? 'sb--mobile-open' : ''}`}>

            {/* Header: logo + toggle */}
            <div className="sb__header">
                <div className="sb__brand">
                    <div className="sb__logo-ico">
                        <img src={IMG_LOGO} alt="OTIUM" />
                    </div>
                    {!mini && <span className="sb__logo-texto">OTIUM</span>}
                </div>
                <button className="sb__toggle" onClick={toggle}
                    title={mini ? 'Expandir' : 'Colapsar'}>
                    <IcoChevron mini={mini} />
                </button>
            </div>

            {/* Navegación */}
            <nav className="sb__nav">
                {secciones.map((seccion) =>
                    seccion.items.map((item) => (
                        <NavItem key={item.ruta} item={item} mini={mini} />
                    ))
                )}
            </nav>

            {/* Footer usuario */}
            <div className="sb__footer">
                <div className="sb__user" onClick={() => setMenuRolesAbierto(!menuRolesAbierto)} title="Cambiar rol (Modo Demo)">
                    <div className="sb__avatar">{iniciales}</div>
                    <div className="sb__user-info">
                        <span className="sb__user-name">{usuario?.nombre || 'Usuario'}</span>
                        <span className="sb__user-role">
                            {etiquetaRolActual}
                            <svg className="sb__user-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>

                    {/* Menú Desplegable Custom */}
                    {menuRolesAbierto && !mini && (
                        <div className="sb__menu-roles">
                            <div className="sb__menu-roles-titulo">Simular Rol</div>
                            {rolesDisponibles.map(rol => (
                                <button
                                    key={rol.id}
                                    className={`sb__menu-rol-btn ${usuario?.rol === rol.id ? 'activo' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        cambiarRol(rol.id);
                                        setMenuRolesAbierto(false);
                                        navigate('/tablero');
                                    }}
                                >
                                    {rol.label}
                                </button>
                            ))}
                            <div className="sb__menu-divisor"></div>
                            <button
                                className="sb__menu-rol-btn"
                                onClick={(e) => { e.stopPropagation(); navigate('/perfil'); setMenuRolesAbierto(false); }}
                            >
                                Mi Perfil Real
                            </button>
                        </div>
                    )}
                </div>

                <button className="sb__salir" onClick={onCerrarSesion} title="Cerrar sesión">
                    <IcoSalir />
                </button>
            </div>

            {/* Backdrop Invisible para cerrar el menu haciendo clic fuera (solo activo si el menu esta abierto) */}
            {menuRolesAbierto && <div className="sb__menu-backdrop" onClick={() => setMenuRolesAbierto(false)}></div>}
        </aside>
    );
}
