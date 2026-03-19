// modulos/admin/paginas/PanelHerramientas.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Panel de Herramientas — Administrador del Sistema
// Dashboard para configurar: parámetros, catálogos académicos y calendario.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import useAutenticacion from '../../autenticacion/estado/useAutenticacion';
import TabAcademico  from '../componentes/TabAcademico';
import TabCalendario from '../componentes/TabCalendario';
import TabFlota      from '../componentes/TabFlota';
import TabComponentes from '../componentes/TabComponentes';
import './PanelHerramientas.css';

const TABS = [
    {
        id: 'flota', label: 'Flota', desc: 'Buses y conductores', statNum: '12', statText: 'Vehículos', actionTxt: 'Asignar', progreso: '90%', componente: TabFlota,
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17 5H3a2 2 0 00-2 2v9h2a3 3 0 006 0h6a3 3 0 006 0h2V12l-3-5h-3zM6 18a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm12 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM17 9.5V7h2.5l2.1 3.5H17z"/></svg>
    },
    {
        id: 'academico', label: 'Catál. Acad.', desc: 'Programas y Módulos', statNum: '42', statText: 'Programas', actionTxt: 'Organizar', progreso: '45%', componente: TabAcademico,
        icon: <svg width="24" height="24" viewBox="0 0 22 22" fill="currentColor"><path d="M11 2L2 7l9 5 9-5-9-5zm0 13.5l-6-3.33v3.83l6 3.5 6-3.5v-3.83l-6 3.33z" /></svg>
    },
    {
        id: 'calendario', label: 'Calendario', desc: 'Ventanas Operativas', statNum: '08', statText: 'Periodos', actionTxt: 'Agendar', progreso: '60%', componente: TabCalendario,
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z"/></svg>
    },
    {
        id: 'componentes', label: 'Librería UI', desc: 'Componentes y Cards', statNum: '03', statText: 'Modelos', actionTxt: 'Ver UI', progreso: '100%', componente: TabComponentes,
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    }
];

export default function PanelHerramientas() {
    const [tabActivo, setTabActivo] = useState('flota');
    const [toast, setToast]         = useState('');
    const token = useAutenticacion(s => s.token) || '';

    const mostrarToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const TabComponente = TABS.find(t => t.id === tabActivo)?.componente;

    return (
        <div className="herr-layout fade-in">
            {/* ── Menú de Navegación Horizontal ────────────────────── */}
            <div className="herr-top-nav">
                <div className="herr-nav-links">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            className={`herr-nav-link ${tabActivo === tab.id ? 'active' : ''}`}
                            onClick={() => setTabActivo(tab.id)}
                        >
                            {tab.label}
                            <svg className="herr-nav-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
                        </button>
                    ))}
                </div>
                <div className="herr-nav-actions">
                    <button className="herr-btn-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    </button>
                    <button className="herr-btn-demo">Request a demo</button>
                </div>
            </div>

            {/* ── Contenido Principal ────────────────────── */}
            <div className="herr-main">
                <div className="herr-main-header">
                    <div className="herr-header-text">
                        <h2>{TABS.find(t => t.id === tabActivo)?.label}</h2>
                        <p>{TABS.find(t => t.id === tabActivo)?.desc}</p>
                    </div>
                </div>

                <div className="herr-content-area">
                    {TabComponente && <TabComponente token={token} onToast={mostrarToast} />}
                </div>
            </div>

            {/* ── Toast ────────────────────────────────────────────── */}
            {toast && <div className="herr-toast">{toast}</div>}
        </div>
    );

}
