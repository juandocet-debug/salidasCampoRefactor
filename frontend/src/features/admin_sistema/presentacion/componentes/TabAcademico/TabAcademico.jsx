// modulos/admin/componentes/TabAcademico.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Tab de catálogos académicos: CRUD de Facultades, Programas y Materias.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from 'react';
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
    const [pagina,     setPagina]     = useState(1);
    const [busqueda,   setBusqueda]   = useState('');
    const limite = 6;

    const filtrados = facultades.filter(f => !busqueda.trim() || f.nombre.toLowerCase().includes(busqueda.toLowerCase().trim()));

    const totalPaginas = Math.ceil(filtrados.length / limite) || 1;
    const paginaSegura = pagina > totalPaginas ? totalPaginas : pagina;
    const itemsPag = filtrados.slice((paginaSegura - 1) * limite, paginaSegura * limite);

    return (
        <div className="herr-tabla-wrapper">
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.65rem 1.25rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ position: 'relative', width: '260px' }}>
                    <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input style={{ padding: '0.4rem 0.8rem 0.4rem 1.95rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', width: '100%', outline: 'none', background: '#fff' }} placeholder="Buscar facultad..." value={busqueda} onChange={e => { setBusqueda(e.target.value); setPagina(1); }} />
                </div>
            </div>
            <table className="herr-tabla">
                <thead><tr><th>Nombre</th><th>Programas</th><th>Estado</th><th style={{ width: '130px' }}>Acciones</th></tr></thead>
                <tbody>
                    {itemsPag.length === 0 && <tr><td colSpan={4} className="herr-vacio">No hay facultades encontradas</td></tr>}
                    {itemsPag.map(f => (
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
            {totalPaginas > 1 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', padding: '12px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Página {paginaSegura} de {totalPaginas}</span>
                    <button className="herr-btn herr-btn--sm" disabled={paginaSegura === 1} onClick={() => setPagina(p => p - 1)}>Anterior</button>
                    <button className="herr-btn herr-btn--sm" disabled={paginaSegura === totalPaginas} onClick={() => setPagina(p => p + 1)}>Siguiente</button>
                </div>
            )}
        </div>
    );
}

// ── Sub-componente: Tabla de Programas ────────────────────────────────────────
function TablaProgramas({ programas, facultades, onActualizar, onBorrar }) {
    const [editId,      setEditId]      = useState(null);
    const [editNombre,  setEditNombre]  = useState('');
    const [editFacultad, setEditFacultad] = useState('');
    const [pagina,      setPagina]      = useState(1);
    const [busqueda,    setBusqueda]    = useState('');
    const limite = 6;

    const filtrados = programas.filter(p => !busqueda.trim() || p.nombre.toLowerCase().includes(busqueda.toLowerCase().trim()) || (p.facultad_nombre || '').toLowerCase().includes(busqueda.toLowerCase().trim()));

    const totalPaginas = Math.ceil(filtrados.length / limite) || 1;
    const paginaSegura = pagina > totalPaginas ? totalPaginas : pagina;
    const itemsPag = filtrados.slice((paginaSegura - 1) * limite, paginaSegura * limite);

    return (
        <div className="herr-tabla-wrapper">
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.65rem 1.25rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ position: 'relative', width: '260px' }}>
                    <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input style={{ padding: '0.4rem 0.8rem 0.4rem 1.95rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', width: '100%', outline: 'none', background: '#fff' }} placeholder="Buscar programa..." value={busqueda} onChange={e => { setBusqueda(e.target.value); setPagina(1); }} />
                </div>
            </div>
            <table className="herr-tabla">
                <thead><tr><th>Nombre</th><th>Facultad</th><th>Estado</th><th style={{ width: '130px' }}>Acciones</th></tr></thead>
                <tbody>
                    {itemsPag.length === 0 && <tr><td colSpan={4} className="herr-vacio">No hay programas encontrados</td></tr>}
                    {itemsPag.map(p => (
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
            {totalPaginas > 1 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', padding: '12px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Página {paginaSegura} de {totalPaginas}</span>
                    <button className="herr-btn herr-btn--sm" disabled={paginaSegura === 1} onClick={() => setPagina(p => p - 1)}>Anterior</button>
                    <button className="herr-btn herr-btn--sm" disabled={paginaSegura === totalPaginas} onClick={() => setPagina(p => p + 1)}>Siguiente</button>
                </div>
            )}
        </div>
    );
}

