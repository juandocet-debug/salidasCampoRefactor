// modulos/admin/componentes/TabAcademico.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Tab de catálogos académicos: CRUD de Facultades y Programas.
// Sub-componentes: ModalConfirmar, TablaFacultades, TablaProgramas.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from 'react';
import { API_URL } from '@/shared/api/config';
import useAlertas from '@/shared/estado/useAlertas';
import ModalConfirmar from '@/shared/componentes/generales/ModalConfirmar/ModalConfirmar';

import * as AcademicoAPI from '@/features/admin_sistema/api/academico.service';

// ── Iconos inline (SVG) ───────────────────────────────────────────────────────
const IcoEditar  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcoBorrar  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const IcoOjoOn   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcoOjoOff  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

// ── ModalConfirmar: ahora usa el componente compartido de nucleo ─────────────

// ── Sub-componente: Tabla de Facultades ───────────────────────────────────────
function TablaFacultades({ facultades, onActualizar, onBorrar }) {
    const [editId,     setEditId]     = useState(null);
    const [editNombre, setEditNombre] = useState('');

    return (
        <div className="herr-tabla-wrapper">
            <table className="herr-tabla">
                <thead><tr><th>Nombre</th><th>Programas</th><th>Estado</th><th style={{ width: '130px' }}>Acciones</th></tr></thead>
                <tbody>
                    {facultades.length === 0 && <tr><td colSpan={4} className="herr-vacio">No hay facultades registradas</td></tr>}
                    {facultades.map(f => (
                        <tr key={f.id} style={{ opacity: f.activa ? 1 : 0.6 }}>
                            <td>
                                {editId === f.id
                                    ? <input autoFocus value={editNombre} onChange={e => setEditNombre(e.target.value)} style={{ padding: '0.2rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }} />
                                    : <strong>{f.nombre}</strong>}
                            </td>
                            <td>{f.cantidad_programas ?? 0}</td>
                            <td><span className={`herr-badge ${f.activa ? 'herr-badge--activo' : 'herr-badge--inactivo'}`}>{f.activa ? 'Activa' : 'Inactiva'}</span></td>
                            <td className="herr-acciones">
                                {editId === f.id ? (
                                    <button className="herr-btn herr-btn--primario herr-btn--sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                        onClick={() => { onActualizar(f.id, { nombre: editNombre }); setEditId(null); }}>Guardar</button>
                                ) : (
                                    <button className="herr-action-circle herr-action-circle--edit" title="Editar"
                                        onClick={() => { setEditId(f.id); setEditNombre(f.nombre); }}><IcoEditar /></button>
                                )}
                                <button className={`herr-action-circle herr-action-circle--eye ${f.activa ? '' : 'herr-action-circle--eye-off'}`}
                                    title={f.activa ? 'Desactivar' : 'Activar'}
                                    onClick={() => onActualizar(f.id, { activa: !f.activa })}>
                                    {f.activa ? <IcoOjoOn /> : <IcoOjoOff />}
                                </button>
                                <button className="herr-action-circle herr-action-circle--delete" title="Eliminar"
                                    onClick={() => onBorrar({ tipo: 'facultad', id: f.id, nombre: f.nombre })}><IcoBorrar /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── Sub-componente: Tabla de Programas ────────────────────────────────────────
function TablaProgramas({ programas, facultades, onActualizar, onBorrar }) {
    const [editId,      setEditId]      = useState(null);
    const [editNombre,  setEditNombre]  = useState('');
    const [editFacultad, setEditFacultad] = useState('');

    return (
        <div className="herr-tabla-wrapper">
            <table className="herr-tabla">
                <thead><tr><th>Nombre</th><th>Facultad</th><th>Estado</th><th style={{ width: '130px' }}>Acciones</th></tr></thead>
                <tbody>
                    {programas.length === 0 && <tr><td colSpan={4} className="herr-vacio">No hay programas registrados</td></tr>}
                    {programas.map(p => (
                        <tr key={p.id} style={{ opacity: p.activo ? 1 : 0.6 }}>
                            <td>
                                {editId === p.id
                                    ? <input autoFocus value={editNombre} onChange={e => setEditNombre(e.target.value)} style={{ padding: '0.2rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }} />
                                    : <strong>{p.nombre}</strong>}
                            </td>
                            <td>
                                {editId === p.id ? (
                                    <select value={editFacultad} onChange={e => setEditFacultad(e.target.value)} style={{ padding: '0.2rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}>
                                        <option value="">Seleccionar…</option>
                                        {facultades.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                                    </select>
                                ) : p.facultad_nombre}
                            </td>
                            <td><span className={`herr-badge ${p.activo ? 'herr-badge--activo' : 'herr-badge--inactivo'}`}>{p.activo ? 'Activo' : 'Inactivo'}</span></td>
                            <td className="herr-acciones">
                                {editId === p.id ? (
                                    <button className="herr-btn herr-btn--primario herr-btn--sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                        onClick={() => { onActualizar(p.id, { nombre: editNombre, facultad: editFacultad }); setEditId(null); }}>Guardar</button>
                                ) : (
                                    <button className="herr-action-circle herr-action-circle--edit" title="Editar"
                                        onClick={() => { setEditId(p.id); setEditNombre(p.nombre); setEditFacultad(p.facultad); }}><IcoEditar /></button>
                                )}
                                <button className={`herr-action-circle herr-action-circle--eye ${p.activo ? '' : 'herr-action-circle--eye-off'}`}
                                    title={p.activo ? 'Desactivar' : 'Activar'}
                                    onClick={() => onActualizar(p.id, { activo: !p.activo })}>
                                    {p.activo ? <IcoOjoOn /> : <IcoOjoOff />}
                                </button>
                                <button className="herr-action-circle herr-action-circle--delete" title="Eliminar"
                                    onClick={() => onBorrar({ tipo: 'programa', id: p.id, nombre: p.nombre })}><IcoBorrar /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function TabAcademico({ token, onToast }) {
    const [facultades, setFacultades] = useState([]);
    const [programas,  setProgramas]  = useState([]);
    const [nuevaFac,   setNuevaFac]   = useState({ nombre: '' });
    const [nuevoProg,  setNuevoProg]  = useState({ nombre: '', facultad: '' });
    const [modalBorrar, setModalBorrar] = useState(null);
    const [borrando,    setBorrando]    = useState(false);

    const { agregarAlerta } = useAlertas();
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    const cargar = useCallback(async () => {
        try {
            const respuesta = await AcademicoAPI.obtenerCatalogosAcademicos();
            if (respuesta.ok && respuesta.datos) {
                setFacultades(respuesta.datos.facultades || []);
                setProgramas(respuesta.datos.programas || []);
            }
        } catch (error) {
            agregarAlerta('Error cargando catálogos académicos', 'error');
        }
    }, [agregarAlerta]);

    useEffect(() => { cargar(); }, [cargar]);

    const crearFacultad = async () => {
        if (!nuevaFac.nombre) return;
        try {
            await AcademicoAPI.crearFacultad(nuevaFac);
            setNuevaFac({ nombre: '' });
            agregarAlerta('Facultad creada correctamente', 'exito');
            cargar();
        } catch (error) {
            agregarAlerta('Error creando facultad (Revisar backend)', 'error');
        }
    };

    const crearPrograma = async () => {
        if (!nuevoProg.nombre || !nuevoProg.facultad) return;
        try {
            await AcademicoAPI.crearPrograma(nuevoProg);
            setNuevoProg({ nombre: '', facultad: '' });
            agregarAlerta('Programa creado correctamente', 'exito');
            cargar();
        } catch (error) {
            agregarAlerta('Error creando programa (Revisar backend)', 'error');
        }
    };

    const actualizarFacultad = async (id, datos) => {
        try {
            await AcademicoAPI.actualizarFacultad(id, datos);
            agregarAlerta('Facultad actualizada', 'exito');
            cargar();
        } catch (error) {
            agregarAlerta('Error actualizando facultad (Revisar backend)', 'error');
        }
    };

    const actualizarPrograma = async (id, datos) => {
        try {
            await AcademicoAPI.actualizarPrograma(id, datos);
            agregarAlerta('Programa actualizado', 'exito');
            cargar();
        } catch (error) {
            agregarAlerta('Error actualizando programa (Revisar backend)', 'error');
        }
    };

    const confirmarBorrado = async () => {
        if (!modalBorrar) return;
        setBorrando(true);
        try {
            if (modalBorrar.tipo === 'facultad') {
                await AcademicoAPI.eliminarFacultad(modalBorrar.id);
            } else {
                await AcademicoAPI.eliminarPrograma(modalBorrar.id);
            }
            agregarAlerta(`${modalBorrar.tipo === 'facultad' ? 'Facultad' : 'Programa'} eliminado correctamente`, 'exito');
        } catch (error) {
            agregarAlerta('Error eliminando (Revisar backend)', 'error');
        } finally {
            setBorrando(false);
            setModalBorrar(null);
            cargar();
        }
    };

    return (
        <>
            {modalBorrar && (
                <ModalConfirmar
                    titulo={`¿Eliminar ${modalBorrar.tipo === 'facultad' ? 'facultad' : 'programa'}?`}
                    descripcion={<>Se eliminará permanentemente <strong>"{modalBorrar.nombre}"</strong>.{modalBorrar.tipo === 'facultad' && ' Esto también eliminará todos los programas asociados.'} Esta acción no se puede deshacer.</>}
                    cargando={borrando}
                    onCancelar={() => setModalBorrar(null)}
                    onConfirmar={confirmarBorrado}
                />
            )}

            {/* ── Facultades ─────────────────────────────────────────── */}
            <div className="herr-card">
                <div className="herr-card-header--premium">
                    <div className="herr-premium-icon" style={{ background: '#fdf4ff', color: '#c026d3' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 21h18"/><path d="M4 21v-4"/><path d="M20 21v-4"/><path d="M8 21v-4"/><path d="M12 21v-4"/><path d="M16 21v-4"/>
                            <path d="M3 14h18"/><path d="M4 14V9l8-5 8 5v5"/>
                        </svg>
                    </div>
                    <div className="herr-premium-title-group">
                        <h3>Facultades</h3>
                        <p>{facultades.length} facultades registradas</p>
                    </div>
                </div>
                <div className="herr-form-inline">
                    <div className="herr-campo" style={{ flex: 1 }}>
                        <label>Nombre de la Facultad</label>
                        <input value={nuevaFac.nombre} onChange={e => setNuevaFac({ ...nuevaFac, nombre: e.target.value })} placeholder="Ej: Ciencias y Tecnología" />
                    </div>
                    <button className="herr-btn herr-btn--dark herr-btn--sm" onClick={crearFacultad}>+ Agregar</button>
                </div>
                <TablaFacultades facultades={facultades} onActualizar={actualizarFacultad} onBorrar={setModalBorrar} />
            </div>

            {/* ── Programas ──────────────────────────────────────────── */}
            <div className="herr-card">
                <div className="herr-card-header--premium">
                    <div className="herr-premium-icon" style={{ background: '#f0f9ff', color: '#0ea5e9' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                        </svg>
                    </div>
                    <div className="herr-premium-title-group">
                        <h3>Programas Académicos</h3>
                        <p>{programas.length} programas registrados</p>
                    </div>
                </div>
                <div className="herr-form-inline">
                    <div className="herr-campo" style={{ width: '250px' }}>
                        <label>Facultad</label>
                        <select value={nuevoProg.facultad} onChange={e => setNuevoProg({ ...nuevoProg, facultad: e.target.value })}>
                            <option value="">Seleccionar…</option>
                            {facultades.filter(f => f.activa).map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                        </select>
                    </div>
                    <div className="herr-campo" style={{ flex: 1 }}>
                        <label>Nombre del Programa</label>
                        <input value={nuevoProg.nombre} onChange={e => setNuevoProg({ ...nuevoProg, nombre: e.target.value })} placeholder="Ej: Licenciatura en Biología" />
                    </div>
                    <button className="herr-btn herr-btn--dark herr-btn--sm" onClick={crearPrograma}>+ Agregar</button>
                </div>
                <TablaProgramas programas={programas} facultades={facultades} onActualizar={actualizarPrograma} onBorrar={setModalBorrar} />
            </div>
        </>
    );
}
