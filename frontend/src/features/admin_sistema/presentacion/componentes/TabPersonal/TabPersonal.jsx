import React, { useState, useEffect } from 'react';
import { personalService } from '../../../api/personal.service';
import './TabPersonal.css';

export default function TabPersonal({ token, onToast }) {
    const [personal, setPersonal] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '', apellido: '', email: '', cedula: '', telefono: '', rol: 'conductor', password: ''
    });

    const ROLES = [
        { id: 'conductor', nombre: 'Conductor Institucional' },
        { id: 'profesor', nombre: 'Profesor' },
        { id: 'coordinador_logistica', nombre: 'Coordinador de Logística' },
        { id: 'consejo_facultad', nombre: 'Consejo de Facultad' },
        { id: 'admin', nombre: 'Administrador' }
    ];

    useEffect(() => {
        cargarPersonal();
    }, []);

    const cargarPersonal = async () => {
        try {
            setLoading(true);
            const data = await personalService.listarPersonal(token);
            setPersonal(data);
        } catch (error) {
            console.error("Error cargando personal", error);
            onToast?.("❌ Error al cargar la lista de personal");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenNew = () => {
        setEditingId(null);
        setFormData({ nombre: '', apellido: '', email: '', cedula: '', telefono: '', rol: 'conductor', password: '' });
        setShowModal(true);
    };

    const handleOpenEdit = (p) => {
        setEditingId(p.id);
        setFormData({
            nombre: p.nombre || '',
            apellido: p.apellido || '',
            email: p.email || '',
            cedula: p.cedula || '',
            telefono: p.telefono || '',
            rol: p.rol || 'conductor',
            password: '' // Oculto por seguridad, si escribe se actualiza
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar a este usuario?")) return;
        try {
            await personalService.eliminarPersonal(id, token);
            setPersonal(prev => prev.filter(p => p.id !== id));
            onToast?.("✅ Usuario eliminado");
        } catch (error) {
            onToast?.("❌ Error al eliminar usuario");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const updated = await personalService.editarPersonal(editingId, formData, token);
                setPersonal(prev => prev.map(p => p.id === editingId ? updated : p));
                onToast?.("✅ Usuario actualizado exitosamente");
            } else {
                const nuevo = await personalService.crearPersonal(formData, token);
                setPersonal(prev => [...prev, nuevo]);
                onToast?.("✅ Personal agregado exitosamente");
            }
            setShowModal(false);
        } catch (error) {
            console.error(error);
            onToast?.("❌ Ocurrió un error al guardar");
        }
    };

    const getBadgeClass = (rol) => {
        if (['conductor', 'profesor', 'coordinador_logistica'].includes(rol)) return rol;
        return 'default';
    };

    const getRolName = (rol) => {
        return ROLES.find(r => r.id === rol)?.nombre || rol;
    };

    return (
        <div className="tab-personal fade-in">
            <div className="tab-personal-header">
                <div>
                    <h2>Gestión de Personal Administrativo</h2>
                    <p style={{color: '#64748b', margin: '4px 0 0'}}>Conductores, Profesores, y Coordinadores</p>
                </div>
                <button className="btn-nuevo-personal" onClick={handleOpenNew}>
                    + Nuevo Registro
                </button>
            </div>

            <div className="personal-table-container">
                <table className="personal-table">
                    <thead>
                        <tr>
                            <th>Nombres</th>
                            <th>Correo</th>
                            <th>Cédula</th>
                            <th>Teléfono</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Cargando...</td></tr>
                        ) : personal.length === 0 ? (
                            <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No hay personal registrado</td></tr>
                        ) : (
                            personal.map(p => (
                                <tr key={p.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {p.foto ? (
                                                <img src={p.foto} alt="foto" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b' }}>
                                                    {p.nombre.charAt(0)}
                                                </div>
                                            )}
                                            <strong>{p.nombre} {p.apellido}</strong>
                                        </div>
                                    </td>
                                    <td>{p.email}</td>
                                    <td>{p.cedula || '-'}</td>
                                    <td>{p.telefono || '-'}</td>
                                    <td>
                                        <span className={`rol-badge ${getBadgeClass(p.rol)}`}>
                                            {getRolName(p.rol)}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <button className="btn-edit" onClick={() => handleOpenEdit(p)} title="Editar">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDelete(p.id)} title="Eliminar">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content fade-in">
                        <div className="modal-header">
                            <h3>{editingId ? 'Editar Personal' : 'Nuevo Personal'}</h3>
                            <button className="btn-close" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Nombre</label>
                                    <input type="text" required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                                </div>
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Apellido</label>
                                    <input type="text" required value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Correo Electrónico (Login)</label>
                                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>

                            <div className="form-group">
                                <label>{editingId ? 'Nueva Contraseña (dejar en blanco para no cambiar)' : 'Contraseña'}</label>
                                <input type="text" required={!editingId} placeholder={editingId ? '***' : ''} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                            </div>

                            <div style={{display: 'flex', gap: '10px'}}>
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Cédula</label>
                                    <input type="text" value={formData.cedula} onChange={e => setFormData({...formData, cedula: e.target.value})} />
                                </div>
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Teléfono</label>
                                    <input type="text" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Rol en el Sistema</label>
                                <select value={formData.rol} onChange={e => setFormData({...formData, rol: e.target.value})}>
                                    {ROLES.map(r => (
                                        <option key={r.id} value={r.id}>{r.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn-save">Guardar Datos</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
