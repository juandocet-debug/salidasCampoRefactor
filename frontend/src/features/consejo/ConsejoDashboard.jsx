import React, { useState, useEffect } from 'react';
import { CardKPI } from '../../shared/componentes/generales/Tarjetas/Tarjetas';
import { WidgetPresupuesto } from './WidgetPresupuesto';
import { TablaConsejo } from './TablaConsejo';
import { VistaRevision } from '../coordinacion/VistaRevision';
import PanelDecisionConsejo from './PanelDecisionConsejo';

const ConsejoDashboard = () => {
    const [salidas, setSalidas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [salidaSeleccionada, setSalidaSeleccionada] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    const cargarSalidas = () => {
        setCargando(true);
        fetch('http://localhost:8000/api/salidas/consejo/por-revisar/')
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar las salidas del Consejo');
                return res.json();
            })
            .then(data => {
                setSalidas(data);
                setCargando(false);
            })
            .catch(err => {
                console.error(err);
                setCargando(false);
            });
    };

    useEffect(() => {
        cargarSalidas();
    }, []);

    const handleDecidir = (item) => {
        setSalidaSeleccionada(item);
    };

    const handleVolver = () => {
        setSalidaSeleccionada(null);
        cargarSalidas();
    };

    const salidasFiltradas = salidas.filter(s =>
        (s.codigo || '').toLowerCase().includes(busqueda.toLowerCase()) ||
        (s.asignatura || '').toLowerCase().includes(busqueda.toLowerCase()) ||
        (s.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
        (s.destino || '').toLowerCase().includes(busqueda.toLowerCase())
    );

    // Hardcoded Budget Data for Wireframe Step 1
    const PRESUPUESTO_TOTAL = 500000000;
    const PRESUPUESTO_CONSUMIDO = 120000000;
    const PRESUPUESTO_DISPONIBLE = PRESUPUESTO_TOTAL - PRESUPUESTO_CONSUMIDO;

    // Render principal
    const renderDashboard = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Encabezado */}
            <div>
                <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0', color: '#0f172a' }}>Decisiones de Facultad</h1>
                <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>
                    Gestione la aprobación final y el compromiso presupuestal de las salidas validadas.
                </p>
            </div>

            {/* Dashboard Grid (Métricas) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <CardKPI 
                    label="Pendientes por Decidir" 
                    value={salidas.filter(s => s.estado === 'favorable').length} 
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} 
                    iconBg="#f1f5f9" 
                    iconColor="#0f172a" 
                />
                
                <WidgetPresupuesto 
                    planificado={PRESUPUESTO_TOTAL}
                    consumido={PRESUPUESTO_CONSUMIDO}
                    disponible={PRESUPUESTO_DISPONIBLE}
                />
            </div>

            {/* Contenedor de la Tabla */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Filtros Bar */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
                    <div style={{ position: 'relative', width: '320px' }}>
                        <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input 
                            type="text" 
                            placeholder="Buscar por código, programa o asignatura..." 
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>
                    <select style={{ padding: '0 16px', border: '1px solid #e2e8f0', borderRadius: '8px', height: '42px', fontSize: '14px', color: '#0f172a', outline: 'none', background: 'white' }}>
                        <option>Todos los Programas</option>
                        <option>Ingeniería Civil</option>
                        <option>Biología</option>
                        <option>Geología</option>
                    </select>
                </div>

                {/* Tabla */}
                {cargando ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>Cargando decisiones...</div>
                ) : (
                    <TablaConsejo salidas={salidasFiltradas} onDecidir={handleDecidir} />
                )}
            </div>
        </div>
    );

    if (salidaSeleccionada) {
        return (
            <VistaRevision 
                salida={salidaSeleccionada} 
                onVolver={handleVolver}
                PanelDerecho={<PanelDecisionConsejo salida={salidaSeleccionada} onVolver={handleVolver} />}
            />
        );
    }

    return (
        <div style={{ padding: '24px 32px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            {renderDashboard()}
        </div>
    );
};

export default ConsejoDashboard;
