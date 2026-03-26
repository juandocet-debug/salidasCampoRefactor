// modulos/admin/componentes/TabCalendario.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Tab de ventanas de programación (fechas apertura/cierre).
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from 'react';
import { clienteHttp } from '@/shared/api/clienteHttp';
import ModalConfirmar from '@/shared/componentes/generales/ModalConfirmar/ModalConfirmar';

const API = '/api/ventanas/';

export default function TabCalendario({ token, onToast }) {
    const [ventanas, setVentanas] = useState([]);
    const [nueva, setNueva] = useState({ nombre: '', fecha_apertura: '', fecha_cierre: '' });
    const [editId, setEditId] = useState(null);
    const [modalConfig, setModalConfig] = useState(null);

    const cargar = useCallback(async () => {
        try {
            const data = await clienteHttp.get(API);
            setVentanas(data.data.results || data.data);
        } catch (e) {
            onToast('❌ Error al cargar ventanas');
        }
    }, [token]);

    useEffect(() => { cargar(); }, [cargar]);

    const guardar = async () => {
        if (!nueva.nombre || !nueva.fecha_apertura || !nueva.fecha_cierre) return;
        
        try {
            if (editId) {
                await clienteHttp.put(`${API}${editId}/`, nueva);
                onToast('✅ Ventana actualizada');
                setEditId(null);
            } else {
                await clienteHttp.post(API, nueva);
                onToast('✅ Ventana de programación creada');
            }
            setNueva({ nombre: '', fecha_apertura: '', fecha_cierre: '' });
            cargar();
        } catch (e) {
            onToast('❌ Error al guardar ventana');
        }
    };

    const iniciarEdicion = (v) => {
        setNueva({ nombre: v.nombre, fecha_apertura: v.fecha_apertura, fecha_cierre: v.fecha_cierre });
        setEditId(v.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelarEdicion = () => {
        setNueva({ nombre: '', fecha_apertura: '', fecha_cierre: '' });
        setEditId(null);
    };

    const sugerirEliminar = (id) => {
        setModalConfig({
            titulo: '¿Eliminar ventana?',
            descripcion: 'Esta acción no se puede deshacer. ¿Deseas borrar esta ventana definitivamente?',
            labelConfirmar: 'Eliminar',
            accion: async () => {
                try {
                    await clienteHttp.delete(`${API}${id}/`);
                    onToast('🗑️ Ventana eliminada');
                    setModalConfig(null);
                    cargar();
                } catch (e) {
                    onToast('❌ Error al eliminar');
                }
            }
        });
    };

    const sugerirAlternar = (v) => {
        setModalConfig({
            titulo: `¿${v.activa ? 'Desactivar' : 'Activar'} ventana?`,
            descripcion: `¿Estás seguro de que deseas ${v.activa ? 'desactivar' : 'activar'} esta ventana de programación?`,
            labelConfirmar: 'Aceptar',
            accion: async () => {
                try {
                    await clienteHttp.put(`${API}${v.id}/`, { activa: !v.activa });
                    onToast('🔄 Estado de ventana actualizado');
                    setModalConfig(null);
                    cargar();
                } catch (e) {
                    onToast('❌ Error al cambiar estado');
                }
            }
        });
    };

    const hoy = new Date().toISOString().split('T')[0];

    return (
        <div className="herr-card">
            <div className="herr-card-header--premium">
                <div className="herr-premium-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                        <line x1="16" x2="16" y1="2" y2="6"></line>
                        <line x1="8" x2="8" y1="2" y2="6"></line>
                        <line x1="3" x2="21" y1="10" y2="10"></line>
                    </svg>
                </div>
                <div className="herr-premium-title-group">
                    <h3>Ventanas de Programación</h3>
                    <p>Define los períodos en que los profesores pueden crear salidas</p>
                </div>
            </div>
            <div className="herr-form-inline">
                <div className="herr-campo">
                    <label>Nombre</label>
                    <input
                        value={nueva.nombre}
                        onChange={e => setNueva({ ...nueva, nombre: e.target.value })}
                        placeholder="Ej: Primer semestre 2026"
                    />
                </div>
                <div className="herr-campo">
                    <label>Fecha apertura</label>
                    <input
                        type="date"
                        value={nueva.fecha_apertura}
                        onChange={e => setNueva({ ...nueva, fecha_apertura: e.target.value })}
                    />
                </div>
                <div className="herr-campo">
                    <label>Fecha cierre</label>
                    <input
                        type="date"
                        value={nueva.fecha_cierre}
                        onChange={e => setNueva({ ...nueva, fecha_cierre: e.target.value })}
                    />
                </div>
                {editId ? (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                        <button className="herr-btn herr-btn--dark herr-btn--sm" onClick={guardar}>Guardar</button>
                        <button className="herr-btn herr-btn--sm" style={{ background: '#e5e7eb', color: '#374151' }} onClick={cancelarEdicion}>Cancelar</button>
                    </div>
                ) : (
                    <button className="herr-btn herr-btn--dark herr-btn--sm" onClick={guardar}>+ Agregar</button>
                )}
            </div>
            <div className="herr-tabla-wrapper">
                <table className="herr-tabla">
                    <thead><tr><th>Nombre</th><th>Apertura</th><th>Cierre</th><th>Estado</th><th></th></tr></thead>
                    <tbody>
                        {ventanas.length === 0 && <tr><td colSpan={5} className="herr-vacio">No hay ventanas de programación</td></tr>}
                        {ventanas.map(v => {
                            const vigente = v.activa && v.fecha_apertura <= hoy && hoy <= v.fecha_cierre;
                            return (
                                <tr key={v.id}>
                                    <td><strong>{v.nombre}</strong></td>
                                    <td>{v.fecha_apertura}</td>
                                    <td>{v.fecha_cierre}</td>
                                    <td>
                                        <span className={`herr-badge ${vigente ? 'herr-badge--activo' : 'herr-badge--inactivo'}`}>
                                            {vigente ? '🟢 Vigente' : v.activa ? '⏳ Programada' : '⛔ Cerrada'}
                                        </span>
                                    </td>
                                    <td className="herr-acciones">
                                        <button 
                                            className="herr-action-circle" 
                                            style={{ color: '#10b981', background: '#ecfdf5', marginRight: '8px' }} 
                                            onClick={() => iniciarEdicion(v)} 
                                            title="Editar"
                                        >
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                        <button 
                                            className="herr-action-circle" 
                                            style={{ color: '#3b82f6', background: '#eff6ff', marginRight: '8px' }} 
                                            onClick={() => sugerirAlternar(v)} 
                                            title={v.activa ? 'Desactivar' : 'Activar'}
                                        >
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                {v.activa ? (
                                                    <>
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                                    </>
                                                ) : (
                                                    <>
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </>
                                                )}
                                            </svg>
                                        </button>
                                        <button className="herr-action-circle" style={{ color: '#fff', background: '#dc2626' }} onClick={() => sugerirEliminar(v.id)} title="Eliminar">
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {modalConfig && (
                <ModalConfirmar
                    titulo={modalConfig.titulo}
                    descripcion={modalConfig.descripcion}
                    onConfirmar={modalConfig.accion}
                    onCancelar={() => setModalConfig(null)}
                    labelConfirmar={modalConfig.labelConfirmar}
                />
            )}
        </div>
    );
}
