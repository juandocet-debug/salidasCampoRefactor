// modulos/admin/componentes/TabFlota.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Gestión de Flota Vehicular — CRUD con asistencia de IA para rendimiento
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from 'react';
import './TabFlota.css';
import { CardMatcha, CardKPI } from '../../../nucleo/componentes/generales/Tarjetas/Tarjetas';
import TabParametros from './TabParametros';


const API    = 'http://localhost:8000/api/transporte/vehiculos/';
const API_IA = 'http://localhost:8000/api/nucleo/rendimiento-vehiculo/';

const TIPOS = [
    { value: 'bus',       label: 'Bus' },
    { value: 'buseta',    label: 'Buseta' },
    { value: 'microbus',  label: 'Microbús' },
    { value: 'camioneta', label: 'Camioneta / Van' },
    { value: 'furgon',    label: 'Furgón' },
];
const ESTADOS = [
    { value: 'disponible',    label: 'Disponible',    color: '#10b981' },
    { value: 'en_servicio',   label: 'En Servicio',   color: '#f59e0b' },
    { value: 'mantenimiento', label: 'Mantenimiento', color: '#ef4444' },
];
const PROPIETARIOS = [
    { value: 'institucional', label: 'Institucional (UPN)' },
    { value: 'externo',       label: 'Flota Externa' },
];
const COMBUSTIBLES = [
    { value: 'diesel',   label: 'Diésel' },
    { value: 'gasolina', label: 'Gasolina' },
    { value: 'gas',      label: 'Gas Natural' },
];

const TIPOS_VALIDOS      = TIPOS.map(t => t.value);
const COMBUSTIBLES_VALIDOS = COMBUSTIBLES.map(c => c.value);

const EMPTY_FORM = {
    placa: '', tipo: 'bus', marca: '', modelo: '', anio: '', color: '',
    numero_interno: '', capacidad: 40, rendimiento_kmgal: 8,
    tipo_combustible: 'diesel', propietario: 'institucional',
    estado_tecnico: 'disponible', notas: '',
};

