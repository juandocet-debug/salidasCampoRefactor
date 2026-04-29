import React, { useState, useEffect } from 'react';
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
                    <th>Nombre</th>
                    <th>Cédula</th>
                    <th>Teléfono</th>
                    <th>Licencia</th>
                    <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {conductores.length === 0 ? (
                    <tr><td colSpan={5} className="ge-empty">Esta empresa no tiene conductores registrados.</td></tr>
                ) : conductores.map(c => (
                    <tr key={c.id}>
                        <td style={{ fontWeight: '600', color: '#0f172a' }}>{c.nombre}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{c.cedula}</td>
                        <td>{c.telefono || '—'}</td>
                        <td>{c.licencia || '—'}</td>
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
const FORM_CONDUCTOR_VACIO = { nombre: '', cedula: '', telefono: '', licencia: '' };

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
    const handleSubmitConductor = async (e) => {
        e.preventDefault();
        if (!formConductor.nombre || !formConductor.cedula || !empresaSeleccionada) return;
        setGuardandoConductor(true);
        try {
            if (conductorEditando) {
                await actualizarConductorExterno(conductorEditando.id, formConductor);
                agregarAlerta(`Conductor "${formConductor.nombre}" actualizado.`, 'exito');
                setConductorEditando(null);
            } else {
                await crearConductorExterno({ ...formConductor, empresa_id: empresaSeleccionada.id });
                agregarAlerta(`Conductor "${formConductor.nombre}" registrado.`, 'exito');
            }
            setFormConductor(FORM_CONDUCTOR_VACIO);
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
        setFormConductor({
            nombre: conductor.nombre || '',
            cedula: conductor.cedula || '',
            telefono: conductor.telefono || '',
            licencia: conductor.licencia || '',
        });
        setTimeout(() => document.getElementById('form-conductor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    };

    const cancelarEditarConductor = () => {
        setConductorEditando(null);
        setFormConductor(FORM_CONDUCTOR_VACIO);
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

    return (
        <>
            <div className="ge-overlay" onClick={onCerrar}>
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
                                    <form onSubmit={handleSubmitConductor}>
                                        <div className="ge-grid">
                                            <div className="ge-field">
                                                <label>Nombre Completo <span style={{ color: 'red' }}>*</span></label>
                                                <input type="text" placeholder="Ej: Carlos Rodríguez"
                                                    value={formConductor.nombre}
                                                    onChange={e => setFormConductor({ ...formConductor, nombre: e.target.value })}
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
                                                <label>Teléfono</label>
                                                <input type="tel" placeholder="Ej: 311 234 5678"
                                                    value={formConductor.telefono}
                                                    onChange={e => setFormConductor({ ...formConductor, telefono: e.target.value })} />
                                            </div>
                                            <div className="ge-field">
                                                <label>No. Licencia de Conducción</label>
                                                <input type="text" placeholder="Ej: C2E-123456"
                                                    value={formConductor.licencia}
                                                    onChange={e => setFormConductor({ ...formConductor, licencia: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="ge-form-actions">
                                            {conductorEditando && (
                                                <button type="button" className="ge-btn-secondary" onClick={cancelarEditarConductor}>
                                                    Cancelar
                                                </button>
                                            )}
                                            <button type="submit" className="ge-btn-primary" disabled={guardandoConductor}>
                                                {conductorEditando ? <IcoEdit /> : <IcoPlus />}
                                                {guardandoConductor
                                                    ? 'Guardando...'
                                                    : conductorEditando ? 'Guardar Cambios' : 'Registrar Conductor'
                                                }
                                            </button>
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
            {empresaAEliminar && (
                <ModalConfirmar
                    titulo="Eliminar Empresa"
                    descripcion={<span>¿Confirmas eliminar <strong>{empresaAEliminar.razon_social}</strong>? Sus conductores también quedarán desactivados.</span>}
                    labelConfirmar="Sí, eliminar"
                    onConfirmar={confirmarEliminarEmpresa}
                    onCancelar={() => setEmpresaAEliminar(null)}
                />
            )}
            {conductorAEliminar && (
                <ModalConfirmar
                    titulo="Eliminar Conductor"
                    descripcion={<span>¿Confirmas eliminar a <strong>{conductorAEliminar.nombre}</strong>?</span>}
                    labelConfirmar="Sí, eliminar"
                    onConfirmar={confirmarEliminarConductor}
                    onCancelar={() => setConductorAEliminar(null)}
                />
            )}
        </>
    );
}
