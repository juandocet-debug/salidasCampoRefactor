// src/nucleo/componentes/generales/EmptyState/EmptyState.jsx
// Estado vacío compartido — reemplaza las 4 implementaciones distintas del proyecto.
import React from 'react';
import './EmptyState.css';

/**
 * EmptyState — mensaje de lista vacía.
 * @param {string} icono    - Emoji o texto corto del icono (default: '📭')
 * @param {string} titulo   - Título principal
 * @param {string} subtitulo - Texto secundario opcional
 * @param {'light'|'dark'} tema - Fondo claro u oscuro (default: 'light')
 * @param {ReactNode} accion - Botón u otro elemento de acción
 */
export default function EmptyState({
    icono    = '📭',
    titulo   = 'Sin resultados',
    subtitulo,
    tema     = 'light',
    accion,
}) {
    return (
        <div className={`otm-empty otm-empty--${tema}`}>
            <span className="otm-empty__ico">{icono}</span>
            <p className="otm-empty__titulo">{titulo}</p>
            {subtitulo && <p className="otm-empty__sub">{subtitulo}</p>}
            {accion && <div className="otm-empty__accion">{accion}</div>}
        </div>
    );
}
