// src/nucleo/componentes/generales/Spinner/Spinner.jsx
// Spinner de carga compartido para todo el proyecto.
// Reemplaza: .mh-spinner, .mp-sug-spinner, .pp-muni-spinner, inline spinners en TabFlota, etc.
import React from 'react';
import './Spinner.css';

/**
 * Spinner — indicador de carga animado.
 * @param {number} size    - Tamaño en px (default: 18)
 * @param {string} color   - Color del arco activo (default: '#0d9488')
 * @param {string} className - Clase extra opcional
 */
export default function Spinner({ size = 18, color = '#0d9488', className = '' }) {
    return (
        <span
            className={`otm-spinner ${className}`}
            style={{
                width:  size,
                height: size,
                borderTopColor: color,
            }}
            aria-label="Cargando"
            role="status"
        />
    );
}
