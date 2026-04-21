import React, { useState } from 'react';
import ListaAprobadas from './presentacion/ListaAprobadas';
import AsignarTransportePanel from './presentacion/AsignarTransportePanel';
import MonitoreoEjecucionPanel from './presentacion/MonitoreoEjecucionPanel';
import CierresOperativosPanel from './presentacion/CierresOperativosPanel';

// Reutilizamos el CSS del Panel de Herramientas para consistencia visual exacta
import '@/features/admin_sistema/presentacion/paginas/PanelHerramientas/PanelHerramientas.css';

const TABS = [
    {
        id: 'pendientes',
        label: 'Gestión Operativa',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 5H3a2 2 0 00-2 2v9h2a3 3 0 006 0h6a3 3 0 006 0h2V12l-3-5h-3z"/><circle cx="6" cy="16" r="2"/><circle cx="18" cy="16" r="2"/></svg>
    },
    {
        id: 'monitoreo',
        label: 'Monitoreo en Ejecución',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
    },
    {
        id: 'cierres',
        label: 'Cierres Operativos',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
    },
];

const CoordinadorLogisticaDashboard = () => {
    const [vistaActiva, setVistaActiva] = useState('pendientes');
    const [salidaSeleccionada, setSalidaSeleccionada] = useState(null);

    const renderContenido = () => {
        if (salidaSeleccionada) {
            return (
                <AsignarTransportePanel
                    salida={salidaSeleccionada}
                    onVolver={() => setSalidaSeleccionada(null)}
                />
            );
        }
        switch (vistaActiva) {
            case 'pendientes': return <ListaAprobadas onAsignar={setSalidaSeleccionada} />;
            case 'monitoreo':  return <MonitoreoEjecucionPanel />;
            case 'cierres':    return <CierresOperativosPanel />;
            default:           return <ListaAprobadas onAsignar={setSalidaSeleccionada} />;
        }
    };

    return (
        <div className="herr-layout fade-in">
            {/* ── Menú de Navegación Horizontal (idéntico a PanelHerramientas) ── */}
            <div className="herr-top-nav">
                <div className="herr-nav-links">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            className={`herr-nav-link ${vistaActiva === tab.id ? 'active' : ''}`}
                            onClick={() => { setVistaActiva(tab.id); setSalidaSeleccionada(null); }}
                        >
                            {tab.icon}
                            {tab.label}
                            <svg className="herr-nav-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="m6 9 6 6 6-6"/>
                            </svg>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Contenido Principal ────────────────────────────────────────── */}
            <div className="herr-main">
                <div className="herr-content-area">
                    {renderContenido()}
                </div>
            </div>
        </div>
    );
};

export default CoordinadorLogisticaDashboard;
