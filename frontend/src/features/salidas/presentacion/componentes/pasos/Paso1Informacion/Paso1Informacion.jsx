// src/features/salidas/presentacion/componentes/pasos/Paso1Informacion.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Paso 1: Información general de la salida de campo.
// Sub-componentes: TicketViaje, PanelDiseno. Hook: useCatalogos.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { clienteHttp } from '@/shared/api/clienteHttp';
import BuscadorProfesores from '@/features/salidas/presentacion/componentes/BuscadorProfesores/BuscadorProfesores';
import imgBinoculares from '@/assets/portadas/binoculares.png';
import imgMochila     from '@/assets/portadas/mochila.png';
import imgKayak       from '@/assets/portadas/kayak.png';
import imgBrujula     from '@/assets/portadas/brujula.png';

import { useCatalogos } from './useCatalogos';
import TicketViaje from './TicketViaje';
import PanelDiseno from './PanelDiseno';

// ── Componente principal ──────────────────────────────────────────────────────
export default function Paso1Informacion({ form, setForm, esGrupal, setEsGrupal, profesoresAsociados, setProfesoresAsociados }) {
    const { facultades, programas, materias, ventanas, cargando } = useCatalogos();
    const [busquedaMateria, setBusquedaMateria] = useState('');

    const facultadSelec = facultades.find(f => f.nombre === form.facultad);
    const programasFiltrados = facultadSelec
        ? programas.filter(p => p.facultad_id === facultadSelec.id)
        : programas;

    const programaSelec = programas.find(p => p.nombre === form.programa && p.facultad_id === facultadSelec?.id);
    const materiasFiltradas = programaSelec
        ? materias.filter(m => m.programa_id === programaSelec.id && (!busquedaMateria.trim() || m.nombre.toLowerCase().includes(busquedaMateria.toLowerCase().trim()) || m.codigo.toLowerCase().includes(busquedaMateria.toLowerCase().trim())))
        : [];

    const opcionesSemestre = Array.from({ length: 10 }, (_, i) => ({
        valor: String(i + 1),
        label: `${i + 1}`
    }));

    const opcionesHoras = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const opcionesMinutos = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

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
                        <span>Facultad *</span>
                        <select 
                            value={form.facultad} 
                            onChange={e => setForm({ ...form, facultad: e.target.value, programa: '', asignatura: '' })}
                            disabled={cargando || facultades.length === 0}
                        >
                            <option value="">
                                {cargando ? 'Cargando...' : (facultades.length > 0 ? 'Seleccionar facultad...' : 'Sin opciones disponibles')}
                            </option>
                            {facultades.map(f => <option key={f.id} value={f.nombre}>{f.nombre}</option>)}
                        </select>
                    </label>
                    <label>
                        <span>Programa Académico *</span>
                        <select 
                            value={form.programa} 
                            onChange={e => setForm({ ...form, programa: e.target.value, asignatura: '' })}
                            disabled={cargando || !form.facultad || programasFiltrados.length === 0}
                        >
                            <option value="">
                                {cargando ? 'Cargando...' : (!form.facultad ? 'Selecciona una facultad' : (programasFiltrados.length > 0 ? 'Seleccionar programa...' : 'Sin opciones'))}
                            </option>
                            {programasFiltrados.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                        </select>
                    </label>
                </div>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
                    <span>Asignatura / Materia *</span>
                    {form.programa && (
                        <div style={{ position: 'relative', marginBottom: '6px' }}>
                            <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input 
                                type="text" 
                                placeholder="Nombre o código de asignatura..." 
                                value={busquedaMateria} 
                                onChange={e => setBusquedaMateria(e.target.value)} 
                                style={{ fontSize: '0.85rem', padding: '0.5rem 0.6rem 0.5rem 2.1rem', width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; }}
                                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                            />
                        </div>
                    )}
                    <select 
                        value={form.asignatura} 
                        onChange={e => set('asignatura', e.target.value)}
                        disabled={cargando || !form.programa || materiasFiltradas.length === 0}
                    >
                        <option value="">
                            {cargando ? 'Cargando...' : (!form.programa ? 'Selecciona un programa' : (materiasFiltradas.length > 0 ? 'Seleccionar asignatura...' : 'Sin opciones'))}
                        </option>
                        {materiasFiltradas.map(m => <option key={m.id} value={m.nombre}>{m.codigo} - {m.nombre}</option>)}
                    </select>
                </label>

                <div className="nsal-row-2">
                    <label>
                        <span>Semestre *</span>
                        <select value={form.semestre} onChange={e => set('semestre', e.target.value)}>
                            {opcionesSemestre.map(s => <option key={s.valor} value={s.valor}>{s.label}</option>)}
                        </select>
                    </label>
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
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <select 
                                value={(form.hora_inicio || '').split(':')[0] || ''} 
                                onChange={e => {
                                    const m = (form.hora_inicio || '').split(':')[1] || '00';
                                    set('hora_inicio', `${e.target.value}:${m}`);
                                }}
                                style={{ width: '75px', textAlign: 'center' }}
                            >
                                <option value="" disabled>HH</option>
                                {opcionesHoras.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <strong style={{ color: '#64748b', fontSize: '1.2rem', paddingBottom: '2px' }}>:</strong>
                            <select 
                                value={(form.hora_inicio || '').split(':')[1] || ''} 
                                onChange={e => {
                                    const h = (form.hora_inicio || '').split(':')[0] || '07';
                                    set('hora_inicio', `${h}:${e.target.value}`);
                                }}
                                style={{ width: '75px', textAlign: 'center' }}
                            >
                                <option value="" disabled>MM</option>
                                {opcionesMinutos.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </label>

                    <label>
                        <span>Hora de Llegada *</span>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <select 
                                value={(form.hora_fin || '').split(':')[0] || ''} 
                                onChange={e => {
                                    const m = (form.hora_fin || '').split(':')[1] || '00';
                                    setForm(f => ({ ...f, hora_fin: `${e.target.value}:${m}`, hora_fin_manual: true }));
                                }}
                                style={{ width: '75px', textAlign: 'center' }}
                            >
                                <option value="" disabled>HH</option>
                                {opcionesHoras.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <strong style={{ color: '#64748b', fontSize: '1.2rem', paddingBottom: '2px' }}>:</strong>
                            <select 
                                value={(form.hora_fin || '').split(':')[1] || ''} 
                                onChange={e => {
                                    const h = (form.hora_fin || '').split(':')[0] || '17';
                                    setForm(f => ({ ...f, hora_fin: `${h}:${e.target.value}`, hora_fin_manual: true }));
                                }}
                                style={{ width: '75px', textAlign: 'center' }}
                            >
                                <option value="" disabled>MM</option>
                                {opcionesMinutos.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
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
