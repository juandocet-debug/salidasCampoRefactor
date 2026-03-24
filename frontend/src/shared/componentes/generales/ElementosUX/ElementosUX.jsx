import React from 'react';
import './ElementosUX.css';

// ── Botones de Acción (Iconos con fondo suave) ──
export const BotonAccion = ({ tipo = 'editar', onClick, titulo, className = '' }) => {
    const isEdit = tipo === 'editar';
    const isVer = tipo === 'ver';
    
    let baseClass = 'c-btn-action top-btn';
    let spanClass = 'action-circle';
    
    if (isEdit) {
        baseClass += ' c-btn-action--editar';
    } else if (isVer) {
        baseClass += ' c-btn-action--ver';
    } else {
        baseClass += ' c-btn-action--borrar';
        spanClass += ' _del';
    }

    return (
        <button type="button" className={`${baseClass} ${className}`} onClick={onClick} title={titulo}>
            <span className={spanClass}>
                {isEdit && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>}
                {isVer && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>}
                {!isEdit && !isVer && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"></path></svg>}
            </span>
        </button>
    );
};

// ── Etiquetas Tipo Pastilla ("Pill") ──
export const EtiquetaPill = ({ texto, icono, color = 'default', className = '' }) => {
    return (
        <span className={`ux-pill ux-pill--${color} ${className}`}>
            {icono && <span className="ux-pill__icon">{icono}</span>}
            {texto}
        </span>
    );
};

// ── Ítem de Usuario en Lista ──
export const ItemUsuario = ({ avatarUrl, nombre, subtexto, estado_color = '#0284c7', className = '' }) => {
    return (
        <div className={`ux-user-item ${className}`}>
            <div className="ux-user-item__avatar">
                {avatarUrl ? <img src={avatarUrl} alt={nombre} /> : <div className="ux-user-item__avatar-fallback">{nombre?.charAt(0)}</div>}
            </div>
            <div className="ux-user-item__info">
                <div className="ux-user-item__nombre">{nombre}</div>
                {subtexto && <div className="ux-user-item__id">{subtexto}</div>}
            </div>
            {estado_color && <div className="ux-user-item__estado" style={{ background: estado_color }}></div>}
        </div>
    );
};