export default function TabFlota({ token, onToast }) {
    const [vehiculos,        setVehiculos]        = useState([]);
    const [cargando,         setCargando]          = useState(true);
    const [filtroTipo,       setFiltroTipo]        = useState('');
    const [filtroPropietario, setFiltroPropietario] = useState('');
    const [modalOpen,        setModalOpen]         = useState(false);
    const [editando,         setEditando]          = useState(null);
    const [form,             setForm]              = useState({ ...EMPTY_FORM });
    const [fotoFile,         setFotoFile]          = useState(null);
    const [iaLoading,        setIaLoading]         = useState(false);
    const [iaBusqueda,       setIaBusqueda]        = useState('');
    const [iaNota,           setIaNota]            = useState('');
    const [guardando,        setGuardando]         = useState(false);

    const headers = { Authorization: `Bearer ${token}` };

    // ── Cargar vehículos ─────────────────────────────────────────────────────
    const cargar = useCallback(async () => {
        setCargando(true);
        try {
            const params = [];
            if (filtroTipo)        params.push(`tipo=${filtroTipo}`);
            if (filtroPropietario) params.push(`propietario=${filtroPropietario}`);
            const url = params.length ? `${API}?${params.join('&')}` : API;
            const r   = await fetch(url, { headers });
            if (r.ok) setVehiculos(await r.json());
        } catch (e) { console.error(e); }
        setCargando(false);
    }, [token, filtroTipo, filtroPropietario]);

    useEffect(() => { cargar(); }, [cargar]);

    // ── Abrir modal ──────────────────────────────────────────────────────────
    const abrirCrear = () => {
        setForm({ ...EMPTY_FORM });
        setFotoFile(null);
        setEditando(null);
        setModalOpen(true);
    };

    const abrirEditar = (v) => {
        setForm({
            placa:             v.placa,
            tipo:              v.tipo,
            marca:             v.marca             || '',
            modelo:            v.modelo            || '',
            anio:              v.anio              || '',
            color:             v.color             || '',
            numero_interno:    v.numero_interno    || '',
            capacidad:         v.capacidad,
            rendimiento_kmgal: v.rendimiento_kmgal,
            tipo_combustible:  v.tipo_combustible  || 'diesel',
            propietario:       v.propietario       || 'institucional',
            estado_tecnico:    v.estado_tecnico,
            notas:             v.notas             || '',
        });
        setFotoFile(null);
        setEditando(v);
        setModalOpen(true);
    };

    // ── Guardar ──────────────────────────────────────────────────────────────
    const guardar = async () => {
        setGuardando(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => {
                if (v !== '' && v !== null && v !== undefined) fd.append(k, v);
            });
            if (fotoFile) fd.append('foto', fotoFile);

            const url    = editando ? `${API}${editando.id}/` : API;
            const method = editando ? 'PATCH' : 'POST';
            const r      = await fetch(url, { method, headers, body: fd });

            if (r.ok) {
                const vehiculoActualizado = await r.json();
                if (editando) {
                    // Actualizar inmediatamente en el estado local sin recargar todo
                    setVehiculos(prev => prev.map(v =>
                        v.id === vehiculoActualizado.id ? vehiculoActualizado : v
                    ));
                } else {
                    // Para nuevos vehículos, añadir al inicio de la lista
                    setVehiculos(prev => [vehiculoActualizado, ...prev]);
                }
                onToast(editando ? '✅ Vehículo actualizado' : '✅ Vehículo registrado');
                setModalOpen(false);
            } else {
                const err = await r.json().catch(() => ({}));
                onToast(`❌ Error: ${JSON.stringify(err)}`);
            }
        } catch (e) { onToast(`❌ ${e.message}`); }
        setGuardando(false);
    };

    // ── Eliminar ─────────────────────────────────────────────────────────────
    const eliminar = async (id) => {
        if (!confirm('¿Eliminar este vehículo?')) return;
        await fetch(`${API}${id}/`, { method: 'DELETE', headers });
        onToast('🗑️ Vehículo eliminado');
        cargar();
    };

    // ── IA: Auto-llenar datos del vehículo ───────────────────────────────────
    const consultarIA = async () => {
        const consulta = iaBusqueda.trim();
        if (!consulta) return;
        setIaLoading(true);
        setIaNota('');
        try {
            const r = await fetch(API_IA, {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ consulta }),
            });
            if (r.ok) {
                const data = await r.json();
                if (data.ok && data.datos) {
                    const d = data.datos;
                    setForm(f => ({
                        ...f,
                        marca:             d.marca             || f.marca,
                        modelo:            d.modelo            || f.modelo,
                        tipo:              TIPOS_VALIDOS.includes(d.tipo) ? d.tipo : f.tipo,
                        capacidad:         d.capacidad         || f.capacidad,
                        rendimiento_kmgal: d.rendimiento_kmgal || f.rendimiento_kmgal,
                        tipo_combustible:  COMBUSTIBLES_VALIDOS.includes(d.tipo_combustible) ? d.tipo_combustible : f.tipo_combustible,
                        anio:              d.anio_hasta || d.anio || f.anio,
                    }));
                    setIaNota(d.nota || `✅ Datos cargados: ${d.marca} ${d.modelo}`);
                    onToast(`🤖 IA completó: ${d.marca} ${d.modelo} — ${d.capacidad} PAX, ${d.rendimiento_kmgal} km/gal`);
                } else {
                    setIaNota('⚠️ No se encontró información para ese vehículo');
                }
            }
        } catch { setIaNota('❌ IA no disponible'); }
        setIaLoading(false);
    };

    // ── Stats derivadas ──────────────────────────────────────────────────────
    const total          = vehiculos.length;
    const institucionales = vehiculos.filter(v => v.propietario === 'institucional').length;
    const disponibles    = vehiculos.filter(v => v.estado_tecnico === 'disponible').length;

    return (
        <div className="flota-tab layout-dashboard">
            <div className="flota-main-column">
                {/* ── Stats Cards ───────────────────────────────────────────── */}
                <div className="flota-stats">
                <CardKPI 
                    label="Total Flota" 
                    value={total} 
                    icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v9c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>} 
                    iconBg="#eff6ff" 
                    iconColor="#3b82f6" 
                />
                <CardKPI 
                    label="Institucionales" 
                    value={institucionales} 
                    icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M4 6h16"/><line x1="5" y1="18" x2="5" y2="8"/><line x1="9" y1="18" x2="9" y2="8"/><line x1="15" y1="18" x2="15" y2="8"/><line x1="19" y1="18" x2="19" y2="8"/><polygon points="12 2 2 6 22 6"/></svg>} 
                    iconBg="#f5f3ff" 
                    iconColor="#8b5cf6" 
                />
                <CardKPI 
                    label="Disponibles" 
                    value={disponibles} 
                    icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} 
                    iconBg="#ecfdf5" 
                    iconColor="#10b981" 
                />
                <CardKPI 
                    label="En Uso/Mant." 
                    value={total - disponibles} 
                    icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>} 
                    iconBg="#fffbeb" 
                    iconColor="#f59e0b" 
                />
            </div>

            {/* ── Toolbar ───────────────────────────────────────────────── */}
            <div className="flota-toolbar">
                <div className="flota-filters">
                    <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className="flota-select">
                        <option value="">Todos los tipos</option>
                        {TIPOS.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
                    </select>
                    <select value={filtroPropietario} onChange={e => setFiltroPropietario(e.target.value)} className="flota-select">
                        <option value="">Todos</option>
                        {PROPIETARIOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                </div>
                <button className="flota-btn-add" onClick={abrirCrear}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Registrar Vehículo
                </button>
            </div>

            {/* ── Grid de Vehículos ─────────────────────────────────────── */}
            {cargando ? (
                <div className="flota-loading">Cargando flota...</div>
            ) : vehiculos.length === 0 ? (
                <div className="flota-empty">
                    <span className="flota-empty-icon">🚐</span>
                    <h3>No hay vehículos registrados</h3>
                    <p>Registra el primer vehículo de la flota institucional</p>
                    <button className="flota-btn-add" onClick={abrirCrear}>+ Registrar Vehículo</button>
                </div>
            ) : (
                <div className="flota-grid">
                    {vehiculos.map(v => {
                        const esUPN = v.propietario === 'institucional';
                        const imgSrcFallback = v.tipo === 'buseta' || v.tipo === 'microbus' || v.tipo === 'camioneta' 
                            ? 'https://cdn3d.iconscout.com/3d/premium/thumb/minivan-6780879-5573489.png'
                            : 'https://cdn3d.iconscout.com/3d/premium/thumb/bus-4993648-4159573.png';

                        return (
                            <CardMatcha
                                key={v.id}
                                title={v.placa}
                                color={v.tipo}
                                badgeText={ESTADOS.find(e => e.value === v.estado_tecnico)?.label}
                                badgeColor={ESTADOS.find(e => e.value === v.estado_tecnico)?.color || '#1e293b'}
                                imageSrc={v.foto_display || v.foto_url || imgSrcFallback}
                                bannerText={esUPN ? 'Institucional — UPN' : 'Flota Externa'}
                                tags={[
                                    TIPOS.find(t => t.value === v.tipo)?.label,
                                    `${v.capacidad} PAX`,
                                    `${v.rendimiento_kmgal} km/gal`,
                                    v.tipo_combustible === 'diesel' ? '⛽ Diésel' : '🔋 ' + COMBUSTIBLES.find(c => c.value === v.tipo_combustible)?.label
                                ]}
                                actions={
                                    <>
                                        <button className="ui-card-btn ui-card-btn--edit" onClick={() => abrirEditar(v)} title="Editar">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                        </button>
                                        <button className="ui-card-btn ui-card-btn--danger" onClick={() => eliminar(v.id)} title="Eliminar">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                        </button>
                                    </>
                                }
                            />
                        );
                    })}
                </div>
            )}
            </div>

            {/* ── Sidebar Column: Parámetros Financieros ──────────────────── */}
            <div className="flota-side-column">
                <TabParametros token={token} onToast={onToast} />
            </div>

            {/* ── Modal Flota (Oculto) ──────────────────────────────────────── */}
            {modalOpen && (
                <div className="flota-modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
                    <div className="flota-modal">
                        <div className="flota-modal-header">
                            <h2>{editando ? '✏️ Editar Vehículo' : '🚐 Nuevo Vehículo'}</h2>
                            <button className="flota-modal-close" onClick={() => setModalOpen(false)}>✕</button>
                        </div>
                        <div className="flota-modal-body">
                            <div className="flota-modal-layout">
                                {/* COLUMNA IZQUIERDA (IA, Foto y Notas) */}
                                <div className="flota-col-left">
                                    {/* Búsqueda IA */}
                                    <div className="flota-ia-search" style={{ height: 'fit-content' }}>
                                        <div className="flota-ia-search-header">
                                            <span className="flota-ia-icon">🤖</span>
                                            <div>
                                                <h3>Asistente IA</h3>
                                                <p>Escribe tu instrucción como si fuera un chat</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flota-ia-chat-area">
                                            <div className="flota-ia-user-msg">
                                                <textarea
                                                    value={iaBusqueda}
                                                    onChange={e => setIaBusqueda(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            consultarIA();
                                                        }
                                                    }}
                                                    placeholder="Ej: 'Es una Van Chevrolet modelo NQR blanca...'"
                                                    className="flota-ia-input flota-ia-chat-input"
                                                    rows={2}
                                                />
                                                <button className="flota-btn-ia-send" onClick={consultarIA} disabled={iaLoading || !iaBusqueda.trim()}>
                                                    {iaLoading ? '⏳' : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>}
                                                </button>
                                            </div>
                                            
                                            {iaNota && (
                                                <div className="flota-ia-bot-msg">
                                                    <div className="flota-ia-bot-avatar">🤖</div>
                                                    <div className="flota-ia-bot-bubble">
                                                        {iaNota}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flota-form-section" style={{ margin: 0, paddingRight: '12px' }}>
                                        <h4 className="flota-section-title">Archivos y Notas</h4>
                                        <div className="flota-field" style={{ marginBottom: '16px' }}>
                                            <label>📸 Foto del Vehículo</label>
                                            <label className="flota-file-wrapper" style={{ minHeight: '120px', padding: (fotoFile || editando?.foto_display) ? '8px' : '24px 16px' }} htmlFor="foto_input">
                                                <input type="file" id="foto_input" accept="image/*" onChange={e => setFotoFile(e.target.files[0])} className="flota-file-input" />
                                                
                                                {!fotoFile && (!editando || !editando.foto_display) && (
                                                    <div className="flota-file-placeholder">
                                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                                        <div style={{ marginTop: '8px', lineHeight: '1.3' }}>
                                                            <strong style={{ color: '#4f46e5' }}>Haz clic aquí para adjuntar</strong><br/>
                                                            <span style={{ color: '#64748b' }}>o arrastra una foto</span><br/>
                                                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'normal' }}>Soporta JPG, PNG</span>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {fotoFile && (
                                                    <img src={URL.createObjectURL(fotoFile)} alt="Previsualización" className="flota-preview-img" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                                                )}
                                                
                                                {editando?.foto_display && !fotoFile && (
                                                    <img src={editando.foto_display} alt="Actual" className="flota-preview-img" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                                                )}
                                            </label>
                                        </div>

                                        <div className="flota-field">
                                            <label>Notas Adicionales</label>
                                            <textarea value={form.notas} onChange={e => setForm(f => ({...f, notas: e.target.value}))} rows={3} placeholder="Observaciones, mantenimientos..." style={{ resize: 'none' }} />
                                        </div>
                                    </div>
                                </div>

                                {/* COLUMNA DERECHA (Campos del Formulario) */}
                                <div className="flota-col-right">
                                    <div className="flota-form-section">
                                        <h4 className="flota-section-title">Identificación Principal</h4>
                                        <div className="flota-form-grid">
                                            <div className="flota-field">
                                                <label>Placa *</label>
                                                <input value={form.placa} onChange={e => setForm(f => ({...f, placa: e.target.value.toUpperCase()}))} placeholder="ABC123" maxLength={10} />
                                            </div>
                                            <div className="flota-field">
                                                <label>Tipo</label>
                                                <select value={form.tipo} onChange={e => setForm(f => ({...f, tipo: e.target.value}))}>
                                                    {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                                </select>
                                            </div>
                                            <div className="flota-field">
                                                <label>Marca</label>
                                                <input value={form.marca} onChange={e => setForm(f => ({...f, marca: e.target.value}))} placeholder="Completado por IA" />
                                            </div>
                                            <div className="flota-field">
                                                <label>Modelo</label>
                                                <input value={form.modelo} onChange={e => setForm(f => ({...f, modelo: e.target.value}))} placeholder="Completado por IA" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flota-form-section">
                                        <h4 className="flota-section-title">Especificaciones Técnicas</h4>
                                        <div className="flota-form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                                            <div className="flota-field">
                                                <label>Año</label>
                                                <input type="number" value={form.anio} onChange={e => setForm(f => ({...f, anio: e.target.value}))} placeholder="IA" />
                                            </div>
                                            <div className="flota-field">
                                                <label>Cap./PAX</label>
                                                <input type="number" value={form.capacidad} onChange={e => setForm(f => ({...f, capacidad: +e.target.value}))} min={1} />
                                            </div>
                                            <div className="flota-field">
                                                <label>km/gal</label>
                                                <input type="number" step="0.1" value={form.rendimiento_kmgal} onChange={e => setForm(f => ({...f, rendimiento_kmgal: +e.target.value}))} />
                                            </div>
                                            <div className="flota-field" style={{ gridColumn: 'span 2' }}>
                                                <label>Combustible</label>
                                                <select value={form.tipo_combustible} onChange={e => setForm(f => ({...f, tipo_combustible: e.target.value}))}>
                                                    {COMBUSTIBLES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                                </select>
                                            </div>
                                            <div className="flota-field">
                                                <label>Color</label>
                                                <input value={form.color} onChange={e => setForm(f => ({...f, color: e.target.value}))} placeholder="Blanco" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flota-form-section">
                                        <h4 className="flota-section-title">Gestión y Estado</h4>
                                        <div className="flota-form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                                            <div className="flota-field">
                                                <label>N° Interno</label>
                                                <input value={form.numero_interno} onChange={e => setForm(f => ({...f, numero_interno: e.target.value}))} placeholder="V-001" />
                                            </div>
                                            <div className="flota-field">
                                                <label>Propietario</label>
                                                <select value={form.propietario} onChange={e => setForm(f => ({...f, propietario: e.target.value}))}>
                                                    {PROPIETARIOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                                                </select>
                                            </div>
                                            <div className="flota-field">
                                                <label>Estado</label>
                                                <select value={form.estado_tecnico} onChange={e => setForm(f => ({...f, estado_tecnico: e.target.value}))}>
                                                    {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flota-modal-footer">
                            <button className="flota-btn-cancel" onClick={() => setModalOpen(false)}>Cancelar</button>
                            <button className="flota-btn-save" onClick={guardar} disabled={guardando || !form.placa}>
                                {guardando ? 'Guardando...' : editando ? 'Actualizar Vehículo' : 'Registrar Vehículo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
