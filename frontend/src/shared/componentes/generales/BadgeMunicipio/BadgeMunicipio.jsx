// src/nucleo/componentes/generales/BadgeMunicipio/BadgeMunicipio.jsx
// Badge de municipio compartido — reemplaza las 3 versiones de km+depto en el proyecto.
// (mp-badge-km/dep, pp-badge-km/dep, mh-badge--km/depto)
import React from 'react';
import './BadgeMunicipio.css';

/**
 * BadgeMunicipio — badges de distancia y departamento para cards de municipio.
 * @param {string|number} km          - Kilómetros de distancia
 * @param {string}        departamento - Nombre del departamento
 */
export default function BadgeMunicipio({ km, departamento }) {
    return (
        <span className="otm-municipio-badges">
            {km !== undefined && km !== null && (
                <span className="otm-badge otm-badge--km">{km} km</span>
            )}
            {departamento && (
                <span className="otm-badge otm-badge--dep">{departamento}</span>
            )}
        </span>
    );
}
