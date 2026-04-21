// src/modulos/profesor/componentes/mapa/PantallaParadaComponentesForm.jsx
import React from 'react';
import InputDireccion from '../InputDireccion/InputDireccion';
import { IcoInfo, IcoCal, IcoNota } from './PantallaParadaIconos';
import { MOTIVOS, PORTADAS_PARADA, COLORES_PARADA, fmtISO, fmtPill, fmtHumano } from './PantallaParadaHelpers';

export function BloqueApariencia({ form, set }) {
    return (
        <div className="pp-block pp-block--card" style={{ marginBottom: '16px' }}>
            <div className="pp-block-head">
                <div className="pp-block-ico pp-block-ico--info"><IcoInfo /></div>
                <h3 className="pp-block-title">Apariencia de la Tarjeta</h3>
            </div>
            <div className="pp-campo-group">
                <div className="pp-grid-2">
                    <div className="pp-campo">
                        <span className="pp-label">Imagen de la tarjeta</span>
                        <div className="pp-color-grid" style={{ display: 'flex', gap: '8px' }}>
                            {PORTADAS_PARADA.map(img => (
                                <div key={img.id} className={`pp-icono-btn ${form.icono === img.id ? 'active' : ''}`} style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: form.icono === img.id ? '2px solid #3b82f6' : '1px solid #e2e8f0' }} onClick={() => set('icono', img.id)} title={img.label}>
                                    <img src={img.id} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                            <div className={`pp-icono-btn ${!form.icono ? 'active' : ''}`} style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: !form.icono ? '2px solid #3b82f6' : '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', fontSize: '10px', color: '#64748b' }} onClick={() => set('icono', '')} title="Automático según motivo">
                                Auto
                            </div>
                        </div>
                    </div>
                    <div className="pp-campo">
                        <span className="pp-label">Color del borde/fondo</span>
                        <div className="pp-color-grid" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {COLORES_PARADA.map(c => (
                                <div key={c.hex} className={`pp-color-btn ${form.color === c.hex ? 'active' : ''}`} style={{ width: '25px', height: '25px', borderRadius: '50%', background: c.hex, cursor: 'pointer', border: form.color === c.hex ? '2px solid #0f172a' : '1px solid transparent', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} onClick={() => set('color', c.hex)} title={c.label}>
                                </div>
                            ))}
                            <div className={`pp-color-btn ${!form.color ? 'active' : ''}`} style={{ width: '25px', height: '25px', borderRadius: '50%', background: '#f1f5f9', cursor: 'pointer', border: !form.color ? '2px solid #0f172a' : '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }} onClick={() => set('color', '')} title="Automático según motivo">
                                A
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function BloqueInformacion({ form, set, handleUbi }) {
    return (
        <div className="pp-block pp-block--card">
            <div className="pp-block-head">
                <div className="pp-block-ico pp-block-ico--info"><IcoInfo /></div>
                <h3 className="pp-block-title">Información Principal</h3>
            </div>
            <div className="pp-campo-group">
                <label className="pp-campo pp-campo--full">
                    <span className="pp-label">Nombre de la Parada *</span>
                    <input className="pp-input pp-input--lg" type="text" value={form.nombre}
                        onChange={e => set('nombre', e.target.value)}
                        placeholder="Ej: Restaurante El Mirador" />
                </label>
                <div className="pp-grid-2">
                    <label className="pp-campo">
                        <span className="pp-label">Motivo de Parada *</span>
                        <select className="pp-select pp-select--lg" value={form.motivo}
                            onChange={e => set('motivo', e.target.value)}>
                            {MOTIVOS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                    </label>
                    <label className="pp-campo">
                        <span className="pp-label">Duración Estimada</span>
                        <div className="pp-tiempo-row">
                            <input className="pp-input pp-input--lg pp-input--num" type="number" min="1" max="999"
                                value={form.tiempoCantidad} onChange={e => set('tiempoCantidad', e.target.value)}
                                placeholder="Ej: 45" />
                            <select className="pp-select pp-select--lg pp-select--unidad" value={form.tiempoUnidad}
                                onChange={e => set('tiempoUnidad', e.target.value)}>
                                <option value="min">Min</option>
                                <option value="horas">Horas</option>
                            </select>
                        </div>
                    </label>
                </div>
                {form.motivo === 'otro' && (
                    <label className="pp-campo pp-campo--full">
                        <span className="pp-label">Especifique el motivo *</span>
                        <input className="pp-input" type="text" value={form.motivoOtro}
                            onChange={e => set('motivoOtro', e.target.value)}
                            placeholder="Describa el motivo detalladamente…" />
                    </label>
                )}
                <div className="pp-campo pp-campo--full">
                    <span className="pp-label">Parada Específica / Dirección *</span>
                    <InputDireccion label="" icono="📍"
                        valor={form.ubicacion} placeholder="Ej: Restaurante La Cabaña, Calle 1 #2-3..."
                        onChange={handleUbi} />
                </div>
            </div>
        </div>
    );
}

export function BloqueProgramacion({ form, set, fechasViaje, fechaInicioSalida, fechaFinSalida }) {
    return (
        <div className="pp-block pp-block--card">
            <div className="pp-block-head">
                <div className="pp-block-ico pp-block-ico--cal"><IcoCal /></div>
                <h3 className="pp-block-title">Programación del Itinerario</h3>
            </div>
            
            {fechasViaje.length > 0 && (
                <div className="pp-campo pp-campo--full">
                    <span className="pp-label">Día del viaje (Sugerido)</span>
                    <div className="pp-fechas-sugeridas">
                        {fechasViaje.map((fecha, i) => {
                            const iso = fmtISO(fecha);
                            const activa = form.fechaProgramada === iso;
                            return (
                                <button key={i} type="button"
                                    className={`pp-fecha-pill ${activa?'pp-fecha-pill--activa':''}`}
                                    onClick={() => set('fechaProgramada', activa ? '' : iso)}>
                                    <strong>Día {i+1}</strong> <span>{fmtPill(fecha)}</span>
                                </button>
                            );
                        })}
                    </div>
                    <span className="pp-fechas-hint">Rango del viaje: {fmtHumano(fechaInicioSalida)} — {fmtHumano(fechaFinSalida)}</span>
                </div>
            )}

            <div className="pp-grid-2" style={{ marginTop: '12px' }}>
                <label className="pp-campo">
                    <span className="pp-label">Fecha Específica</span>
                    <input className="pp-input" type="date" value={form.fechaProgramada}
                        onChange={e => set('fechaProgramada', e.target.value)}
                        min={fechaInicioSalida} max={fechaFinSalida} />
                </label>
                <label className="pp-campo">
                    <span className="pp-label">Hora (Aprox)</span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <select
                            className="pp-select"
                            value={(form.horaProgramada || '').split(':')[0] || ''}
                            onChange={e => {
                                const m = (form.horaProgramada || '').split(':')[1] || '00';
                                set('horaProgramada', `${e.target.value}:${m}`);
                            }}
                            style={{ width: '75px', textAlign: 'center' }}
                        >
                            <option value="" disabled>HH</option>
                            {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(h => (
                                <option key={h} value={h}>{h}</option>
                            ))}
                        </select>
                        <strong style={{ color: '#64748b', fontSize: '1.2rem' }}>:</strong>
                        <select
                            className="pp-select"
                            value={(form.horaProgramada || '').split(':')[1] || ''}
                            onChange={e => {
                                const h = (form.horaProgramada || '').split(':')[0] || '08';
                                set('horaProgramada', `${h}:${e.target.value}`);
                            }}
                            style={{ width: '75px', textAlign: 'center' }}
                        >
                            <option value="" disabled>MM</option>
                            {Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0')).map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                </label>
            </div>
        </div>
    );
}

export function BloqueNotas({ form, set }) {
    return (
        <div className="pp-block pp-block--card">
            <div className="pp-block-head">
                <div className="pp-block-ico pp-block-ico--nota"><IcoNota /></div>
                <h3 className="pp-block-title">Actividades y Notas</h3>
            </div>
            <div className="pp-campo-group">
                <label className="pp-campo pp-campo--full">
                    <span className="pp-label">Detalles de la Actividad</span>
                    <textarea className="pp-input" rows="2" value={form.actividad}
                        onChange={e => set('actividad', e.target.value)}
                        placeholder="Ej: Charla sobre fauna local. Pago en efectivo."></textarea>
                </label>
                <label className="pp-campo pp-campo--full">
                    <span className="pp-label">Notas Privadas / Recordatorios (Itinerario)</span>
                    <input className="pp-input" type="text" value={form.notasItinerario}
                        maxLength={15}
                        onChange={e => set('notasItinerario', e.target.value)}
                        placeholder="Ej: Llevar hidratación, contactar al guía." />
                    <small style={{ color: form.notasItinerario.length >= 15 ? '#ef4444' : '#94a3b8', fontSize: '0.7rem', textAlign: 'right' }}>
                        {form.notasItinerario.length}/15
                    </small>
                </label>
            </div>
        </div>
    );
}
