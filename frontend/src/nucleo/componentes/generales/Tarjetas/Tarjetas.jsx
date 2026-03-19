import React from 'react';
import './Tarjetas.css';

/**
 * CardIceMatcha - Tarjeta tipo Bento Box con bloque superior curvo y pastilla flotante.
 * @param {string} title Titulo principal (ej: Placa)
 * @param {string} color Top bg color variant ('blue', 'green', 'yellow', 'orange', 'slate')
 * @param {string} badgeText Texto superior derecho (ej: Estado)
 * @param {string} badgeColor Color del texto del badge superior derecho
 * @param {string} imageSrc URL de la imagen flotante (con caída de sombra)
 * @param {string} bannerText Texto del mini banner inferior (dentro de la caja de color)
 * @param {array} tags Array de strings/jsx para las pastillas inferiores (Pills)
 * @param {jsx} actions Botones o elementos de acción a la derecha del header (ej: Editar/Eliminar)
 * @param {jsx} children Contenedor en caso de requerir render prop personalizado debajo
 */
export const CardMatcha = ({
    title, color = 'slate', badgeText, badgeColor = '#1e293b', 
    imageSrc, bannerText, tags = [], actions, children
}) => (
    <div className="ui-card-matcha">
        <div className={`ui-matcha-top bg-${color}`}>
            {badgeText && (
                <div className="ui-matcha-badge">
                    <span style={{ color: badgeColor }}>{badgeText}</span>
                </div>
            )}
            {imageSrc && <img src={imageSrc} alt={title || 'Card Image'} crossOrigin="anonymous" />}
            {bannerText && <div className="ui-matcha-banner">{bannerText}</div>}
        </div>
        <div className="ui-matcha-body">
            {(title || actions) && (
                <div className="ui-matcha-header">
                    {title && <h3>{title}</h3>}
                    {actions && <div className="ui-card-actions">{actions}</div>}
                </div>
            )}
            {tags.length > 0 && (
                <div className="ui-matcha-tags">
                    {tags.map((t, i) => <span key={i} className="ui-matcha-pill">{t}</span>)}
                </div>
            )}
            {children}
        </div>
    </div>
);

/**
 * CardKPI - Tarjeta sencilla limpia con ícono a la izquierda y número grande
 * @param {string} label Etiqueta superior
 * @param {string|number} value Valor destacado
 * @param {jsx} icon Elemento ícono / emoji
 * @param {string} iconBg Fondo del ícono (hexadecimal/rgb)
 * @param {string} iconColor Color primario del ícono
 */
export const CardKPI = ({ label, value, icon, iconBg = '#f5f3ff', iconColor = '#5c4dfa' }) => (
    <div className="ui-card-kpi">
        <div className="ui-kpi-icono" style={{ background: iconBg, color: iconColor }}>
            {icon}
        </div>
        <div className="ui-kpi-text">
            <span className="ui-kpi-lbl">{label}</span>
            <div className="ui-kpi-main">
                <span className="ui-kpi-val">{value}</span>
            </div>
        </div>
    </div>
);
