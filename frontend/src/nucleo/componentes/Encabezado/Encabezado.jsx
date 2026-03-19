// src/nucleo/componentes/Encabezado/Encabezado.jsx
import './Encabezado.css';

const IcoMenu = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const IcoCampana = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
);

const IcoIdioma = () => (
    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
        ENG <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
    </span>
);

export default function Encabezado({ titulo, usuario, onToggleMenu }) {
    // Generar iniciales si no hay foto
    const iniciales = usuario?.nombre
        ? usuario.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : '??';

    const nombreMostrado = usuario?.nombre || 'Grace Stanley'; // default as in screenshot placeholder

    const rolesDisponibles = [
        { id: 'profesor', label: 'Profesor' },
        { id: 'coordinador_academico', label: 'Coord. Académico' },
        { id: 'consejo', label: 'Consejo' },
        { id: 'coordinador_salidas', label: 'Coord. Salidas' },
        { id: 'conductor', label: 'Conductor' },
        { id: 'estudiante', label: 'Estudiante' }
    ];
    const etiquetaRolActual = rolesDisponibles.find(r => r.id === usuario?.rol)?.label || usuario?.rol || 'Rol';

    return (
        <header className="nc-encabezado">
            {/* START: IZQUIERDA */}
            <div className="nc-encabezado__izq">
                <button className="nc-encabezado__btn-mobile" onClick={onToggleMenu} title="Menú">
                    <IcoMenu />
                </button>
                <div className="nc-encabezado__titulos">
                    <div className="nc-encabezado__titulo">{titulo}</div>
                    <div className="nc-encabezado__ruta">OTIUM / {titulo}</div>
                </div>
            </div>

            {/* START: DERECHA */}
            <div className="nc-encabezado__der">

                {/* Idioma - Estético basado en wireframe */}
                <button className="nc-encabezado__btn-texto">
                    <IcoIdioma />
                </button>

                {/* Notificaciones */}
                <button className="nc-encabezado__btn-icono" title="Notificaciones">
                    <IcoCampana />
                    <span className="notif-punto" />
                </button>

                <div className="nc-encabezado__separador"></div>

                {/* Perfil Usuario Flotante Dropdown */}
                <button className="nc-encabezado__perfil" title="Mi Perfil">
                    <div className="nc-encabezado__avatar">
                        {/* Se puede inyectar IMG del usuario aqui a futuro, por ahora usamos iniciales como fallback con foto estetica si esta disponible */}
                        <img src="https://i.pravatar.cc/150?img=47" alt="Perfil" onError={(e) => e.target.style.display = 'none'} />
                        <span>{iniciales}</span>
                    </div>
                    <div className="nc-encabezado__user-textos">
                        <span className="nc-encabezado__nombre">{nombreMostrado}</span>
                        <span className="nc-encabezado__rol">
                            {etiquetaRolActual}
                            <svg className="nc-encabezado__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </div>
                </button>

            </div>
        </header>
    );
}
