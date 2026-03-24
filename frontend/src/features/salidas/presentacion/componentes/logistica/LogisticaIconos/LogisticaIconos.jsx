// src/modulos/profesor/componentes/pasos/LogisticaIconos.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Iconos SVG inline reutilizables para el módulo de logística.
// Extraídos del componente Paso3Logistica para cumplir con principio DRY.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';

/** Flecha derecha → (viaje de ida) */
export const IconoIda = ({ className = 'p3l-card-icon-svg' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h18M13 6l6 6-6 6"/>
    </svg>
);

/** Flecha circular ↺ (viaje de retorno) */
export const IconoRetorno = ({ className = 'p3l-card-icon-svg' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12A9 9 0 1 1 3 12"/>
        <polyline points="3 7 3 12 8 12"/>
    </svg>
);

/** Globo terráqueo 🌐 (resumen de ruta) */
export const IconoGlobo = ({ className = 'p3l-info-icon-svg' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
);

/** Signo de dólar $ (costos) */
export const IconoDolar = ({ className = 'p3l-info-icon-svg' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
);

/** Flecha derecha pequeña (tab ida) */
export const IconoTabIda = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.5">
        <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
);

/** Flecha circular pequeña (tab retorno) */
export const IconoTabRetorno = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.5">
        <path d="M21 12A9 9 0 1 1 3 12"/>
        <polyline points="3 7 3 12 8 12"/>
    </svg>
);

/** Pin de mapa (empty state) */
export const IconoMapaVacio = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
         stroke="#cbd5e1" strokeWidth="1.5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
    </svg>
);
