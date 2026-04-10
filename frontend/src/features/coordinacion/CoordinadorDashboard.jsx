import React, { useState, useEffect } from 'react';
import { CardKPI } from '../../shared/componentes/generales/Tarjetas/Tarjetas';
import { TablaSistema } from './TablaSistema';
import VistaRevision from './VistaRevision';

const CoordinadorDashboard = () => {
    const [salidas, setSalidas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [salidaSeleccionada, setSalidaSeleccionada] = useState(null);
    const [vistaActiva, setVistaActiva] = useState('pendientes');
    const [busqueda, setBusqueda] = useState('');
    const [paginaActual, setPaginaActual] = useState(1);
    const ITEMS_POR_PAGINA = 5;

    useEffect(() => {
        setCargando(true);
        const url = vistaActiva === 'pendientes' 
            ? 'http://localhost:8000/api/salidas/coordinacion/pendientes/' 
            : 'http://localhost:8000/api/salidas/coordinacion/aprobadas/';

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setSalidas(Array.isArray(data) ? data : []);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error fetching salidas", err);
                setCargando(false);
            });
    }, [vistaActiva, salidaSeleccionada]); // Recargar al volver de una revisión

    const handleRevisar = (item) => {
        setSalidaSeleccionada(item);
    };

    const salidasFiltradas = salidas.filter(s => 
        s.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        s.codigo.toLowerCase().includes(busqueda.toLowerCase())
    );

    const totalPaginas = Math.ceil(salidasFiltradas.length / ITEMS_POR_PAGINA);
    const indicesFiltrados = salidasFiltradas.slice(
        (paginaActual - 1) * ITEMS_POR_PAGINA, 
        paginaActual * ITEMS_POR_PAGINA
    );

    const renderDashboard = () => (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#0f172a' }}>Revisiones</h1>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>OTIUM / Revisiones</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <CardKPI 
                    label="Peticiones por Revisar" 
                    value={salidas.filter(s => s.estado === 'EN_REVISION').length || 3} 
                    icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>} 
                    iconBg="#eff6ff" 
                    iconColor="#3b82f6" 
                />
                <CardKPI 
                    label="Con Concepto Favorable" 
                    value="12" 
                    icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} 
                    iconBg="#ecfdf5" 
                    iconColor="#10b981" 
                />
                <CardKPI 
                    label="Rechazadas" 
                    value="1" 
                    icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>} 
                    iconBg="#fee2e2" 
                    iconColor="#dc2626" 
                />
            </div>

            {/* Componente Tabla Sistema basado en diseño frontend actual */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                
                {/* Header de la Tabla con Tabs y Buscador */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '15px' }}>
                    
                    {/* Tabs estilizados sin Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button 
                            onClick={() => { setVistaActiva('pendientes'); setPaginaActual(1); setBusqueda(''); }} 
                            style={{ cursor: 'pointer', background: vistaActiva === 'pendientes' ? '#5c4dfa' : 'transparent', color: vistaActiva === 'pendientes' ? 'white' : '#64748b', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', border: vistaActiva === 'pendientes' ? 'none' : '1px solid #e2e8f0', transition: 'all 0.2s' }}>
                            Pendientes de Revisión {vistaActiva === 'pendientes' && '>'}
                        </button>
                        
                        <button 
                            onClick={() => { setVistaActiva('aprobadas'); setPaginaActual(1); setBusqueda(''); }} 
                            style={{ cursor: 'pointer', background: vistaActiva === 'aprobadas' ? '#5c4dfa' : 'transparent', color: vistaActiva === 'aprobadas' ? 'white' : '#64748b', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', border: vistaActiva === 'aprobadas' ? 'none' : '1px solid #e2e8f0', transition: 'all 0.2s' }}>
                            Ya Evaluadas {vistaActiva === 'aprobadas' && '>'}
                        </button>
                    </div>

                    {/* Buscador */}
                    <div style={{ position: 'relative', width: '250px' }}>
                        <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input 
                            type="text" 
                            placeholder="Buscar salida..." 
                            value={busqueda}
                            onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                            style={{ width: '100%', padding: '8px 8px 8px 36px', borderRadius: '20px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>
                
                <TablaSistema 
                    titulo={vistaActiva === 'pendientes' ? "Pendientes de Revisión" : "Órdenes Aprobadas"} 
                    salidas={indicesFiltrados} 
                    cargando={cargando} 
                    onRevisar={handleRevisar} 
                    vistaActiva={vistaActiva}
                />

                {/* Paginador */}
                {!cargando && totalPaginas > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                        <button 
                            disabled={paginaActual === 1}
                            onClick={() => setPaginaActual(p => p - 1)}
                            style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '4px', background: '#fff', cursor: paginaActual === 1 ? 'not-allowed' : 'pointer', color: '#64748b' }}>
                            Anterior
                        </button>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>Página {paginaActual} de {totalPaginas}</span>
                        <button 
                            disabled={paginaActual === totalPaginas}
                            onClick={() => setPaginaActual(p => p + 1)}
                            style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '4px', background: '#fff', cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer', color: '#64748b' }}>
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </>
    );

    if (salidaSeleccionada) {
        return <VistaRevision salida={salidaSeleccionada} onVolver={() => setSalidaSeleccionada(null)} />;
    }

    return (
        <div style={{ padding: '20px', background: '#f8fafc', minHeight: '100vh' }}>
            {renderDashboard()}
        </div>
    );
};

export default CoordinadorDashboard;
