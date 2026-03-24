// src/modulos/profesor/componentes/mapa/ModalAgregarParadaSugerencias.jsx
import React from 'react';
import Spinner from '@/shared/componentes/generales/Spinner/Spinner';
import BadgeMunicipio from '@/shared/componentes/generales/BadgeMunicipio/BadgeMunicipio';

export function SugerenciasMunicipios({
    form, setForm, buscandoPueblos, pueblos, 
    pagina, setPagina, POR_PAGINA, MOTIVOS_CON_BUSQUEDA
}) {
    if (!MOTIVOS_CON_BUSQUEDA.includes(form.motivo)) return null;

    return (
        <div className="mp-sugerencias">
            <span className="mp-label">
                {form.motivo === 'almuerzo' ? '🍽️ Municipios en ruta — elige dónde almorzar'
                    : form.motivo === 'refrigerio' ? '☕ Municipios en ruta — elige dónde tomar refrigerio'
                        : '🏘️ Municipios en la ruta — selecciona dónde pernoctar'}
            </span>
            {buscandoPueblos ? (
                <div className="mp-sug-loading">
                    <Spinner size={14} color="#3b82f6" />
                    Buscando municipios… (~3s)
                </div>
            ) : pueblos.length > 0 ? (
                <div className="mp-pueblos-paginado">
                    <div className="mp-pueblos-list">
                        {pueblos.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA).map(p => (
                            <button key={p.id} type="button" className="mp-pueblo-card"
                                onClick={() => {
                                    setForm(prev => ({
                                        ...prev,
                                        nombre: p.nombre,
                                        ubicacion: p.nombre + (p.depto ? `, ${p.depto}` : ''),
                                        lat: p.lat, lng: p.lng,
                                    }));
                                }}>
                                {p.foto
                                    ? <img src={p.foto} alt={p.nombre} className="mp-pueblo-img" />
                                    : <div className="mp-pueblo-img mp-pueblo-img--ph">🏘️</div>
                                }
                                <div className="mp-pueblo-body">
                                    <div className="mp-pueblo-nombre">{p.nombre}</div>
                                    <BadgeMunicipio km={p.kmDesdeOrigen} departamento={p.depto} />
                                    <p className="mp-pueblo-desc">{p.descripcion}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                    {/* Controles de paginado */}
                    {pueblos.length > POR_PAGINA && (
                        <div className="mp-paginado-ctrl">
                            <button className="mp-pag-btn" onClick={() => setPagina(p => Math.max(0, p - 1))} disabled={pagina === 0}>
                                ← Anterior
                            </button>
                            <span className="mp-pag-info">
                                {pagina + 1} / {Math.ceil(pueblos.length / POR_PAGINA)}
                                <small> &nbsp;({pueblos.length} municipios)</small>
                            </span>
                            <button className="mp-pag-btn" onClick={() => setPagina(p => Math.min(Math.ceil(pueblos.length / POR_PAGINA) - 1, p + 1))} disabled={(pagina + 1) * POR_PAGINA >= pueblos.length}>
                                Siguiente →
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="mp-empty-box">
                    <span className="mp-empty-text">No se encontraron municipios. Ingrese la ubicación manualmente.</span>
                </div>
            )}
        </div>
    );
}

export function ProgramacionItinerario({ form, set, fecha_inicio, fecha_fin }) {
    // Calculador de días intermedios (UX/UI Restoration)
    const fechasSugeridas = React.useMemo(() => {
        if (!fecha_inicio) return [];
        const f = [];
        let d1 = new Date(fecha_inicio + 'T00:00:00');
        let d2 = fecha_fin ? new Date(fecha_fin + 'T00:00:00') : d1;
        
        for (let d = new Date(d1); d <= d2; d.setDate(d.getDate() + 1)) {
            const dateObj = new Date(d);
            const iso = `${dateObj.getFullYear()}-${String(dateObj.getMonth()+1).padStart(2,'0')}-${String(dateObj.getDate()).padStart(2,'0')}`;
            f.push({ date: dateObj, iso });
        }
        return f;
    }, [fecha_inicio, fecha_fin]);

    const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

    return (
        <div className="mp-itinerario-section">
            <span className="mp-label mp-label--section">📅 Programación del Itinerario</span>
            
            {fechasSugeridas.length > 0 && (
                <div className="mp-campo">
                    <span className="mp-label">Día del viaje (Sugerido)</span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                        {fechasSugeridas.map((f, i) => {
                            const activa = form.fechaProgramada === f.iso;
                            return (
                                <button key={i} type="button" 
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        border: activa ? '2px solid #3b82f6' : '1px solid #cbd5e1',
                                        background: activa ? '#eff6ff' : '#f8fafc',
                                        color: activa ? '#1d4ed8' : '#334155',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem'
                                    }}
                                    onClick={() => set('fechaProgramada', activa ? '' : f.iso)}>
                                    <strong>Día {i+1}</strong> <span style={{opacity: 0.8}}>({f.date.getDate()} {MESES[f.date.getMonth()]})</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="mp-fila-2">
                <label className="mp-campo">
                    <span className="mp-label">Fecha Específica (Otra)</span>
                    <input className="mp-input" type="date" value={form.fechaProgramada}
                        onChange={e => set('fechaProgramada', e.target.value)} />
                </label>
                <label className="mp-campo">
                    <span className="mp-label">Hora programada</span>
                    <input className="mp-input" type="time" value={form.horaProgramada}
                        onChange={e => set('horaProgramada', e.target.value)} />
                </label>
            </div>
            <label className="mp-campo">
                <span className="mp-label">Notas del itinerario (Opcional)</span>
                <input className="mp-input" type="text" value={form.notasItinerario}
                    onChange={e => set('notasItinerario', e.target.value)}
                    placeholder="Ej: Confirmar reserva con anticipación…" />
            </label>
        </div>
    );
}

export function MotivoYDuracion({ form, set, MOTIVOS }) {
    return (
        <div className="mp-fila-2">
            <label className="mp-campo">
                <span className="mp-label">Motivo *</span>
                <select className="mp-select" value={form.motivo}
                    onChange={e => set('motivo', e.target.value)}>
                    {MOTIVOS.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>
            </label>
            <label className="mp-campo">
                <span className="mp-label">Duración Estimada</span>
                <div className="mp-tiempo-row">
                    <input className="mp-input mp-input--num" type="number" min="1" max="999"
                        value={form.tiempoCantidad}
                        onChange={e => set('tiempoCantidad', e.target.value)}
                        placeholder="Ej: 45" />
                    <select className="mp-select mp-select--unidad" value={form.tiempoUnidad}
                        onChange={e => set('tiempoUnidad', e.target.value)}>
                        <option value="min">Minutos</option>
                        <option value="horas">Horas</option>
                    </select>
                </div>
            </label>
        </div>
    );
}
