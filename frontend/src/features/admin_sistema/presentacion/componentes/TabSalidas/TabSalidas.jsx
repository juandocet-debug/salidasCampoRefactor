import React, { useEffect, useState } from 'react';
import ModalConfirmar from '@/shared/componentes/generales/ModalConfirmar/ModalConfirmar';
import useAlertas from '@/shared/estado/useAlertas';

const API_URL    = 'http://localhost:8000/api/admin/salidas/';
const DETAIL_URL = 'http://localhost:8000/api/admin/salidas/';


const ESTADO_STYLE = {
    borrador:    { background: '#f1f5f9', color: '#64748b' },
    enviada:     { background: '#dbeafe', color: '#1d4ed8' },
    en_revision: { background: '#fef9c3', color: '#a16207' },
    aprobada:    { background: '#dcfce7', color: '#15803d' },
    favorable:   { background: '#d1fae5', color: '#065f46' },
    rechazada:   { background: '#fee2e2', color: '#b91c1c' },
};

// ── Componente auxiliar: fila de dato con label ──────────────────────────────
function Dato({ label, value }) {
    if (!value && value !== 0) return null;
    return (
        <div style={{ marginBottom: 14 }}>
            <p style={{ margin: '0 0 3px', fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
            <p style={{ margin: 0, color: '#334155', fontSize: 14, lineHeight: 1.6 }}>{value}</p>
        </div>
    );
}

// ── Componente auxiliar: lista de paradas (ida o retorno) ────────────────────
function SeccionParadas({ titulo, paradas = [], color = '#3b82f6' }) {
    if (!paradas.length) return null;
    return (
        <div style={{ marginBottom: 24 }}>
            <h4 style={{ margin: '0 0 12px', fontSize: 13, color, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
                {titulo} <span style={{ fontWeight: 400, color: '#94a3b8' }}>({paradas.length} paradas)</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {paradas.map((p, i) => (
                    <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <span style={{ background: color, color: '#fff', borderRadius: '50%', minWidth: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: '0 0 3px', fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{p.nombre || p.nombre_parada || 'Punto sin nombre'}</p>
                            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                                {[
                                    p.motivo && `Motivo: ${p.motivo}`,
                                    p.tiempo_estimado && `Tiempo: ${p.tiempo_estimado}`,
                                    p.actividad && `Actividad: ${p.actividad}`,
                                ].filter(Boolean).join(' · ')}
                            </p>
                            {p.fecha_programada && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>📅 {p.fecha_programada} {p.hora_programada || ''}</p>}
                            {p.notas_itinerario && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>"{p.notas_itinerario}"</p>}
                            {(p.latitud && p.longitud) && <p style={{ margin: '3px 0 0', fontSize: 11, color: '#a0aec0' }}>📍 {Number(p.latitud).toFixed(5)}, {Number(p.longitud).toFixed(5)}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Componente Principal ─────────────────────────────────────────────────────
export default function TabSalidas({ token }) {
    const [salidas, setSalidas]         = useState([]);
    const [cargando, setCargando]       = useState(true);
    const [confirmId, setConfirmId]     = useState(null);
    const [eliminando, setEliminando]   = useState(false);
    const [vistaConsultar, setVistaConsultar]       = useState(null);
    const [cargandoDetalle, setCargandoDetalle]     = useState(false);
    const agregarAlerta = useAlertas(s => s.agregarAlerta);

    // ── Cargar lista ─────────────────────────────────────────────────────────
    const cargar = async () => {
        setCargando(true);
        try {
            const res  = await fetch(API_URL, { headers: { Authorization: token ? `Bearer ${token}` : '' } });
            const json = await res.json();
            setSalidas(Array.isArray(json) ? json : []);
        } catch {
            agregarAlerta('Error al conectar con el servidor', 'error');
            setSalidas([]);
        } finally { setCargando(false); }
    };

    useEffect(() => { cargar(); }, []);

    // ── Abrir detalle completo ───────────────────────────────────────────────
    const abrirConsulta = async (s) => {
        setVistaConsultar(s);
        setCargandoDetalle(true);
        try {
            const res     = await fetch(`${DETAIL_URL}${s.id}/`, { headers: { Authorization: token ? `Bearer ${token}` : '' } });
            const detalle = await res.json();
            setVistaConsultar(prev => ({ ...prev, ...detalle }));
        } catch {
            // fallback: muestra lo que ya tenía de la lista
        } finally { setCargandoDetalle(false); }
    };

    // ── Eliminar ─────────────────────────────────────────────────────────────
    const eliminar = async () => {
        setEliminando(true);
        try {
            const res = await fetch(`${API_URL}${confirmId}/`, { method: 'DELETE', headers: { Authorization: token ? `Bearer ${token}` : '' } });
            if (res.status === 204 || res.ok) {
                agregarAlerta('Salida eliminada correctamente', 'exito');
                setSalidas(prev => prev.filter(s => s.id !== confirmId));
            } else { agregarAlerta('Error al eliminar la salida', 'error'); }
        } catch { agregarAlerta('Error de conexión al eliminar', 'error'); }
        finally { setEliminando(false); setConfirmId(null); }
    };

    // ────────────────────────────────────────────────────────────────────────
    //  VISTA DETALLE (cuando se abre una salida)
    // ────────────────────────────────────────────────────────────────────────
    if (vistaConsultar) {
        const s = vistaConsultar;
        const puntos        = s.puntos_ruta || [];
        const puntosIda     = puntos.filter(p => !p.es_retorno && p.motivo !== 'retorno');
        const puntosRetorno = puntos.filter(p =>  p.es_retorno || p.motivo === 'retorno');

        return (
            <div style={{ background: '#fff', padding: 28, borderRadius: 12, border: '1px solid #e2e8f0' }}>

                {/* ── Header ─────────────────────────────────────────────── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, borderBottom: '1px solid #e2e8f0', paddingBottom: 20 }}>
                    <div>
                        <button onClick={() => setVistaConsultar(null)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', marginBottom: 14 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                            Volver al listado
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                            <h2 style={{ margin: 0, color: '#0f172a', fontSize: 22 }}>{s.nombre}</h2>
                            <code style={{ background: '#f1f5f9', padding: '3px 10px', borderRadius: 6, fontSize: 12, color: '#475569', border: '1px solid #cbd5e1' }}>{s.codigo}</code>
                        </div>
                    </div>
                    <span style={{ ...(ESTADO_STYLE[s.estado?.toLowerCase()] || { background: '#f1f5f9', color: '#64748b' }), padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: '0.5px' }}>
                        {s.estado?.toUpperCase()}
                    </span>
                </div>

                {cargandoDetalle && (
                    <div style={{ textAlign: 'center', padding: 20, color: '#94a3b8', fontSize: 13 }}>⏳ Cargando detalle completo desde la base de datos...</div>
                )}

                {/* ── KPIs básicos ─────────────────────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 24, background: '#f8fafc', padding: 18, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    <Dato label="Asignatura"    value={s.asignatura} />
                    <Dato label="Semestre"      value={s.semestre} />
                    <Dato label="Fecha Inicio"  value={s.fecha_inicio} />
                    <Dato label="Fecha Fin"     value={s.fecha_fin} />
                    <Dato label="Hora Salida"   value={s.hora_inicio} />
                    <Dato label="Hora Fin"      value={s.hora_fin} />
                    <Dato label="Estudiantes"   value={s.num_estudiantes ? `${s.num_estudiantes} personas` : null} />
                    <Dato label="Distancia"     value={s.distancia_total_km ? `${s.distancia_total_km} km` : null} />
                    <Dato label="Duración"      value={s.duracion_dias ? `${s.duracion_dias} día(s)` : null} />
                    <Dato label="Horas Viaje"   value={s.horas_viaje ? `${s.horas_viaje} h` : null} />
                    <Dato label="Costo Estimado" value={s.costo_estimado ? `$${Number(s.costo_estimado).toLocaleString('es-CO')}` : null} />
                </div>

                {/* ── 2 Columnas: Académica + Logística ───────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                    <div style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 16px', fontSize: 12, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Información Académica</h4>
                        <Dato label="Facultad"             value={s.facultad} />
                        <Dato label="Programa"             value={s.programa} />
                        <Dato label="Resumen"              value={s.resumen} />
                        <Dato label="Justificación"        value={s.justificacion} />
                        <Dato label="Relación al Syllabus" value={s.relacion_syllabus} />
                        <Dato label="Objetivo General"     value={s.objetivo_general || s.planeacion?.obj_general} />
                        <Dato label="Obj. Específicos"     value={s.objetivos_especificos} />
                        <Dato label="Metodología"          value={s.estrategia_metodologica || s.planeacion?.metodologia} />
                        <Dato label="Productos Esperados"  value={typeof s.productos_esperados === 'string' ? s.productos_esperados : null} />
                        {Array.isArray(s.criterios_evaluacion) && s.criterios_evaluacion.length > 0 && (
                            <div style={{ marginBottom: 14 }}>
                                <p style={{ margin: '0 0 4px', fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Criterios de Evaluación</p>
                                {s.criterios_evaluacion.map((c, i) => (
                                    <p key={i} style={{ margin: '2px 0', color: '#334155', fontSize: 13 }}>• {typeof c === 'string' ? c : c.descripcion || c.criterio || JSON.stringify(c)}</p>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 16px', fontSize: 12, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Logística</h4>
                        <Dato label="Punto de Partida"       value={s.punto_partida} />
                        <Dato label="Destino / Punto Lejano" value={s.parada_max} />
                        <Dato label="Tipo Vehículo Cálculo"  value={s.tipo_vehiculo_calculo} />
                    </div>
                </div>

                {/* ── Itinerario Completo ──────────────────────────────── */}
                <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: 20 }}>
                    <h4 style={{ margin: '0 0 20px', fontSize: 12, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                        Itinerario Completo
                        <span style={{ fontSize: 11, fontWeight: 400, color: '#94a3b8' }}>({puntos.length} puntos en total)</span>
                    </h4>

                    {!puntos.length ? (
                        <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>
                            {cargandoDetalle ? 'Cargando paradas...' : 'Esta salida no tiene paradas registradas en el itinerario todavía.'}
                        </p>
                    ) : (
                        <>
                            <SeccionParadas titulo="Ruta de IDA" paradas={puntosIda} color="#3b82f6" />
                            <SeccionParadas titulo="Ruta de RETORNO" paradas={puntosRetorno} color="#8b5cf6" />
                        </>
                    )}
                </div>
            </div>
        );
    }

    // ────────────────────────────────────────────────────────────────────────
    //  VISTA TABLA (listado principal)
    // ────────────────────────────────────────────────────────────────────────
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <span style={{ fontSize: 13, color: '#94a3b8' }}>{salidas.length} salida{salidas.length !== 1 ? 's' : ''} en el sistema</span>
                <button className="herr-btn herr-btn--ghost herr-btn--sm" onClick={cargar}>↻ Recargar</button>
            </div>

            <div className="herr-tabla-wrapper">
                {cargando ? (
                    <div className="herr-vacio">Cargando salidas...</div>
                ) : salidas.length === 0 ? (
                    <div className="herr-vacio">No hay salidas en la base de datos.</div>
                ) : (
                    <table className="herr-tabla">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre / Asignatura</th>
                                <th>Estado</th>
                                <th>Semestre</th>
                                <th>Fecha Inicio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salidas.map(s => (
                                <tr key={s.id}>
                                    <td><code style={{ background: '#f1f5f9', padding: '2px 7px', borderRadius: 4, fontSize: 12 }}>{s.codigo}</code></td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{s.nombre}</div>
                                        {s.asignatura && <div style={{ fontSize: 12, color: '#94a3b8' }}>{s.asignatura}</div>}
                                    </td>
                                    <td>
                                        <span style={{ ...(ESTADO_STYLE[s.estado] || { background: '#f1f5f9', color: '#64748b' }), padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                                            {s.estado?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{s.semestre || '—'}</td>
                                    <td>{s.fecha_inicio || '—'}</td>
                                    <td>
                                        <div className="herr-acciones">
                                            <button className="herr-action-circle" title="Consultar salida (Solo lectura)"
                                                onClick={() => abrirConsulta(s)}
                                                style={{ color: '#0ea5e9', borderColor: '#e0f2fe', background: '#f0f9ff' }}>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                                                </svg>
                                            </button>
                                            <button className="herr-action-circle herr-action-circle--delete" title="Eliminar salida"
                                                onClick={() => setConfirmId(s.id)}>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {confirmId && (
                <ModalConfirmar
                    titulo="¿Eliminar esta salida?"
                    descripcion="Esta acción es irreversible. Se eliminará la salida y todos sus datos asociados del sistema."
                    labelConfirmar="Sí, eliminar" labelCargando="Eliminando..."
                    cargando={eliminando} onConfirmar={eliminar} onCancelar={() => setConfirmId(null)}
                />
            )}
        </div>
    );
}