// ── Sub-componente: Tabla General (Tablero) ──────────────────────────────────
function TablaTablero({ materias, programas, facultades }) {
    const [pagina, setPagina] = useState(1);
    const [filtroFacultad, setFiltroFacultad] = useState('');
    const [filtroPrograma, setFiltroPrograma] = useState('');
    const [busqueda, setBusqueda] = useState('');
    
    const limite = 6;

    const getProgName = (id) => programas.find(p => p.id === id)?.nombre || '—';
    const getFacName = (id) => {
        const p = programas.find(x => x.id === id);
        return p ? (p.facultad_nombre || '—') : '—';
    };

    // Lógica de filtrado en memoria
    const materiasFiltradas = materias.filter(m => {
        const p = programas.find(prog => prog.id === m.programa_id);
        const facId = p ? String(p.facultad_id) : '';
        const progId = String(m.programa_id);

        if (filtroFacultad && facId !== String(filtroFacultad)) return false;
        if (filtroPrograma && progId !== String(filtroPrograma)) return false;

        if (busqueda.trim() !== '') {
            const term = busqueda.toLowerCase().trim();
            const txtMat = m.nombre.toLowerCase();
            const txtCod = m.codigo.toLowerCase();
            const txtProg = (p?.nombre || '').toLowerCase();
            const txtFac = getFacName(m.programa_id).toLowerCase();

            if (!txtMat.includes(term) && !txtCod.includes(term) && !txtProg.includes(term) && !txtFac.includes(term)) {
                return false;
            }
        }
        return true;
    });

    const totalPaginas = Math.ceil(materiasFiltradas.length / limite) || 1;
    const paginaSegura = pagina > totalPaginas ? totalPaginas : pagina;
    const itemsPag = materiasFiltradas.slice((paginaSegura - 1) * limite, paginaSegura * limite);

    return (
        <div>
            {/* Cabecera Filtros & Búsqueda */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', background: '#f8fafc', padding: '1.25rem', borderRadius: '16px 16px 0 0', border: '1px solid rgba(0,0,0,0.03)', borderBottom: 'none' }}>
                <div className="herr-campo" style={{ width: '220px' }}>
                    <label>Filtrar por Facultad</label>
                    <select value={filtroFacultad} onChange={e => { setFiltroFacultad(e.target.value); setFiltroPrograma(''); setPagina(1); }}>
                        <option value="">Todas las Facultades</option>
                        {facultades.filter(f => f.activa).map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                    </select>
                </div>
                <div className="herr-campo" style={{ width: '220px' }}>
                    <label>Filtrar por Programa</label>
                    <select value={filtroPrograma} onChange={e => { setFiltroPrograma(e.target.value); setPagina(1); }} disabled={!filtroFacultad}>
                        <option value="">Todos los Programas</option>
                        {programas.filter(p => String(p.facultad_id) === String(filtroFacultad) && p.activo).map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                </div>
                <div style={{ flex: 1 }}></div>
                <div className="herr-campo" style={{ width: '320px', position: 'relative' }}>
                    <label>Buscar Materia</label>
                    <div style={{ position: 'relative' }}>
                        <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input 
                            placeholder="Nombre, código o programa..." 
                            value={busqueda}
                            onChange={e => { setBusqueda(e.target.value); setPagina(1); }}
                            style={{ paddingLeft: '34px', width: '100%' }}
                        />
                    </div>
                </div>
            </div>

            <div className="herr-tabla-wrapper" style={{ marginTop: '0', borderRadius: '0 0 16px 16px', borderTop: 'none' }}>
                <table className="herr-tabla">
                    <thead>
                        <tr>
                            <th>Facultad</th>
                            <th>Programa</th>
                            <th>Materia</th>
                            <th>Código</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsPag.length === 0 && <tr><td colSpan={5} className="herr-vacio">No hay registros que coincidan con la búsqueda</td></tr>}
                        {itemsPag.map(m => (
                            <tr key={m.id} style={{ opacity: m.activa ? 1 : 0.6 }}>
                                <td style={{ color: '#475569', fontSize: '0.88rem' }}><strong>{getFacName(m.programa_id)}</strong></td>
                                <td style={{ color: '#64748b', fontSize: '0.88rem' }}>{getProgName(m.programa_id)}</td>
                                <td><strong>{m.nombre}</strong></td>
                                <td><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.82rem' }}>{m.codigo}</code></td>
                                <td><span className={`herr-badge ${m.activa ? 'herr-badge--activo' : 'herr-badge--inactivo'}`}>{m.activa ? 'Activa' : 'Inactiva'}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {totalPaginas > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', padding: '12px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Página {paginaSegura} de {totalPaginas}</span>
                        <button className="herr-btn herr-btn--sm" disabled={paginaSegura === 1} onClick={() => setPagina(p => p - 1)}>Anterior</button>
                        <button className="herr-btn herr-btn--sm" disabled={paginaSegura === totalPaginas} onClick={() => setPagina(p => p + 1)}>Siguiente</button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Sub-componente: Tabla de Materias ─────────────────────────────────────────
function TablaMaterias({ materias, programas, onActualizar, onBorrar }) {
    const [editId,     setEditId]     = useState(null);
    const [editNombre, setEditNombre] = useState('');
    const [editCodigo, setEditCodigo] = useState('');
    const [pagina,     setPagina]     = useState(1);
    const [busqueda,   setBusqueda]   = useState('');
    const limite = 6;

    const progNombre = (id) => programas.find(p => p.id === id)?.nombre || '—';

    const filtradas = materias.filter(m => !busqueda.trim() || m.nombre.toLowerCase().includes(busqueda.toLowerCase().trim()) || m.codigo.toLowerCase().includes(busqueda.toLowerCase().trim()) || progNombre(m.programa_id).toLowerCase().includes(busqueda.toLowerCase().trim()));

    const totalPaginas = Math.ceil(filtradas.length / limite) || 1;
    const paginaSegura = pagina > totalPaginas ? totalPaginas : pagina;
    const itemsPag = filtradas.slice((paginaSegura - 1) * limite, paginaSegura * limite);

    return (
        <div className="herr-tabla-wrapper">
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.65rem 1.25rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ position: 'relative', width: '260px' }}>
                    <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input style={{ padding: '0.4rem 0.8rem 0.4rem 1.95rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', width: '100%', outline: 'none', background: '#fff' }} placeholder="Buscar materia o código..." value={busqueda} onChange={e => { setBusqueda(e.target.value); setPagina(1); }} />
                </div>
            </div>
            <table className="herr-tabla">
                <thead><tr><th>Código</th><th>Nombre</th><th>Programa</th><th>Estado</th><th style={{ width: '130px' }}>Acciones</th></tr></thead>
                <tbody>
                    {itemsPag.length === 0 && <tr><td colSpan={5} className="herr-vacio">No hay materias encontradas</td></tr>}
                    {itemsPag.map(m => (
                        <tr key={m.id} style={{ opacity: m.activa ? 1 : 0.6 }}>
                            <td>
                                {editId === m.id
                                    ? <input autoFocus value={editCodigo} onChange={e => setEditCodigo(e.target.value.toUpperCase())} style={{ padding: '0.2rem', border: '1px solid #ccc', borderRadius: '4px', width: '90px', fontFamily: 'monospace' }} />
                                    : <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.82rem' }}>{m.codigo}</code>}
                            </td>
                            <td>
                                {editId === m.id
                                    ? <input value={editNombre} onChange={e => setEditNombre(e.target.value)} style={{ padding: '0.2rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }} />
                                    : <strong>{m.nombre}</strong>}
                            </td>
                            <td style={{ color: '#64748b', fontSize: '0.88rem' }}>{progNombre(m.programa_id)}</td>
                            <td><span className={`herr-badge ${m.activa ? 'herr-badge--activo' : 'herr-badge--inactivo'}`}>{m.activa ? 'Activa' : 'Inactiva'}</span></td>
                            <td className="herr-acciones">
                                {editId === m.id ? (
                                    <button className="herr-btn herr-btn--primario herr-btn--sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                        onClick={() => { onActualizar(m.id, { nombre: editNombre, codigo: editCodigo }); setEditId(null); }}>Guardar</button>
                                ) : (
                                    <button className="herr-action-circle herr-action-circle--edit" title="Editar"
                                        onClick={() => { setEditId(m.id); setEditNombre(m.nombre); setEditCodigo(m.codigo); }}><IcoEditar /></button>
                                )}
                                <button className={`herr-action-circle herr-action-circle--eye ${m.activa ? '' : 'herr-action-circle--eye-off'}`}
                                    title={m.activa ? 'Desactivar' : 'Activar'}
                                    onClick={() => onActualizar(m.id, { activa: !m.activa })}>
                                    {m.activa ? <IcoOjoOn /> : <IcoOjoOff />}
                                </button>
                                <button className="herr-action-circle herr-action-circle--delete" title="Eliminar"
                                    onClick={() => onBorrar({ tipo: 'materia', id: m.id, nombre: m.nombre })}><IcoBorrar /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {totalPaginas > 1 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', padding: '12px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Página {paginaSegura} de {totalPaginas}</span>
                    <button className="herr-btn herr-btn--sm" disabled={paginaSegura === 1} onClick={() => setPagina(p => p - 1)}>Anterior</button>
                    <button className="herr-btn herr-btn--sm" disabled={paginaSegura === totalPaginas} onClick={() => setPagina(p => p + 1)}>Siguiente</button>
                </div>
            )}
        </div>
    );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function TabAcademico({ token, onToast }) {
    const [facultades, setFacultades] = useState([]);
    const [programas,  setProgramas]  = useState([]);
    const [materias,   setMaterias]   = useState([]);
    const [nuevaFac,   setNuevaFac]   = useState({ nombre: '' });
    const [nuevoProg,  setNuevoProg]  = useState({ nombre: '', facultad: '' });
    const [nuevaMat,   setNuevaMat]   = useState({ nombre: '', codigo: '', programa_id: '', facultad_filtro: '' });
    const [modalBorrar, setModalBorrar] = useState(null);
    const [borrando,    setBorrando]    = useState(false);

    const [vistaActiva, setVistaActiva] = useState('tablero');

    const { agregarAlerta } = useAlertas();

    const cargar = useCallback(async () => {
        try {
            const respuesta = await AcademicoAPI.obtenerCatalogosAcademicos();
            if (respuesta.ok && respuesta.datos) {
                setFacultades(respuesta.datos.facultades || []);
                setProgramas(respuesta.datos.programas || []);
                setMaterias(respuesta.datos.materias || []);
            }
        } catch (error) {
            agregarAlerta('Error cargando catálogos académicos', 'error');
        }
    }, [agregarAlerta]);

    useEffect(() => { cargar(); }, [cargar]);

    const crearFacultad = async () => {
        if (!nuevaFac.nombre) return;
        if (facultades.some(f => f.nombre.trim().toLowerCase() === nuevaFac.nombre.trim().toLowerCase())) {
            agregarAlerta('Esta facultad ya existe', 'error');
            return;
        }
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
        if (programas.some(p => String(p.facultad_id) === String(nuevoProg.facultad) && p.nombre.trim().toLowerCase() === nuevoProg.nombre.trim().toLowerCase())) {
            agregarAlerta('Este programa ya existe en esta facultad', 'error');
            return;
        }
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

    const crearMateria = async () => {
        if (!nuevaMat.nombre || !nuevaMat.codigo || !nuevaMat.programa_id) return;
        if (materias.some(m => String(m.programa_id) === String(nuevaMat.programa_id) && 
            (m.nombre.trim().toLowerCase() === nuevaMat.nombre.trim().toLowerCase() || m.codigo.trim().toLowerCase() === nuevaMat.codigo.trim().toLowerCase()))) {
            agregarAlerta('Ya existe una materia con ese nombre o código en este programa', 'error');
            return;
        }
        try {
            await AcademicoAPI.crearMateria({
                nombre: nuevaMat.nombre,
                codigo: nuevaMat.codigo,
                programa_id: Number(nuevaMat.programa_id),
            });
            setNuevaMat({ nombre: '', codigo: '', programa_id: '', facultad_filtro: '' });
            agregarAlerta('Materia creada correctamente', 'exito');
            cargar();
        } catch (error) {
            const msg = error.response?.data?.error || 'Error creando materia';
            agregarAlerta(`❌ ${msg}`, 'error');
        }
    };

    const actualizarMateria = async (id, datos) => {
        try {
            await AcademicoAPI.actualizarMateria(id, datos);
            agregarAlerta('Materia actualizada', 'exito');
            cargar();
        } catch (error) {
            const msg = error.response?.data?.error || 'Error actualizando materia';
            agregarAlerta(`❌ ${msg}`, 'error');
        }
    };

    const confirmarBorrado = async () => {
        if (!modalBorrar) return;
        setBorrando(true);
        try {
            if (modalBorrar.tipo === 'facultad') {
                await AcademicoAPI.eliminarFacultad(modalBorrar.id);
            } else if (modalBorrar.tipo === 'programa') {
                await AcademicoAPI.eliminarPrograma(modalBorrar.id);
            } else {
                await AcademicoAPI.eliminarMateria(modalBorrar.id);
            }
            const etiqueta = { facultad: 'Facultad', programa: 'Programa', materia: 'Materia' }[modalBorrar.tipo];
            agregarAlerta(`${etiqueta} eliminada correctamente`, 'exito');
        } catch (error) {
            const msjError = error.response?.data?.error || 'Error eliminando (Revisar backend)';
            agregarAlerta(`❌ ${msjError}`, 'error');
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
                    titulo={`¿Eliminar ${{ facultad: 'facultad', programa: 'programa', materia: 'materia' }[modalBorrar?.tipo]}?`}
                    descripcion={<>Se eliminará permanentemente <strong>"{modalBorrar?.nombre}"</strong>. Esta acción no se puede deshacer.</>}
                    cargando={borrando}
                    onCancelar={() => setModalBorrar(null)}
                    onConfirmar={confirmarBorrado}
                />
            )}

            <div className="herr-folder-tabs">
                <button 
                    className={`herr-folder-tab ${vistaActiva === 'tablero' ? 'active' : ''}`}
                    onClick={() => setVistaActiva('tablero')}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                    Tablero General
                </button>
                <button 
                    className={`herr-folder-tab ${vistaActiva === 'facultades' ? 'active' : ''}`}
                    onClick={() => setVistaActiva('facultades')}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M4 21v-4"/><path d="M20 21v-4"/><path d="M8 21v-4"/><path d="M12 21v-4"/><path d="M16 21v-4"/><path d="M3 14h18"/><path d="M4 14V9l8-5 8 5v5"/></svg>
                    Facultades ({facultades.length})
                </button>
                
                <button 
                    className={`herr-folder-tab ${vistaActiva === 'programas' ? 'active' : ''}`}
                    onClick={() => setVistaActiva('programas')}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    Programas ({programas.length})
                </button>

                <button 
                    className={`herr-folder-tab ${vistaActiva === 'materias' ? 'active' : ''}`}
                    onClick={() => setVistaActiva('materias')}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    Materias ({materias.length})
                </button>
            </div>

            {/* ── Tablero ────────────────────────────────────────────── */}
            {vistaActiva === 'tablero' && (
                <div className="herr-card fade-in" style={{ borderTopLeftRadius: '0' }}>
                    <div className="herr-card-header--premium">
                        <div className="herr-premium-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line>
                            </svg>
                        </div>
                        <div className="herr-premium-title-group">
                            <h3>Tablero Académico General</h3>
                            <p>Vista consolidada rápida de todas las facultades, programas y materias</p>
                        </div>
                    </div>
                    <TablaTablero materias={materias} programas={programas} facultades={facultades} />
                </div>
            )}

            {/* ── Facultades ─────────────────────────────────────────── */}
            {vistaActiva === 'facultades' && (
                <div className="herr-card fade-in" style={{ borderTopLeftRadius: vistaActiva === 'tablero' ? '24px' : '0' }}>
                    <div className="herr-card-header--premium">
                        <div className="herr-premium-icon" style={{ background: '#fdf4ff', color: '#c026d3' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 21h18"/><path d="M4 21v-4"/><path d="M20 21v-4"/><path d="M8 21v-4"/><path d="M12 21v-4"/><path d="M16 21v-4"/>
                                <path d="M3 14h18"/><path d="M4 14V9l8-5 8 5v5"/>
                            </svg>
                        </div>
                        <div className="herr-premium-title-group">
                            <h3>Gestión de Facultades</h3>
                            <p>Administra las unidades académicas principales</p>
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
            )}

            {/* ── Programas ──────────────────────────────────────────── */}
            {vistaActiva === 'programas' && (
                <div className="herr-card fade-in">
                    <div className="herr-card-header--premium">
                        <div className="herr-premium-icon" style={{ background: '#f0f9ff', color: '#0ea5e9' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                            </svg>
                        </div>
                        <div className="herr-premium-title-group">
                            <h3>Programas Académicos</h3>
                            <p>Asocia programas a sus respectivas facultades</p>
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
            )}

            {/* ── Materias ───────────────────────────────────────────── */}
            {vistaActiva === 'materias' && (
                <div className="herr-card fade-in">
                    <div className="herr-card-header--premium">
                        <div className="herr-premium-icon" style={{ background: '#fefce8', color: '#ca8a04' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                            </svg>
                        </div>
                        <div className="herr-premium-title-group">
                            <h3>Materias Registradas</h3>
                            <p>Gestión del catálogo detallado de asignaturas</p>
                        </div>
                    </div>
                    {/* Formulario cascada: Facultad → Programa → Nombre + Código */}
                    <div className="herr-form-inline" style={{ flexWrap: 'wrap', gap: '12px' }}>
                        <div className="herr-campo" style={{ width: '200px' }}>
                            <label>Facultad Filtro</label>
                            <select value={nuevaMat.facultad_filtro} onChange={e => setNuevaMat({ ...nuevaMat, facultad_filtro: e.target.value, programa_id: '' })}>
                                <option value="">Seleccionar…</option>
                                {facultades.filter(f => f.activa).map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                            </select>
                        </div>
                        <div className="herr-campo" style={{ width: '220px' }}>
                            <label>Programa</label>
                            <select value={nuevaMat.programa_id} onChange={e => setNuevaMat({ ...nuevaMat, programa_id: e.target.value })} disabled={!nuevaMat.facultad_filtro}>
                                <option value="">Seleccionar…</option>
                                {programas.filter(p => String(p.facultad_id) === String(nuevaMat.facultad_filtro) && p.activo).map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                            </select>
                        </div>
                        <div className="herr-campo" style={{ flex: 1, minWidth: '160px' }}>
                            <label>Nombre de la Materia</label>
                            <input value={nuevaMat.nombre} onChange={e => setNuevaMat({ ...nuevaMat, nombre: e.target.value })} placeholder="Ej: Biología Celular" />
                        </div>
                        <div className="herr-campo" style={{ width: '120px' }}>
                            <label>Código</label>
                            <input value={nuevaMat.codigo} onChange={e => setNuevaMat({ ...nuevaMat, codigo: e.target.value.toUpperCase() })} placeholder="BIO-101" maxLength={20} />
                        </div>
                        <button className="herr-btn herr-btn--dark herr-btn--sm" style={{ alignSelf: 'flex-end' }} onClick={crearMateria}>
                            + Agregar
                        </button>
                    </div>
                    {/* Tabla de materias */}
                    <TablaMaterias materias={materias} programas={programas} onActualizar={actualizarMateria} onBorrar={setModalBorrar} />
                </div>
            )}
        </>
    );
}
