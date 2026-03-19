// src/modulos/profesor/componentes/pasos/Paso1Informacion.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Paso 1: Información general de la salida de campo.
// Sub-componentes: TicketViaje, PanelDiseno. Hook: useCatalogos.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../../nucleo/api/config';
import BuscadorProfesores from '../tablero/BuscadorProfesores';
import imgBinoculares from '../../../../assets/portadas/binoculares.png';
import imgMochila     from '../../../../assets/portadas/mochila.png';
import imgKayak       from '../../../../assets/portadas/kayak.png';
import imgBrujula     from '../../../../assets/portadas/brujula.png';

// ── Constantes ────────────────────────────────────────────────────────────────
const PORTADAS = [
    { id: 'Img1', label: 'Binoculares',   url: imgBinoculares },
    { id: 'Img2', label: 'Mochila / Campo', url: imgMochila },
    { id: 'Img3', label: 'Kayak',         url: imgKayak },
    { id: 'Img4', label: 'Brújula',       url: imgBrujula },
];
const COLORES = [
    { hex: '#4A8DAC', label: 'Cian OTIUM' },
    { hex: '#345B8D', label: 'Azul Profundo' },
    { hex: '#16a34a', label: 'Verde Botánico' },
    { hex: '#b45309', label: 'Tierra / Geología' },
    { hex: '#6366f1', label: 'Índigo Digital' },
    { hex: '#db2777', label: 'Rosa Pink' },
    { hex: '#ea580c', label: 'Naranja Vivo' },
];
const DIAS   = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES  = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function formatFechaHora(fecha) {
    if (!fecha) return { dia: '--', fecha: '-- ---' };
    const d = new Date(fecha + 'T00:00:00');
    return { dia: DIAS[d.getDay()], fecha: `${d.getDate()} ${MESES[d.getMonth()]}` };
}

