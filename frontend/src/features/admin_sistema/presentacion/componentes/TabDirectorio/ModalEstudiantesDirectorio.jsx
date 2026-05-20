import React, { useState, useEffect } from 'react';
import { directorioService } from '../../../api/directorio.service';
import './TabDirectorio.css'; // Reusa estilos o añade nuevos si es necesario

export default function ModalEstudiantesDirectorio({ token, onClose, onToast }) {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    
    // Estado de edición
    const [editandoId, setEditandoId] = useState(null);
    const [formData, setFormData] = useState({});
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        cargarEstudiantes();
    }, []);

    const cargarEstudiantes = async () => {
        try {
            setCargando(true);
            const data = await directorioService.listarActivos(token);
            setUsuarios(data);
        } catch (err) {
            setError('Error al cargar los usuarios del directorio.');
        } finally {
            setCargando(false);
        }
    };

    const handleEditClick = (est) => {
        setEditandoId(est.id);
        setFormData({
            correo: est.correo,
            nombre: est.nombre,
            apellido: est.apellido,
            cedula: est.cedula,
            telefono: est.telefono,
            facultad: est.facultad,
            programa: est.programa,
            rol: est.rol,
            password: '', 
        });
    };

    const handleCancelEdit = () => {
        setEditandoId(null);
        setFormData({});
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async (id) => {
        try {
            setGuardando(true);
            const editado = await directorioService.actualizarEstudiante(id, {
                nombre: formData.nombre,
                apellido: formData.apellido,
                correo: formData.correo,
                cedula: formData.cedula,
                telefono: formData.telefono,
                facultad: formData.facultad,
                programa: formData.programa,
                rol: formData.rol,
                password: formData.password ? formData.password : undefined
            }, token);
            onToast('✅ Usuario actualizado exitosamente');
            setUsuarios(prev => prev.map(u => u.id === editado.id ? editado : u));
            setEditandoId(null);
        } catch (err) {
            onToast('❌ Error: ' + err.message);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-content" style={{ background: 'white', borderRadius: '12px', width: '90%', maxWidth: '1200px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                
                <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem' }}>Usuarios en Directorio Activo</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
                </div>

                <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                    {error && <div className="tab-dir-error-msg" style={{ marginBottom: '15px' }}>{error}</div>}
                    
                    {cargando ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Cargando lista de usuarios...</div>
                    ) : (
                        <table className="tab-dir-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Correo</th>
                                    <th>Cédula</th>
                                    <th>Teléfono</th>
                                    <th>Rol</th>
                                    <th>Facultad</th>
                                    <th>Programa</th>
                                    <th>Contraseña</th>
                                    <th style={{ textAlign: 'center' }}>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(u => {
                                    const isEditing = editandoId === u.id;
                                    return (
                                        <tr key={u.id}>
                                            <td>{isEditing ? <input type="text" name="nombre" value={formData.nombre || ''} onChange={handleChange} style={{ width: '100%' }}/> : u.nombre}</td>
                                            <td>{isEditing ? <input type="text" name="apellido" value={formData.apellido || ''} onChange={handleChange} style={{ width: '100%' }}/> : u.apellido}</td>
                                            <td>{isEditing ? <input type="email" name="correo" value={formData.correo || ''} onChange={handleChange} style={{ width: '100%' }}/> : u.correo}</td>
                                            <td>{isEditing ? <input type="text" name="cedula" value={formData.cedula || ''} onChange={handleChange} style={{ width: '100%' }}/> : u.cedula}</td>
                                            <td>{isEditing ? <input type="text" name="telefono" value={formData.telefono || ''} onChange={handleChange} style={{ width: '100%' }}/> : u.telefono}</td>
                                            <td>{isEditing ? <input type="text" name="rol" value={formData.rol || ''} onChange={handleChange} style={{ width: '100%' }}/> : u.rol}</td>
                                            <td>{isEditing ? <input type="text" name="facultad" value={formData.facultad || ''} onChange={handleChange} style={{ width: '100%' }}/> : u.facultad}</td>
                                            <td>{isEditing ? <input type="text" name="programa" value={formData.programa || ''} onChange={handleChange} style={{ width: '100%' }}/> : u.programa}</td>
                                            <td>{isEditing ? <input type="password" name="password" placeholder="Nueva..." value={formData.password || ''} onChange={handleChange} style={{ width: '100%' }}/> : <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>******</span>}</td>
                                            <td style={{ textAlign: 'center', minWidth: '120px' }}>
                                                {isEditing ? (
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                        <button onClick={() => handleSave(u.id)} disabled={guardando} style={{ background: '#10b981', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Guardar</button>
                                                        <button onClick={handleCancelEdit} style={{ background: '#cbd5e1', color: '#334155', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => handleEditClick(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', textDecoration: 'underline' }}>Editar</button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {usuarios.length === 0 && (
                                    <tr>
                                        <td colSpan="10" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No hay usuarios cargados en el directorio activo.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
