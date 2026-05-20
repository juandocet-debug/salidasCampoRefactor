import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import '../GestionEmpresas/GestionEmpresasModal.css';
import {
    obtenerConductoresInstitucionales,
    crearConductorInstitucional,
    eliminarConductorInstitucional,
    actualizarConductorInstitucional,
} from '../../aplicacion/servicios';
import useAlertas from '../../../../shared/estado/useAlertas';
import ModalConfirmar from '../../../../shared/componentes/generales/ModalConfirmar/ModalConfirmar';
import { API_URL } from '../../../../shared/api/config';

const IcoClose = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);
const IcoPlus = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
);
const IcoEdit = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
);
const IcoDriver = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);
const IcoCamera = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="4"></circle>
    </svg>
);

const TablaConductores = ({ conductores, onEditar, onEliminar }) => (
    <div className="ge-table-wrap">
        <table className="ge-table">
            <thead>
                <tr>
                    <th style={{ width: '60px', textAlign: 'center' }}>Foto</th>
                    <th>Nombre Completo</th>
                    <th>Cédula</th>
                    <th>Teléfono</th>
                    <th>Licencia</th>
                    <th>Estado</th>
                    <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {conductores.length === 0 ? (
                    <tr><td colSpan={6} className="ge-empty">No hay conductores institucionales registrados.</td></tr>
                ) : conductores.map(c => (
                    <tr key={c.id}>
                        <td style={{ textAlign: 'center' }}>
                            {c.foto ? (
                                <img src={c.foto.replace('http://127.0.0.1:8000', API_URL)} alt={c.nombre} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                            ) : (
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: '#94a3b8' }}>
                                    <IcoDriver />
                                </div>
                            )}
                        </td>
                        <td style={{ fontWeight: '600', color: '#0f172a' }}>{c.nombre}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{c.cedula}</td>
                        <td>{c.telefono || '—'}</td>
                        <td>{c.licencia || '—'}</td>
                        <td>
                            <span style={{ 
                                padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold',
                                background: c.activo ? '#dcfce7' : '#fef2f2',
                                color: c.activo ? '#166534' : '#991b1b'
                            }}>
                                {c.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button className="ge-btn-edit" onClick={() => onEditar(c)}>
                                    <IcoEdit /> Editar
                                </button>
                                <button className="ge-btn-danger" onClick={() => onEliminar(c)}>Eliminar</button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const FORM_CONDUCTOR_VACIO = { nombres: '', apellidos: '', cedula: '', email: '', telefono: '', licencia: '', activo: true };

export default function GestionConductoresModal({ onCerrar, onConductoresActualizados }) {
    const { agregarAlerta } = useAlertas();
    
    const [conductores, setConductores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [conductorAEliminar, setConductorAEliminar] = useState(null);
    const [conductorEditando, setConductorEditando] = useState(null);
    const [formConductor, setFormConductor] = useState(FORM_CONDUCTOR_VACIO);
    
    const [fotoArchivo, setFotoArchivo] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => { cargarConductores(); }, []);

    const cargarConductores = async () => {
        setCargando(true);
        try {
            const data = await obtenerConductoresInstitucionales(true);
            setConductores(data);
            if(onConductoresActualizados) onConductoresActualizados(data);
        } catch {
            agregarAlerta('Error al cargar conductores.', 'error');
        } finally {
            setCargando(false);
        }
    };

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFotoArchivo(file);
            setFotoPreview(URL.createObjectURL(file));
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formConductor.nombres || !formConductor.apellidos || !formConductor.cedula) return;
        setGuardando(true);
        
        try {
            const formData = new FormData();
            formData.append('nombre', `${formConductor.nombres.trim()} ${formConductor.apellidos.trim()}`);
            formData.append('cedula', formConductor.cedula);
            if(formConductor.email) formData.append('email', formConductor.email);
            if(formConductor.telefono) formData.append('telefono', formConductor.telefono);
            if(formConductor.licencia) formData.append('licencia', formConductor.licencia);
            formData.append('activo', formConductor.activo ? 'true' : 'false');
            if(fotoArchivo) formData.append('foto', fotoArchivo);

            if (conductorEditando) {
                await actualizarConductorInstitucional(conductorEditando.id, formData);
                agregarAlerta(`Conductor "${formConductor.nombre}" actualizado.`, 'exito');
            } else {
                await crearConductorInstitucional(formData);
                agregarAlerta(`Conductor "${formConductor.nombre}" registrado.`, 'exito');
            }
            cancelarEdicion();
            await cargarConductores();
        } catch (err) {
            console.error(err);
            agregarAlerta('Error al guardar el conductor.', 'error');
        } finally {
            setGuardando(false);
        }
    };

    const iniciarEdicion = (c) => {
        setConductorEditando(c);
        
        const parts = (c.nombre || '').trim().split(' ');
        let half = Math.ceil(parts.length / 2);
        if (parts.length === 3) half = 1;
        const n = parts.slice(0, half).join(' ');
        const a = parts.slice(half).join(' ');

        setFormConductor({
            nombres: n || '',
            apellidos: a || '',
            cedula: c.cedula || '',
            email: c.email || '',
            telefono: c.telefono || '',
            licencia: c.licencia || '',
            activo: c.activo !== undefined ? c.activo : true,
        });
        setFotoArchivo(null);
        setFotoPreview(c.foto ? c.foto.replace('http://127.0.0.1:8000', API_URL) : null);
        setTimeout(() => document.getElementById('form-conductor-inst')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    };

    const cancelarEdicion = () => {
        setConductorEditando(null);
        setFormConductor(FORM_CONDUCTOR_VACIO);
        setFotoArchivo(null);
        setFotoPreview(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    const confirmarEliminar = async () => {
        try {
            await eliminarConductorInstitucional(conductorAEliminar.id);
            agregarAlerta(`Conductor eliminado correctamente.`, 'info');
            setConductorAEliminar(null);
            await cargarConductores();
        } catch {
            agregarAlerta('Error al eliminar.', 'error');
            setConductorAEliminar(null);
        }
    };

    return createPortal(
        <>
            <div className="ge-overlay" onClick={onCerrar} style={{ zIndex: 10000 }}>
                <div className="ge-modal" onClick={e => e.stopPropagation()}>
                    <div className="ge-header">
                        <div className="ge-header__left">
                            <div className="ge-header__icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
                                <IcoDriver />
                            </div>
                            <div>
                                <h2>Flota Institucional</h2>
                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                                    Gestiona los conductores de la universidad
                                </p>
                            </div>
                        </div>
                        <button className="ge-header__close" onClick={onCerrar}><IcoClose /></button>
                    </div>

                    <div className="ge-body" style={{ padding: '24px' }}>
                        <div className="ge-form-card" id="form-conductor-inst">
                            <h4>
                                {conductorEditando
                                    ? <><IcoEdit /> Editando: {conductorEditando.nombre}</>
                                    : <><IcoPlus /> Registrar Nuevo Conductor Institucional</>
                                }
                            </h4>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                                
                                {/* Columna Izquierda: Foto */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '120px' }}>
                                    <div 
                                        onClick={triggerFileInput}
                                        style={{ 
                                            width: '100px', height: '100px', borderRadius: '50%', background: '#f1f5f9',
                                            border: '2px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center',
                                            justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.border = '2px solid #3b82f6'}
                                        onMouseOut={e => e.currentTarget.style.border = '2px dashed #cbd5e1'}
                                    >
                                        {fotoPreview ? (
                                            <img src={fotoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <>
                                                <IcoCamera />
                                                <span style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>Añadir Foto</span>
                                            </>
                                        )}
                                        <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '10px', textAlign: 'center', padding: '2px 0', opacity: fotoPreview ? 1 : 0 }}>
                                            Cambiar
                                        </div>
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        ref={fileInputRef} 
                                        style={{ display: 'none' }} 
                                        onChange={handleFotoChange}
                                    />
                                </div>

                                {/* Columna Derecha: Datos */}
                                <div style={{ flex: 1, minWidth: '300px' }}>
                                    <div className="ge-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                        <div className="ge-field">
                                            <label>Nombres <span style={{ color: 'red' }}>*</span></label>
                                            <input type="text" placeholder="Ej: Carlos"
                                                value={formConductor.nombres}
                                                onChange={e => setFormConductor({ ...formConductor, nombres: e.target.value })}
                                                required />
                                        </div>
                                        <div className="ge-field">
                                            <label>Apellidos <span style={{ color: 'red' }}>*</span></label>
                                            <input type="text" placeholder="Ej: Rodríguez"
                                                value={formConductor.apellidos}
                                                onChange={e => setFormConductor({ ...formConductor, apellidos: e.target.value })}
                                                required />
                                        </div>
                                        <div className="ge-field">
                                            <label>Cédula <span style={{ color: 'red' }}>*</span></label>
                                            <input type="text" placeholder="Ej: 12345678"
                                                value={formConductor.cedula}
                                                onChange={e => setFormConductor({ ...formConductor, cedula: e.target.value })}
                                                required />
                                        </div>
                                        <div className="ge-field">
                                            <label>Correo Institucional</label>
                                            <input type="email" placeholder="usuario@upn.edu.co"
                                                value={formConductor.email}
                                                onChange={e => setFormConductor({ ...formConductor, email: e.target.value })} />
                                        </div>
                                        <div className="ge-field">
                                            <label>Teléfono</label>
                                            <input type="tel" placeholder="Ej: 311 234 5678"
                                                value={formConductor.telefono}
                                                onChange={e => setFormConductor({ ...formConductor, telefono: e.target.value })} />
                                        </div>
                                        <div className="ge-field">
                                            <label>Licencia</label>
                                            <input type="text" placeholder="Ej: C2E"
                                                value={formConductor.licencia}
                                                onChange={e => setFormConductor({ ...formConductor, licencia: e.target.value })} />
                                        </div>
                                        <div className="ge-field" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <label>Estado del Conductor</label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '4px' }}>
                                                <div style={{
                                                    position: 'relative', width: '42px', height: '24px', 
                                                    background: formConductor.activo ? '#10b981' : '#cbd5e1', 
                                                    borderRadius: '24px', transition: 'background 0.3s ease',
                                                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                                                }}>
                                                    <div style={{
                                                        position: 'absolute', top: '2px', left: formConductor.activo ? '20px' : '2px',
                                                        width: '20px', height: '20px', background: '#fff', borderRadius: '50%',
                                                        transition: 'left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', 
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                    }} />
                                                </div>
                                                <span style={{ fontSize: '14px', color: formConductor.activo ? '#166534' : '#64748b', fontWeight: '500' }}>
                                                    {formConductor.activo ? 'Activo (Disponible)' : 'Inactivo (No Disponible)'}
                                                </span>
                                                <input 
                                                    type="checkbox" 
                                                    checked={formConductor.activo}
                                                    onChange={e => setFormConductor({ ...formConductor, activo: e.target.checked })}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="ge-form-actions" style={{ marginTop: '16px' }}>
                                        {conductorEditando && (
                                            <button type="button" className="ge-btn-secondary" onClick={cancelarEdicion}>
                                                Cancelar
                                            </button>
                                        )}
                                        <button type="submit" className="ge-btn-primary" disabled={guardando} style={{
                                            background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                                            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                                            padding: '10px 24px',
                                            borderRadius: '8px',
                                            transition: 'all 0.2s ease',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            {conductorEditando ? <IcoEdit /> : <IcoPlus />}
                                            {guardando ? 'Guardando...' : conductorEditando ? 'Guardar Cambios' : 'Registrar Conductor'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {cargando ? (
                            <div className="ge-empty">Cargando conductores...</div>
                        ) : (
                            <TablaConductores
                                conductores={conductores}
                                onEditar={iniciarEdicion}
                                onEliminar={setConductorAEliminar}
                            />
                        )}
                    </div>
                </div>
            </div>

            {conductorAEliminar && (
                <ModalConfirmar
                    titulo="Borrar conductor institucional"
                    descripcion={<span>¿Estás seguro de que deseas <strong>eliminar</strong> a {conductorAEliminar?.nombre}? Esta acción lo marcará como inactivo.</span>}
                    labelConfirmar="Sí, eliminar"
                    onConfirmar={confirmarEliminar}
                    onCancelar={() => setConductorAEliminar(null)}
                />
            )}
        </>,
        document.body
    );
}
