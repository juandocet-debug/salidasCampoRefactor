import React, { useState, useEffect } from 'react';
import { directorioService } from '../../../api/directorio.service';
import './TabDirectorio.css'; // Reusa estilos o añade nuevos si es necesario

export default function ModalEstudiantesDirectorio({ token, onClose, onToast }) {
    const [estudiantes, setEstudiantes] = useState([]);
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
            setEstudiantes(data);
        } catch (err) {
            setError('Error al cargar la lista de estudiantes del directorio activo.');
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
            facultad: est.facultad,
            programa: est.programa,
            password: '', // Vacio por seguridad, solo se envia si cambia
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
            const payload = { ...formData };
            if (!payload.password) delete payload.password; // No enviar si esta vacio
            
            await directorioService.actualizarEstudiante(id, payload, token);
            onToast('✅ Estudiante actualizado exitosamente');
            setEditandoId(null);
            await cargarEstudiantes(); // recargar para ver cambios reales
        } catch (err) {
            onToast('❌ Error: ' + err.message);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-content" style={{ background: 'white', borderRadius: '12px', width: '90%', maxWidth: '1000px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                
                <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem' }}>Estudiantes en Directorio Activo</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
                </div>

                <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                    {error && <div className="tab-dir-error-msg" style={{ marginBottom: '15px' }}>{error}</div>}
                    
                    {cargando ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Cargando lista de estudiantes...</div>
                    ) : (
                        <table className="tab-dir-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Correo</th>
                                    <th>Facultad</th>
                                    <th>Programa</th>
                                    <th>Contraseña</th>
                                    <th style={{ textAlign: 'center' }}>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estudiantes.map(est => {
                                    const isEditing = editandoId === est.id;
                                    return (
                                        <tr key={est.id}>
                                            <td>
                                                {isEditing ? 
                                                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} style={{ width: '100%', padding: '4px' }}/> 
                                                    : est.nombre}
                                            </td>
                                            <td>
                                                {isEditing ? 
                                                    <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} style={{ width: '100%', padding: '4px' }}/> 
                                                    : est.apellido}
                                            </td>
                                            <td>
                                                {isEditing ? 
                                                    <input type="email" name="correo" value={formData.correo} onChange={handleChange} style={{ width: '100%', padding: '4px' }}/> 
                                                    : est.correo}
                                            </td>
                                            <td>
                                                {isEditing ? 
                                                    <input type="text" name="facultad" value={formData.facultad} onChange={handleChange} style={{ width: '100%', padding: '4px' }}/> 
                                                    : est.facultad}
                                            </td>
                                            <td>
                                                {isEditing ? 
                                                    <input type="text" name="programa" value={formData.programa} onChange={handleChange} style={{ width: '100%', padding: '4px' }}/> 
                                                    : est.programa}
                                            </td>
                                            <td>
                                                {isEditing ? 
                                                    <input type="password" name="password" placeholder="Nueva (opcional)" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '4px' }}/> 
                                                    : <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>******</span>}
                                            </td>
                                            <td style={{ textAlign: 'center', minWidth: '120px' }}>
                                                {isEditing ? (
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                        <button onClick={() => handleSave(est.id)} disabled={guardando} style={{ background: '#10b981', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Guardar</button>
                                                        <button onClick={handleCancelEdit} style={{ background: '#cbd5e1', color: '#334155', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => handleEditClick(est)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', textDecoration: 'underline' }}>Editar</button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {estudiantes.length === 0 && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No hay estudiantes cargados en el directorio activo.</td>
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
