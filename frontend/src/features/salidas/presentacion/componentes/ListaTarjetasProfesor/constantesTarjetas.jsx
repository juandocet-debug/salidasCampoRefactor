import React from 'react';

// ── Iconos SVG para tarjetas ───────────────────────────────────────────────
export const ICONOS = {
    'IcoPC': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>,
    'IcoScience': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10V5H7v14z"></path></svg>,
    'IcoMap': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>,
    'IcoMountain': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3l4 8 5-5 5 15H2L8 3z"></path></svg>,
    'IcoBus': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"></rect><path d="M22 10h-20M6 19v2M18 19v2M6 15h.01M18 15h.01"></path></svg>,
    'IcoTent': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 22h20L12 2zM12 2v20"></path></svg>,
    'IcoBuilding': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M16 10h.01M8 10h.01M8 14h.01M12 14h.01M16 14h.01"></path></svg>,
    'IcoUsers': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"></path></svg>,
};

// ── Imágenes de portada personalizadas ──────────────────────────────────────
export const PORTADAS = {
    'Img1': 'https://i.ibb.co/tpC23FD2/Dise-o-sin-t-tulo-2.png',
    'Img2': 'https://i.ibb.co/0pMx3V88/Dise-o-sin-t-tulo-3.png',
    'Img3': 'https://i.ibb.co/spNC5TLj/Dise-o-sin-t-tulo-4.png',
    'Img4': 'https://i.ibb.co/G3VdqdCm/Dise-o-sin-t-tulo-5.png'
};

// ── Etapas del Stepper de Progreso ─────────────────────────────────────────
export const ETAPAS_STEPPER = [
    { id: 1, label: 'Borr.', estados: ['borrador'] },
    { id: 2, label: 'Coord.', estados: ['enviada', 'en_revision', 'rechazada', 'pendiente_ajuste'] },
    { id: 3, label: 'Cons.', estados: ['favorable', 'ajustada', 'favorable_con_ajustes', 'aprobada'] },
    { id: 4, label: 'Log.', estados: ['en_preparacion', 'lista_ejecucion', 'preembarque'] },
    { id: 5, label: 'Ejec.', estados: ['en_ejecucion', 'finalizada', 'cerrada'] },
];

// ── Auxiliar para detectar colores claros ───────────────────────────────────
export function colorEsClaro(colorHEx) {
    const hex = colorHEx.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}