// ── Hook: cargar catálogos académicos ─────────────────────────────────────────
function useCatalogos() {
    const [facultades, setFacultades] = useState([]);
    const [programas,  setProgramas]  = useState([]);
    const [ventanas,   setVentanas]   = useState([]);
    const [cargando,   setCargando]   = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/admin/catalogos/`)
            .then(r => r.json())
            .then(d => {
                if (d.ok && d.datos) {
                    setFacultades(d.datos.facultades || []);
                    setProgramas(d.datos.programas  || []);
                    setVentanas(d.datos.ventanas    || []);
                }
            })
            .catch(() => {})
            .finally(() => setCargando(false));
    }, []);

    return { facultades, programas, ventanas, cargando };
}

// ── Sub-componente: Ticket visual Salida → Llegada ────────────────────────────
function TicketViaje({ form }) {
    const salida  = formatFechaHora(form.fecha_inicio);
    const llegada = formatFechaHora(form.fecha_fin);
    return (
        <div className="nsal-viaje-ticket">
            <div className="nsal-ticket-col">
                <div className="nsal-ticket-label-top">✈️ SALIDA</div>
                <div className="nsal-ticket-big-hora">{form.hora_inicio || '--:--'}</div>
                <div className="nsal-ticket-fecha">
                    <span className="nsal-ticket-dia">{salida.dia}</span>
                    <span className="nsal-ticket-date">{salida.fecha}</span>
                </div>
            </div>
            <div className="nsal-ticket-sep">
                <div className="nsal-ticket-line" />
                <div className="nsal-ticket-avion">→</div>
                <div className="nsal-ticket-line" />
            </div>
            <div className="nsal-ticket-col nsal-ticket-col--llegada">
                <div className="nsal-ticket-label-top">🏁 LLEGADA EST.</div>
                <div className="nsal-ticket-big-hora nsal-ticket-big-hora--llegada">
                    {form.hora_fin || '--:--'}
                </div>
                <div className="nsal-ticket-fecha">
                    <span className="nsal-ticket-dia">{llegada.dia}</span>
                    <span className="nsal-ticket-date">{llegada.fecha}</span>
                </div>
                <div className="nsal-ticket-sublabel">
                    {form.hora_fin ? '📍 Calculada por el sistema' : 'Traza la ruta en Paso 3'}
                </div>
            </div>
        </div>
    );
}

// ── Sub-componente: Panel de personalización visual ───────────────────────────
function PanelDiseno({ form, setForm }) {
    return (
        <fieldset className="nsal-fieldset nsal-design-panel">
            <legend>Personalización Visual (UI)</legend>
            <div className="nsal-row-2">
                <div className="nsal-col">
                    <span className="nsal-label-inner">Imagen de Portada</span>
                    <div className="nsal-icon-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                        {PORTADAS.map(img => (
                            <div
                                key={img.id}
                                className={`nsal-icon-btn ${form.icono === img.id ? 'active' : ''}`}
                                onClick={() => setForm({ ...form, icono: img.id })}
                                title={img.label}
                                style={{
                                    padding: 0, height: '60px', overflow: 'hidden',
                                    border: form.icono === img.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                }}
                            >
                                <img
                                    src={img.url}
                                    alt={img.label}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={e => {
                                        e.target.style.display = 'none';
                                        Object.assign(e.target.parentElement.style, {
                                            background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.65rem', color: '#64748b', fontWeight: '600',
                                            textAlign: 'center', padding: '4px',
                                        });
                                        e.target.parentElement.innerText = img.label;
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="nsal-col">
                    <span className="nsal-label-inner">Color de Tarjeta</span>
                    <div className="nsal-color-grid">
                        {COLORES.map(c => (
                            <div
                                key={c.hex}
                                className={`nsal-color-btn ${form.color === c.hex ? 'active' : ''}`}
                                style={{ background: c.hex }}
                                onClick={() => setForm({ ...form, color: c.hex })}
                                title={c.label}
                            >
                                {form.color === c.hex && '✓'}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </fieldset>
    );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Paso1Informacion({ form, setForm, esGrupal, setEsGrupal, profesoresAsociados, setProfesoresAsociados }) {
    const { facultades, programas, ventanas, cargando } = useCatalogos();

    const programasFiltrados = form.facultad
        ? programas.filter(p => String(p.facultad) === String(form.facultad) || p.facultad_nombre === form.facultad)
        : programas;

    const opcionesSemestre = ventanas.length > 0
        ? ventanas.map(v => ({ valor: v.nombre, label: v.nombre }))
        : [{ valor: '2026-1', label: '2026-1' }, { valor: '2026-2', label: '2026-2' }];

    const set = (campo, valor) => setForm({ ...form, [campo]: valor });

    return (
        <div className="nsal-grid-2col">
            {/* ── Columna izquierda: Datos Generales ──────────────────── */}
            <fieldset className="nsal-fieldset">
                <legend>Datos Generales</legend>

                <label>
                    <span>Nombre de la salida *</span>
                    <input type="text" value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Ej: Estudio de ecosistemas andinos..." />
                </label>

                <label>
                    <span>Resumen Corto (Para Tarjetas del Tablero)</span>
                    <input type="text" value={form.resumen} maxLength={20} onChange={e => set('resumen', e.target.value)} placeholder="Máx. 20 caracteres" />
                    <small style={{ color: form.resumen.length >= 20 ? '#ef4444' : '#94a3b8', fontSize: '0.7rem', marginTop: 2 }}>
                        {form.resumen.length}/20 caracteres
                    </small>
                </label>

                <div className="nsal-row-2">
                    <label>
                        <span>Asignatura *</span>
                        <input type="text" value={form.asignatura} onChange={e => set('asignatura', e.target.value)} placeholder="Ej: Ecología de Campo" />
                    </label>
                    <label>
                        <span>Facultad *</span>
                        {facultades.length > 0 ? (
                            <select value={form.facultad} onChange={e => setForm({ ...form, facultad: e.target.value, programa: '' })}>
                                <option value="">Seleccionar facultad…</option>
                                {facultades.map(f => <option key={f.id} value={f.nombre}>{f.nombre}</option>)}
                            </select>
                        ) : (
                            <input type="text" value={form.facultad} onChange={e => set('facultad', e.target.value)} placeholder={cargando ? 'Cargando…' : 'Ej: Ciencias'} />
                        )}
                    </label>
                </div>

                <div className="nsal-row-2">
                    <label>
                        <span>Programa Académico *</span>
                        {programas.length > 0 ? (
                            <select value={form.programa} onChange={e => set('programa', e.target.value)}>
                                <option value="">Seleccionar programa…</option>
                                {programasFiltrados.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                            </select>
                        ) : (
                            <input type="text" value={form.programa} onChange={e => set('programa', e.target.value)} placeholder={cargando ? 'Cargando…' : 'Ej: Biología'} />
                        )}
                    </label>
                    <label>
                        <span>Semestre *</span>
                        <select value={form.semestre} onChange={e => set('semestre', e.target.value)}>
                            {opcionesSemestre.map(s => <option key={s.valor} value={s.valor}>{s.label}</option>)}
                        </select>
                    </label>
                </div>

                <div className="nsal-row-2">
                    <label>
                        <span>N° Estudiantes *</span>
                        <input
                            type="text" inputMode="numeric" pattern="[0-9]*"
                            value={form.num_estudiantes} placeholder="Ej: 30"
                            onChange={e => set('num_estudiantes', e.target.value.replace(/\D/g, ''))}
                        />
                    </label>
                </div>

                <div className="nsal-row-2">
                    <label>
                        <span>Fecha Inicio *</span>
                        <input type="date" value={form.fecha_inicio} onChange={e => set('fecha_inicio', e.target.value)} />
                    </label>
                    <label>
                        <span>Fecha Fin *</span>
                        <input type="date" value={form.fecha_fin} onChange={e => set('fecha_fin', e.target.value)} />
                    </label>
                </div>

                <div className="nsal-row-2">
                    <label>
                        <span>Hora de Salida *</span>
                        <input type="time" value={form.hora_inicio || ''} onChange={e => set('hora_inicio', e.target.value)} />
                    </label>
                </div>

                <TicketViaje form={form} />
            </fieldset>

            {/* ── Columna derecha ──────────────────────────────────────── */}
            <div className="nsal-col-derecha">
                <fieldset className="nsal-fieldset">
                    <legend>Justificación Académica</legend>
                    <label>
                        <span>¿Por qué es necesaria esta salida? *</span>
                        <textarea rows="4" value={form.justificacion} onChange={e => set('justificacion', e.target.value)} placeholder="Describa la importancia y necesidad..." />
                    </label>
                    <label>
                        <span>Relación con el syllabus (Simulado)</span>
                        <textarea rows="2" value={form.relacion_syllabus} onChange={e => set('relacion_syllabus', e.target.value)} placeholder="Indique qué temas..." />
                    </label>
                </fieldset>

                <BuscadorProfesores
                    esGrupal={esGrupal}
                    setEsGrupal={setEsGrupal}
                    seleccionados={profesoresAsociados}
                    setSeleccionados={setProfesoresAsociados}
                />

                <PanelDiseno form={form} setForm={setForm} />
            </div>
        </div>
    );
}
