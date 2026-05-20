import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './GestionEmpresasModal.css';
import {
    obtenerEmpresasContratadas,
    crearEmpresaContratada,
    eliminarEmpresaContratada,
    actualizarEmpresaContratada,
    obtenerConductoresPorEmpresa,
    crearConductorExterno,
    eliminarConductorExterno,
    actualizarConductorExterno,
} from '../../aplicacion/servicios';
import useAlertas from '../../../../shared/estado/useAlertas';
import ModalConfirmar from '../../../../shared/componentes/generales/ModalConfirmar/ModalConfirmar';

// ─── Íconos inline ───────────────────────────────────────────────────────────
const IcoGear = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
);
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);
const IcoCamera = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
    </svg>
);
const IcoBuilding = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
);

// ─── Componente Tabla Empresas ────────────────────────────────────────────────
const TablaEmpresas = ({ empresas, onVerConductores, onEditar, onEliminar }) => (
    <div className="ge-table-wrap">
        <table className="ge-table">
            <thead>
                <tr>
                    <th>Razón Social</th>
                    <th>NIT</th>
                    <th>Teléfono</th>
                    <th>Contacto</th>
                    <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {empresas.length === 0 ? (
                    <tr><td colSpan={5} className="ge-empty">No hay empresas registradas aún.</td></tr>
                ) : empresas.map(e => (
                    <tr key={e.id}>
                        <td style={{ fontWeight: '600', color: '#0f172a' }}>{e.razon_social}</td>
                        <td style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '13px' }}>{e.nit}</td>
                        <td>{e.telefono || '—'}</td>
                        <td>{e.contacto || '—'}</td>
                        <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button className="ge-badge ge-badge--select" onClick={() => onVerConductores(e)}>
                                    <IcoDriver /> Conductores
                                </button>
                                <button className="ge-btn-edit" onClick={() => onEditar(e)}>
                                    <IcoEdit /> Editar
                                </button>
                                <button className="ge-btn-danger" onClick={() => onEliminar(e)}>Eliminar</button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// ─── Componente Tabla Conductores ─────────────────────────────────────────────
const TablaConductores = ({ conductores, onEditar, onEliminar }) => (
    <div className="ge-table-wrap">
        <table className="ge-table">
            <thead>
                <tr>
                    <th style={{ width: '50px', textAlign: 'center' }}>Foto</th>
                    <th>Nombre</th>
                    <th>Cédula</th>
                    <th>Teléfono</th>
                    <th>Licencia</th>
                    <th>Estado</th>
                    <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {conductores.length === 0 ? (
                    <tr><td colSpan={5} className="ge-empty">Esta empresa no tiene conductores registrados.</td></tr>
                ) : conductores.map(c => (
                    <tr key={c.id}>
                        <td style={{ textAlign: 'center', width: '50px' }}>
                            {c.foto ? (
                                <img src={c.foto} alt="Foto" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '12px' }}>
                                    <IcoDriver />
                                </div>
                            )}
                        </td>
                        <td style={{ fontWeight: '600', color: '#0f172a' }}>{c.nombre}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{c.cedula}</td>
                        <td>{c.telefono || '—'}</td>
                        <td>{c.licencia || '—'}</td>
                        <td>
                            <span className={`ge-badge ge-badge--${c.activo ? 'select' : 'danger'}`}>
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

// ─── Modal Principal ──────────────────────────────────────────────────────────
const FORM_EMPRESA_VACIO = { nit: '', razon_social: '', telefono: '', correo: '', contacto: '' };
const FORM_CONDUCTOR_VACIO = { nombres: '', apellidos: '', cedula: '', email: '', telefono: '', licencia: '', activo: true };

export default function GestionEmpresasModal({ onCerrar }) {
    const { agregarAlerta } = useAlertas();
    const [tab, setTab] = useState('empresas');

    // Empresas
    const [empresas, setEmpresas] = useState([]);
    const [cargandoEmpresas, setCargandoEmpresas] = useState(true);
    const [guardandoEmpresa, setGuardandoEmpresa] = useState(false);
    const [empresaAEliminar, setEmpresaAEliminar] = useState(null);
    const [empresaEditando, setEmpresaEditando] = useState(null); // null = modo crear
    const [formEmpresa, setFormEmpresa] = useState(FORM_EMPRESA_VACIO);

    // Conductores
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
    const [conductores, setConductores] = useState([]);
    const [cargandoConductores, setCargandoConductores] = useState(false);
    const [guardandoConductor, setGuardandoConductor] = useState(false);
    const [conductorAEliminar, setConductorAEliminar] = useState(null);
    const [conductorEditando, setConductorEditando] = useState(null); // null = modo crear
    const [formConductor, setFormConductor] = useState(FORM_CONDUCTOR_VACIO);
    const [fotoArchivo, setFotoArchivo] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    const fileInputRef = useRef(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    useEffect(() => { cargarEmpresas(); }, []);

    const cargarEmpresas = async () => {
        setCargandoEmpresas(true);
        try {
            const data = await obtenerEmpresasContratadas();
            setEmpresas(data);
        } catch {
            agregarAlerta('Error al cargar empresas.', 'error');
        } finally {
            setCargandoEmpresas(false);
        }
    };

    // ── Crear / Actualizar empresa ────────────────────────────────────────────
    const handleSubmitEmpresa = async (e) => {
        e.preventDefault();
        if (!formEmpresa.nit || !formEmpresa.razon_social) return;
        setGuardandoEmpresa(true);
        try {
            if (empresaEditando) {
                await actualizarEmpresaContratada(empresaEditando.id, formEmpresa);
                agregarAlerta(`Empresa "${formEmpresa.razon_social}" actualizada.`, 'exito');
                setEmpresaEditando(null);
            } else {
                await crearEmpresaContratada(formEmpresa);
                agregarAlerta(`Empresa "${formEmpresa.razon_social}" registrada.`, 'exito');
            }
            setFormEmpresa(FORM_EMPRESA_VACIO);
            await cargarEmpresas();
        } catch {
            agregarAlerta('Error al guardar la empresa.', 'error');
        } finally {
            setGuardandoEmpresa(false);
        }
    };

    const iniciarEditarEmpresa = (empresa) => {
        setEmpresaEditando(empresa);
        setFormEmpresa({
            nit: empresa.nit || '',
            razon_social: empresa.razon_social || '',
            telefono: empresa.telefono || '',
            correo: empresa.correo || '',
            contacto: empresa.contacto || '',
        });
        // Scroll suave al formulario
        setTimeout(() => document.getElementById('form-empresa')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    };

    const cancelarEditarEmpresa = () => {
        setEmpresaEditando(null);
        setFormEmpresa(FORM_EMPRESA_VACIO);
    };

    // ── Eliminar empresa ──────────────────────────────────────────────────────
    const confirmarEliminarEmpresa = async () => {
        try {
            await eliminarEmpresaContratada(empresaAEliminar.id);
            agregarAlerta(`Empresa "${empresaAEliminar.razon_social}" eliminada.`, 'info');
            setEmpresaAEliminar(null);
            if (empresaSeleccionada?.id === empresaAEliminar.id) {
                setEmpresaSeleccionada(null);
                setConductores([]);
            }
            await cargarEmpresas();
        } catch {
            agregarAlerta('Error al eliminar la empresa.', 'error');
            setEmpresaAEliminar(null);
        }
    };

    // ── Ver conductores de una empresa ────────────────────────────────────────
    const verConductores = async (empresa) => {
        setEmpresaSeleccionada(empresa);
        setTab('conductores');
        setCargandoConductores(true);
        setConductorEditando(null);
        setFormConductor(FORM_CONDUCTOR_VACIO);
        try {
            const data = await obtenerConductoresPorEmpresa(empresa.id);
            setConductores(data);
        } catch {
            agregarAlerta('Error al cargar conductores.', 'error');
        } finally {
            setCargandoConductores(false);
        }
    };

    // ── Crear / Actualizar conductor ──────────────────────────────────────────
    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFotoArchivo(file);
            setFotoPreview(URL.createObjectURL(file));
        }
    };
    const triggerFileInput = () => fileInputRef.current?.click();

    const handleSubmitConductor = async (e) => {
        e.preventDefault();
        if (!formConductor.nombres || !formConductor.apellidos || !formConductor.cedula || !empresaSeleccionada) return;
        setGuardandoConductor(true);
        try {
            const formData = new FormData();
            formData.append('empresa_id', empresaSeleccionada.id);
            formData.append('nombre', `${formConductor.nombres.trim()} ${formConductor.apellidos.trim()}`);
            formData.append('cedula', formConductor.cedula);
            if(formConductor.email) formData.append('email', formConductor.email);
            if(formConductor.telefono) formData.append('telefono', formConductor.telefono);
            if(formConductor.licencia) formData.append('licencia', formConductor.licencia);
            formData.append('activo', formConductor.activo ? 'true' : 'false');
            if(fotoArchivo) formData.append('foto', fotoArchivo);

            if (conductorEditando) {
                await actualizarConductorExterno(conductorEditando.id, formData);
                agregarAlerta(`Conductor "${formConductor.nombres}" actualizado.`, 'exito');
            } else {
                await crearConductorExterno(formData);
                agregarAlerta(`Conductor "${formConductor.nombres}" registrado.`, 'exito');
            }
            cancelarEditarConductor();
            const data = await obtenerConductoresPorEmpresa(empresaSeleccionada.id);
            setConductores(data);
        } catch {
            agregarAlerta('Error al guardar el conductor.', 'error');
        } finally {
            setGuardandoConductor(false);
        }
    };

    const iniciarEditarConductor = (conductor) => {
        setConductorEditando(conductor);
        const parts = (conductor.nombre || '').trim().split(' ');
        let half = Math.ceil(parts.length / 2);
        if (parts.length === 3) half = 1;
        const n = parts.slice(0, half).join(' ');
        const a = parts.slice(half).join(' ');

        setFormConductor({
            nombres: n || '',
            apellidos: a || '',
            cedula: conductor.cedula || '',
            email: conductor.email || '',
            telefono: conductor.telefono || '',
            licencia: conductor.licencia || '',
            activo: conductor.activo !== undefined ? conductor.activo : true,
        });
        setFotoArchivo(null);
        setFotoPreview(conductor.foto ? conductor.foto.replace('http://127.0.0.1:8000', API_URL) : null);
        setTimeout(() => document.getElementById('form-conductor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    };

    const cancelarEditarConductor = () => {
        setConductorEditando(null);
        setFormConductor(FORM_CONDUCTOR_VACIO);
        setFotoArchivo(null);
        setFotoPreview(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    // ── Eliminar conductor ────────────────────────────────────────────────────
    const confirmarEliminarConductor = async () => {
        try {
            await eliminarConductorExterno(conductorAEliminar.id);
            agregarAlerta(`Conductor "${conductorAEliminar.nombre}" eliminado.`, 'info');
            setConductorAEliminar(null);
            const data = await obtenerConductoresPorEmpresa(empresaSeleccionada.id);
            setConductores(data);
        } catch {
            agregarAlerta('Error al eliminar el conductor.', 'error');
            setConductorAEliminar(null);
        }
    };

    return createPortal(
        <>
            <div className="ge-overlay" onClick={onCerrar} style={{ zIndex: 10000 }}>
                <div className="ge-modal" onClick={e => e.stopPropagation()}>

                    {/* ── Header ── */}
                    <div className="ge-header">
                        <div className="ge-header__left">
                            <div className="ge-header__icon"><IcoGear /></div>
                            <div>
                                <h2>Gestión de Transporte Contratado</h2>
                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                                    Administra las empresas y sus conductores externos
                                </p>
                            </div>
                        </div>
                        <button className="ge-header__close" onClick={onCerrar}><IcoClose /></button>
                    </div>

                    {/* ── Tabs ── */}
                    <div className="ge-tabs">
                        <button
                            className={`ge-tab ${tab === 'empresas' ? 'ge-tab--active' : ''}`}
                            onClick={() => setTab('empresas')}
                        >
                            <IcoBuilding /> Empresas ({empresas.length})
                        </button>
                        <button
                            className={`ge-tab ${tab === 'conductores' ? 'ge-tab--active' : ''}`}
                            onClick={() => tab !== 'conductores' || empresaSeleccionada ? setTab('conductores') : null}
                            disabled={!empresaSeleccionada}
                            style={{ opacity: empresaSeleccionada ? 1 : 0.45 }}
                        >
                            <IcoDriver /> Conductores
                            {empresaSeleccionada && <span style={{ fontSize: '11px', color: '#7c3aed', marginLeft: '6px' }}>— {empresaSeleccionada.razon_social}</span>}
                        </button>
                    </div>

                    {/* ── Body ── */}
                    <div className="ge-body">

                        {/* === TAB EMPRESAS === */}
                        {tab === 'empresas' && (
                            <>
                                {/* Formulario Empresa */}
                                <div className="ge-form-card" id="form-empresa">
                                    <h4>
                                        {empresaEditando
                                            ? <><IcoEdit /> Editando: {empresaEditando.razon_social}</>
                                            : <><IcoPlus /> Registrar Nueva Empresa</>
                                        }
                                    </h4>
                                    <form onSubmit={handleSubmitEmpresa}>
                                        <div className="ge-grid">
                                            <div className="ge-field">
                                                <label>NIT <span style={{ color: 'red' }}>*</span></label>
                                                <input type="text" placeholder="Ej: 900123456-1"
                                                    value={formEmpresa.nit}
                                                    onChange={e => setFormEmpresa({ ...formEmpresa, nit: e.target.value })}
                                                    required />
                                            </div>
                                            <div className="ge-field">
                                                <label>Razón Social <span style={{ color: 'red' }}>*</span></label>
                                                <input type="text" placeholder="Ej: Transportes y Turismo SAS"
                                                    value={formEmpresa.razon_social}
                                                    onChange={e => setFormEmpresa({ ...formEmpresa, razon_social: e.target.value })}
                                                    required />
                                            </div>
                                            <div className="ge-field">
                                                <label>Teléfono</label>
                                                <input type="tel" placeholder="Ej: 601 234 5678"
                                                    value={formEmpresa.telefono}
                                                    onChange={e => setFormEmpresa({ ...formEmpresa, telefono: e.target.value })} />
                                            </div>
                                            <div className="ge-field">
                                                <label>Correo</label>
                                                <input type="email" placeholder="contacto@empresa.com"
                                                    value={formEmpresa.correo}
                                                    onChange={e => setFormEmpresa({ ...formEmpresa, correo: e.target.value })} />
                                            </div>
                                            <div className="ge-field ge-grid--full">
                                                <label>Persona de Contacto</label>
                                                <input type="text" placeholder="Nombre del representante o encargado"
                                                    value={formEmpresa.contacto}
                                                    onChange={e => setFormEmpresa({ ...formEmpresa, contacto: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="ge-form-actions">
                                            {empresaEditando && (
                                                <button type="button" className="ge-btn-secondary" onClick={cancelarEditarEmpresa}>
                                                    Cancelar
                                                </button>
                                            )}
                                            <button type="submit" className="ge-btn-primary" disabled={guardandoEmpresa}>
                                                {empresaEditando ? <IcoEdit /> : <IcoPlus />}
                                                {guardandoEmpresa
                                                    ? 'Guardando...'
                                                    : empresaEditando ? 'Guardar Cambios' : 'Registrar Empresa'
                                                }
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Tabla de Empresas */}
                                {cargandoEmpresas ? (
                                    <div className="ge-empty">Cargando empresas...</div>
                                ) : (
                                    <TablaEmpresas
                                        empresas={empresas}
                                        onVerConductores={verConductores}
                                        onEditar={iniciarEditarEmpresa}
                                        onEliminar={setEmpresaAEliminar}
                                    />
                                )}
                            </>
                        )}

                        {/* === TAB CONDUCTORES === */}
                        {tab === 'conductores' && empresaSeleccionada && (
                            <>
                                {/* Breadcrumb */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                                    <button
                                        onClick={() => setTab('empresas')}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', fontWeight: '600', padding: 0, fontSize: '13px', fontFamily: 'inherit' }}
                                    >
                                        ← Empresas
                                    </button>
                                    <span>/</span>
                                    <span style={{ color: '#0f172a', fontWeight: '600' }}>{empresaSeleccionada.razon_social}</span>
                                </div>

                                {/* Formulario Conductor */}
                                <div className="ge-form-card" id="form-conductor">
                                    <h4>
                                        {conductorEditando
                                            ? <><IcoEdit /> Editando: {conductorEditando.nombre}</>
                                            : <><IcoPlus /> Registrar Conductor</>
                                        }
                                    </h4>
                                    <form onSubmit={handleSubmitConductor} style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                                        
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
                                                    <label>Correo Electrónico</label>
                                                    <input type="email" placeholder="usuario@empresa.com"
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
                                                    <input type="text" placeholder="Ej: C2E-123456"
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
                                                    <button type="button" className="ge-btn-secondary" onClick={cancelarEditarConductor}>
                                                        Cancelar
                                                    </button>
                                                )}
                                                <button type="submit" className="ge-btn-primary" disabled={guardandoConductor} style={{
                                                    background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                                                    padding: '10px 24px',
                                                    borderRadius: '8px',
                                                    transition: 'all 0.2s ease',
                                                    border: '1px solid rgba(255,255,255,0.1)'
                                                }}>
                                                    {conductorEditando ? <IcoEdit /> : <IcoPlus />}
                                                    {guardandoConductor
                                                        ? 'Guardando...'
                                                        : conductorEditando ? 'Guardar Cambios' : 'Registrar Conductor'
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                {/* Tabla de Conductores */}
                                {cargandoConductores ? (
                                    <div className="ge-empty">Cargando conductores...</div>
                                ) : (
                                    <TablaConductores
                                        conductores={conductores}
                                        onEditar={iniciarEditarConductor}
                                        onEliminar={setConductorAEliminar}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Modales de confirmación */}
            {empresaAEliminar && createPortal(
                <ModalConfirmar
                    titulo="Eliminar Empresa"
                    descripcion={<span>¿Confirmas eliminar <strong>{empresaAEliminar.razon_social}</strong>? Sus conductores también quedarán desactivados.</span>}
                    labelConfirmar="Sí, eliminar"
                    onConfirmar={confirmarEliminarEmpresa}
                    onCancelar={() => setEmpresaAEliminar(null)}
                />,
                document.body
            )}
            {conductorAEliminar && createPortal(
                <ModalConfirmar
                    titulo="Eliminar Conductor"
                    descripcion={<span>¿Confirmas eliminar a <strong>{conductorAEliminar.nombre}</strong>?</span>}
                    labelConfirmar="Sí, eliminar"
                    onConfirmar={confirmarEliminarConductor}
                    onCancelar={() => setConductorAEliminar(null)}
                />,
                document.body
            )}
        </>,
        document.body
    );
}
