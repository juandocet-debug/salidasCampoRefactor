import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { clienteHttp } from '@/shared/api/clienteHttp';

const API = '/api/admin/parametros/';

export default function ModalParametrosCrud({ isOpen, onClose, token, onToast }) {
    const [parametros, setParametros] = useState([]);
    const [cargando, setCargando] = useState(false);
    
    // modal form state
    const [itemEditando, setItemEditando] = useState(null);
    const [formData, setFormData] = useState({ clave: '', nombre: '', valor: '', descripcion: '', categoria: 'Global' });

    const cargarParametros = async () => {
        setCargando(true);
        try {
            const res = await clienteHttp.get(API);
            setParametros(res.data);
        } catch (e) {
            onToast('❌ Error de conexión al cargar parámetros avanzados');
        }
        setCargando(false);
    };

    useEffect(() => {
        if (isOpen && token) {
            cargarParametros();
            setItemEditando(null);
        }
    }, [isOpen, token]);

    const guardar = async (e) => {
        e.preventDefault();
        try {
            const isEdit = !!itemEditando;
            const url = isEdit ? `${API}${itemEditando.id}/` : API;
            const method = isEdit ? 'put' : 'post';

            const res = await clienteHttp[method](url, formData);

            onToast(`✅ Parámetro ${isEdit ? 'actualizado' : 'creado'} correctamente`);
            setItemEditando(null);
            setFormData({ clave: '', nombre: '', valor: '', descripcion: '', categoria: 'Global' });
            cargarParametros();
        } catch (e) {
            const err = e.response?.data?.error || 'No se pudo guardar';
            onToast(`❌ Error: ${err}`);
        }
    };

    const borrar = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este parámetro del sistema?")) return;
        try {
            await clienteHttp.delete(`${API}${id}/`);
            onToast("✅ Parámetro eliminado");
            cargarParametros();
        } catch (e) {
            onToast("❌ Error al eliminar");
        }
    };

    const iniciarEdicion = (p) => {
        setItemEditando(p);
        setFormData({ clave: p.clave, nombre: p.nombre, valor: p.valor, descripcion: p.descripcion, categoria: p.categoria });
    };

    const cancelarEdicion = () => {
        setItemEditando(null);
        setFormData({ clave: '', nombre: '', valor: '', descripcion: '', categoria: 'Global' });
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="flota-modal-overlay">
            <div className="flota-modal" style={{ maxWidth: '1000px', width: '90%' }}>
                <div className="flota-modal-header">
                    <h2>⚙️ Configuración Avanzada de Parámetros</h2>
                    <button className="flota-modal-close" onClick={onClose}>&times;</button>
                </div>
                
                <div className="flota-modal-body" style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
                    
                    {/* Sección Formulario */}
                    <div>
                        <h4 className="flota-section-title" style={{ marginBottom: '16px' }}>
                            {itemEditando ? '✏️ Editar Parámetro' : '➕ Crear Nuevo Parámetro'}
                        </h4>
                        <form onSubmit={guardar}>
                            <div className="flota-form-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                                <div className="flota-field">
                                    <label>Clave <small style={{fontWeight: 'normal', color: '#94a3b8'}}>(Sin espacios)</small></label>
                                    <input required value={formData.clave} onChange={e => setFormData({...formData, clave: e.target.value})} />
                                </div>
                                <div className="flota-field">
                                    <label>Nombre</label>
                                    <input required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                                </div>
                                <div className="flota-field">
                                    <label>Valor</label>
                                    <input required value={formData.valor} onChange={e => setFormData({...formData, valor: e.target.value})} />
                                </div>
                                <div className="flota-field">
                                    <label>Categoría</label>
                                    <input required value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} />
                                </div>
                                <div className="flota-field flota-field--full" style={{ gridColumn: 'span 4' }}>
                                    <label>Descripción</label>
                                    <input value={formData.descripcion || ''} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
                                </div>
                            </div>
                            
                            <div className="flota-modal-footer" style={{ padding: '16px 0 0', marginTop: '16px', borderTop: 'none' }}>
                                {itemEditando && (
                                    <button type="button" className="flota-btn-cancel" onClick={cancelarEdicion}>Cancelar</button>
                                )}
                                <button type="submit" className="flota-btn-save">
                                    {itemEditando ? 'Guardar Cambios' : 'Crear Nuevo'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Sección Tabla */}
                    <div style={{ overflowX: 'auto', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        {cargando ? <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Cargando parámetros...</div> : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                                        <th style={{ padding: '16px 20px', fontWeight: '600' }}>Categoría</th>
                                        <th style={{ padding: '16px 20px', fontWeight: '600' }}>Clave Mnemónica</th>
                                        <th style={{ padding: '16px 20px', fontWeight: '600' }}>Nombre y Descrip.</th>
                                        <th style={{ padding: '16px 20px', fontWeight: '600' }}>Valor</th>
                                        <th style={{ padding: '16px 20px', fontWeight: '600', textAlign: 'right' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parametros.map(p => (
                                        <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: '14px 20px' }}>
                                                <span style={{ padding: '4px 10px', background: '#e0e7ff', color: '#4338ca', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.025em' }}>
                                                    {p.categoria.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: '#0f172a', fontWeight: '500' }}>{p.clave}</td>
                                            <td style={{ padding: '14px 20px' }}>
                                                <div style={{ fontWeight: '600', color: '#1e293b' }}>{p.nombre}</div>
                                                {p.descripcion && <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>{p.descripcion}</div>}
                                            </td>
                                            <td style={{ padding: '14px 20px', fontWeight: '600', color: '#059669' }}>{p.valor}</td>
                                            <td style={{ padding: '14px 20px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button style={{ padding: '8px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', color: '#334155' }} onClick={() => iniciarEdicion(p)} title="Editar">✏️</button>
                                                <button style={{ padding: '8px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', color: '#dc2626' }} onClick={() => borrar(p.id)} title="Eliminar">🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {parametros.length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>No hay parámetros registrados.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
