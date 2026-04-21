import React, { useState, useEffect } from 'react';
import { CardMatcha } from '../../../shared/componentes/generales/Tarjetas/Tarjetas';
import { EtiquetaPill } from '../../../shared/componentes/generales/ElementosUX/ElementosUX';
import { obtenerVehiculosDisponibles } from '../aplicacion/servicios';

const AsignarTransportePanel = ({ salida, onVolver }) => {
    const [tipoTransporte, setTipoTransporte] = useState(null); // 'propio' | 'contratado'
    const [flotaInstitucional, setFlotaInstitucional] = useState([]);
    const [cargandoVehiculos, setCargandoVehiculos] = useState(false);

    useEffect(() => {
        if (tipoTransporte === 'propio' && flotaInstitucional.length === 0) {
            setCargandoVehiculos(true);
            obtenerVehiculosDisponibles()
                .then(data => {
                    if (Array.isArray(data)) {
                        // Filtrar para mostrar solo listos institucionales
                        setFlotaInstitucional(data.filter(v => v.propietario === 'institucional'));
                    }
                    setCargandoVehiculos(false);
                })
                .catch(err => {
                    console.error("Error obteniendo flota institucional:", err);
                    setCargandoVehiculos(false);
                });
        }
    }, [tipoTransporte, flotaInstitucional.length]);

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header con botón para volver */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                <button 
                    onClick={onVolver}
                    className="herr-action-circle"
                    style={{ color: '#475569', background: '#f1f5f9', border: '1px solid #cbd5e1' }}
                    title="Volver al listado"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#0f172a' }}>Asignación Logística</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <code style={{ background: '#f1f5f9', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', color: '#475569', border: '1px solid #cbd5e1' }}>
                            {salida?.codigo || 'SAL-XXX'}
                        </code>
                        <span style={{ color: '#0f172a', fontWeight: '500', fontSize: '14px' }}>{salida?.nombre}</span>
                        <EtiquetaPill texto="Programar Vehículo" color="warning" />
                    </div>
                </div>
            </div>

            {/* Selector de Modalidad */}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>1. Modelo de Transporte</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {/* Tarjeta Flota Institucional */}
                    <div 
                        onClick={() => setTipoTransporte('propio')}
                        style={{ 
                            padding: '24px', 
                            border: tipoTransporte === 'propio' ? '2px solid #a855f7' : '1px solid #cbd5e1', 
                            borderRadius: '12px', 
                            cursor: 'pointer', 
                            background: tipoTransporte === 'propio' ? '#faf5ff' : '#fff', 
                            transition: 'all 0.2s ease', 
                            display: 'flex', alignItems: 'flex-start', gap: '16px' 
                        }}
                    >
                        <div style={{ padding: '12px', borderRadius: '10px', background: tipoTransporte === 'propio' ? '#f3e8ff' : '#f1f5f9', color: tipoTransporte === 'propio' ? '#9333ea' : '#64748b' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 13v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: tipoTransporte === 'propio' ? '#7e22ce' : '#334155', fontWeight: '600' }}>Flota Institucional</h4>
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>Asignar conductores y vehículos propios de la universidad sujetos a disponibilidad del calendario.</p>
                        </div>
                    </div>

                    {/* Tarjeta Contratado */}
                    <div 
                        onClick={() => setTipoTransporte('contratado')}
                        style={{ 
                            padding: '24px', 
                            border: tipoTransporte === 'contratado' ? '2px solid #a855f7' : '1px solid #cbd5e1', 
                            borderRadius: '12px', 
                            cursor: 'pointer', 
                            background: tipoTransporte === 'contratado' ? '#faf5ff' : '#fff', 
                            transition: 'all 0.2s ease', 
                            display: 'flex', alignItems: 'flex-start', gap: '16px' 
                        }}
                    >
                        <div style={{ padding: '12px', borderRadius: '10px', background: tipoTransporte === 'contratado' ? '#f3e8ff' : '#f1f5f9', color: tipoTransporte === 'contratado' ? '#9333ea' : '#64748b' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><path d="M14 8h-1"/><path d="M14 12h-1"/><path d="M14 16h-1"/></svg>
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: tipoTransporte === 'contratado' ? '#7e22ce' : '#334155', fontWeight: '600' }}>Outsourcing (Contratado)</h4>
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>Registrar logística externa para salidas sin cobertura institucional. Afecta pólizas y presupuesto (recargo 1.3x).</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vistas Dinámicas */}
            {tipoTransporte === 'propio' && (
                <div className="fade-in" style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>2. Parque Automotor Disponible</h3>
                            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Coincidencias en el rango de fechas de la salida.</p>
                        </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {cargandoVehiculos ? (
                            <div className="herr-vacio" style={{ gridColumn: '1 / -1' }}>Cargando vehículos disponibles...</div>
                        ) : flotaInstitucional.length === 0 ? (
                            <div className="herr-vacio" style={{ gridColumn: '1 / -1' }}>No hay vehículos propios disponibles. Requiere contratación externa.</div>
                        ) : flotaInstitucional.map(v => {
                            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                            const fotoSrc = v.foto_url
                                ? (v.foto_url.startsWith('http') ? v.foto_url : `${API_BASE}${v.foto_url}`)
                                : (['buseta', 'microbus', 'camioneta', 'furgon'].includes(String(v.tipo).toLowerCase()) 
                                    ? 'https://cdn3d.iconscout.com/3d/premium/thumb/minivan-6780879-5573489.png'
                                    : 'https://cdn3d.iconscout.com/3d/premium/thumb/bus-6780880-5573490.png');

                            const tipoStr = String(v.tipo).toLowerCase();
                            const cardColor = tipoStr === 'bus' ? 'blue' : 
                                              tipoStr === 'buseta' ? 'sky' : 
                                              tipoStr === 'microbus' ? 'cyan' : 
                                              tipoStr === 'camioneta' ? 'slate' : 'indigo';

                            return (
                                <CardMatcha 
                                    key={v.id}
                                    title={v.placa}
                                    color={cardColor}
                                    badgeText={v.estado_tecnico?.toUpperCase()}
                                    badgeColor={v.estado_tecnico === 'disponible' ? '#10b981' : (v.estado_tecnico === 'mantenimiento' ? '#ef4444' : '#f59e0b')}
                                    imageSrc={fotoSrc}
                                    bannerText={`${v.capacidad} Puestos - ${v.tipo}`}
                                    tags={v.tipo_combustible ? [`Motor ${v.tipo_combustible}`] : []}
                                    actions={
                                        v.estado_tecnico === 'disponible' 
                                            ? <button className="herr-btn herr-btn--sm" style={{ width: '100%', justifyContent: 'center' }}>Seleccionar Vehículo</button>
                                            : <button className="herr-btn herr-btn--sm herr-btn--ghost" disabled style={{ width: '100%', justifyContent: 'center', opacity: 0.6 }}>No Disponible</button>
                                    }
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {tipoTransporte === 'contratado' && (
                <div className="fade-in" style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>2. Registro de Proveedor Externo</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#f8fafc', padding: '20px', borderRadius: '10px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: '600' }}>Empresa / Razón Social <span style={{color: 'red'}}>*</span></label>
                            <input type="text" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }} placeholder="Ej: Transportes y Turismo SAS" />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: '600' }}>Costo Proyectado Cotizado <span style={{color: 'red'}}>*</span></label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8', fontWeight: '500' }}>$</span>
                                <input type="number" style={{ width: '100%', padding: '12px 12px 12px 28px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }} placeholder="0.00" />
                            </div>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: '600' }}>Conductor Asignado / Contacto</label>
                            <input type="text" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }} placeholder="Nombre del conductor o contacto de la empresa" />
                        </div>
                    </div>
                    
                    <div style={{ marginTop: '20px', padding: '16px', background: '#fffbeb', borderRadius: '8px', borderLeft: '4px solid #f59e0b', fontSize: '13px', color: '#92400e', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        <div>
                            <strong>Impacto Presupuestal:</strong> Al confirmar esta asignación, el costo final descontado de la bolsa de la facultad incluirá el sobrecosto contractual y seguros exigidos por la institución.
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="herr-btn">
                            Confirmar Asignación Externa
                        </button>
                    </div>
                </div>
            )}
            <style>{`
                .fade-in { animation: fadeIn 0.3s ease forwards; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                input:focus { border-color: #a855f7 !important; box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15); }
            `}</style>
        </div>
    );
};

export default AsignarTransportePanel;
