// src/nucleo/componentes/Layout/menuPorRol.js
// Menú dinámico por rol — iconos SVG limpios

const Ico = {
    tablero: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
    salidas: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 12h18M3 6l9-3 9 3M3 18l9 3 9-3" /></svg>,
    nueva: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></svg>,
    revision: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>,
    historial: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="9" /></svg>,
    decision: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
    transporte: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 6v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
    presupuesto: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>,
    parametros: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93A10 10 0 114.93 19.07M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>,
    checklist: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3 8-8" /><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9" /></svg>,
    novedades: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    codigo: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2" /><path d="M1 10h22" /></svg>,
    documentos: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
    perfil: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    herramientas: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>,
};

const MENUS = {
    profesor: [
        {
            titulo: 'Principal', items: [
                { etiqueta: 'Mis Salidas', ruta: '/tablero', icono: Ico.salidas },
                { etiqueta: 'Histórico', ruta: '/historico', icono: Ico.historial },
            ]
        }
    ],
    coordinador_academico: [
        {
            titulo: 'Revisiones', items: [
                { etiqueta: 'Revisiones', ruta: '/tablero', icono: Ico.revision },
                { etiqueta: 'Historial', ruta: '/historial', icono: Ico.historial },
            ]
        }
    ],
    consejo: [
        {
            titulo: 'Panel Principal', items: [
                { etiqueta: 'Decisiones', ruta: '/tablero', icono: Ico.decision },
                { etiqueta: 'Historial', ruta: '/historial', icono: Ico.historial },
            ]
        },
        {
            titulo: 'Cuenta', items: [
                { etiqueta: 'Usuarios', ruta: '/usuarios', icono: Ico.perfil },
            ]
        },
    ],
    coordinador_salidas: [
        {
            titulo: 'Logística de Salidas', items: [
                { etiqueta: 'Gestión Operativa', ruta: '/logistica', icono: Ico.transporte },
                { etiqueta: 'Presupuesto', ruta: '/presupuesto', icono: Ico.presupuesto },
                { etiqueta: 'Parámetros', ruta: '/parametros', icono: Ico.parametros },
            ]
        },
        {
            titulo: 'Cuenta', items: [
                { etiqueta: 'Usuarios', ruta: '/usuarios', icono: Ico.perfil },
            ]
        },
    ],
    conductor: [
        {
            titulo: 'Mi Ruta', items: [
                { etiqueta: 'Tablero', ruta: '/tablero', icono: Ico.tablero },
                { etiqueta: 'Checklist', ruta: '/checklist', icono: Ico.checklist },
                { etiqueta: 'Novedades', ruta: '/novedades', icono: Ico.novedades },
            ]
        },
        {
            titulo: 'Cuenta', items: [
                { etiqueta: 'Usuarios', ruta: '/usuarios', icono: Ico.perfil },
            ]
        },
    ],
    estudiante: [
        {
            titulo: 'Mi Salida', items: [
                { etiqueta: 'Tablero', ruta: '/tablero', icono: Ico.tablero },
                { etiqueta: 'Mi Código', ruta: '/mi-codigo', icono: Ico.codigo },
                { etiqueta: 'Documentos', ruta: '/documentos', icono: Ico.documentos },
            ]
        },
        {
            titulo: 'Cuenta', items: [
                { etiqueta: 'Usuarios', ruta: '/usuarios', icono: Ico.perfil },
            ]
        },
    ],
    admin_sistema: [
        {
            titulo: 'Administración', items: [
                { etiqueta: 'Tablero', ruta: '/tablero', icono: Ico.tablero },
                { etiqueta: 'Herramientas', ruta: '/herramientas', icono: Ico.herramientas },
            ]
        },
        {
            titulo: 'Cuenta', items: [
                { etiqueta: 'Usuarios', ruta: '/usuarios', icono: Ico.perfil },
            ]
        },
    ],
};

export function obtenerMenuPorRol(rol) {
    return MENUS[rol] || [];
}
