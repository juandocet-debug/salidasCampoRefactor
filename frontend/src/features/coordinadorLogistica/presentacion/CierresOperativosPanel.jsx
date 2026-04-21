import React from 'react';
import { BotonAccion, EtiquetaPill } from '../../../shared/componentes/generales/ElementosUX/ElementosUX';

const CierresOperativosPanel = () => {
    // Mocks de salidas que acaban de terminar su viaje físico
    const cierresPendientes = [
        { id: 201, codigo: 'SAL-001', vehiculo: 'UPN-001 (Buseta)', conductor: 'Juan Pérez', km_salida: 82500 }
    ];

    return (
        <div style={{ padding: '30px', background: '#f8fafc', minHeight: '100vh', animation: 'fadeIn 0.3s' }}>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#0f172a' }}>Cierres Operativos</h1>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Protocolo técnico para vehículos que retornan a la Universidad.</p>
            </div>

            {cierresPendientes.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <span style={{ fontSize: '30px' }}>✅</span>
                    <p style={{ color: '#475569', marginTop: '10px' }}>No hay vehículos pendientes por Cierre Técnico hoy.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '25px' }}>
                    {cierresPendientes.map(c => (
                        <div key={c.id} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                            <div style={{ padding: '15px 25px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: '#1e293b', fontSize: '16px' }}>Vehículo Retornado: {c.vehiculo}</h3>
                                    <span style={{ fontSize: '13px', color: '#64748b' }}>Asignado a: {c.codigo} | Conductor: {c.conductor}</span>
                                </div>
                                <EtiquetaPill texto="Requiere Cierre" color="warning" />
                            </div>

                            <div style={{ padding: '25px', display: 'grid', gridTemplateColumns: 'minmax(200px, 300px) 1fr', gap: '40px' }}>
                                {/* Formulario Técnico */}
                                <div>
                                    <h4 style={{ margin: '0 0 15px 0', color: '#334155' }}>Kilometraje</h4>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>KM Inicial (Salida)</label>
                                        <input type="number" readOnly value={c.km_salida} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#94a3b8' }} />
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#475569', marginBottom: '5px', fontWeight: 'bold' }}>KM Final (Llegada)</label>
                                        <input type="number" placeholder="Ej: 82650" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #3b82f6', outline: 'none' }} />
                                    </div>
                                </div>

                                {/* Checklist Visual */}
                                <div>
                                    <h4 style={{ margin: '0 0 15px 0', color: '#334155' }}>Checklist de Retorno</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        {['Limpieza Interior OK', 'Carrocería sin golpes', 'Llantas OK', 'Luces OK', 'Combustible repostado', 'Botiquín OK'].map((item, idx) => (
                                            <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                                                <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                                                <span style={{ fontSize: '13px', color: '#475569' }}>{item}</span>
                                            </label>
                                        ))}
                                    </div>
                                    
                                    <div style={{ marginTop: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#475569', marginBottom: '5px' }}>Observaciones del Coordinador Logístico</label>
                                        <textarea rows="3" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical' }} placeholder="¿Algún rayón nuevo o problema reportado por el conductor?"></textarea>
                                    </div>

                                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                                        <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                                            Confirmar Cierre y Liberar Vehículo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CierresOperativosPanel;
