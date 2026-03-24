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
    const { facultades, programas, ventanas, cargando } = useCatalogos();

    const facultadSelec = facultades.find(f => f.nombre === form.facultad);
    const programasFiltrados = facultadSelec
        ? programas.filter(p => p.facultad_id === facultadSelec.id)
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
                        <select 
                            value={form.facultad} 
                            onChange={e => setForm({ ...form, facultad: e.target.value, programa: '' })}
                            disabled={cargando || facultades.length === 0}
                        >
                            <option value="">
                                {cargando ? 'Cargando...' : (facultades.length > 0 ? 'Seleccionar facultad...' : 'Sin opciones disponibles')}
                            </option>
                            {facultades.map(f => <option key={f.id} value={f.nombre}>{f.nombre}</option>)}
                        </select>
                    </label>
                </div>

                <div className="nsal-row-2">
                    <label>
                        <span>Programa Académico *</span>
                        <select 
                            value={form.programa} 
                            onChange={e => set('programa', e.target.value)}
                            disabled={cargando || !form.facultad || programasFiltrados.length === 0}
                        >
                            <option value="">
                                {cargando ? 'Cargando...' : (!form.facultad ? 'Selecciona una facultad primero' : (programasFiltrados.length > 0 ? 'Seleccionar programa...' : 'Sin opciones disponibles'))}
                            </option>
                            {programasFiltrados.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                        </select>
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
