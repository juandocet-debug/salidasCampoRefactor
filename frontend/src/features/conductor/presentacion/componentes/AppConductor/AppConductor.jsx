import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { loginConductor, obtenerMisViajes, obtenerDetalleSalida, comentarParada, reportarNovedad, notificarLlegada, finalizarViaje, obtenerEstudiantesSalida, marcarCheckpoint, desmarcarCheckpoint, obtenerCheckpoints } from '@/features/conductor/aplicacion/ConductorServicios';
import { ICONOS, PORTADAS, ETAPAS_STEPPER, colorEsClaro } from '@/features/salidas/presentacion/componentes/ListaTarjetasProfesor/constantesTarjetas';
import '@/features/salidas/presentacion/componentes/ListaTarjetasProfesor/ListaTarjetasProfesor.css';
import ModalConfirmar from '@/shared/componentes/generales/ModalConfirmar/ModalConfirmar';
import './AppConductor.css';

const DIAS_CORTOS  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const MESES_CORTOS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function fmtFechaHora(fecha, hora) {
  if (!fecha) return null;
  const d = new Date(fecha + 'T00:00:00');
  return { dia: DIAS_CORTOS[d.getDay()], fecha: `${d.getDate()} ${MESES_CORTOS[d.getMonth()]}`, hora: hora ? hora.slice(0,5) : null };
}

const truncarPalabras = (texto, max = 14) => {
  if (!texto) return '';
  const palabras = texto.split(/\s+/);
  return palabras.length > max ? palabras.slice(0, max).join(' ') + '...' : texto;
};

const IMG_BUS = 'https://i.ibb.co/L5kXZ7B/carretera.png'; // Placeholder imagen carretera/bus
const IMG_UPN = 'https://i.ibb.co/HfF3ZTrD/uopn-bklanco.png';
const TAGLINE = 'Seguridad y puntualidad en cada ruta';

// ── Íconos SVG ─────────────────────────────────────────────────────────────
const IcoId      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><circle cx="8.5" cy="11.5" r="2.5"/><line x1="14" y1="10" x2="20" y2="10"/><line x1="14" y1="14" x2="20" y2="14"/></svg>;
const IcoPhone   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IcoHome    = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcoChecklist=()=> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>;
const IcoAlert   = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IcoUser    = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoBell    = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IcoLogOut  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcoCamera  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;

function CronometroEnVivo({ notaCambio }) {
    const [tiempo, setTiempo] = useState('00:00:00');

    useEffect(() => {
        let startTime = new Date();
        if (notaCambio) {
            const match = notaCambio.match(/\((\d{2}):(\d{2})\)/);
            if (match) {
                const now = new Date();
                now.setHours(parseInt(match[1]), parseInt(match[2]), 0, 0);
                if (now <= new Date()) startTime = now;
            }
        }

        const interval = setInterval(() => {
            const diff = Math.floor((new Date() - startTime) / 1000);
            const hrs = Math.floor(diff / 3600).toString().padStart(2, '0');
            const mins = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
            const secs = (diff % 60).toString().padStart(2, '0');
            setTiempo(`${hrs}:${mins}:${secs}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [notaCambio]);

    return (
        <div style={{ textAlign: 'center', margin: '20px 0', padding: '15px', background: 'var(--bg-active)', borderRadius: '12px', border: '1px solid var(--cyan-500)', boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)' }}>
            <span style={{ display: 'block', color: 'var(--cyan-400)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Tiempo de Servicio Activo</span>
            <span style={{ display: 'block', fontSize: '2.5rem', fontWeight: '800', color: 'white', letterSpacing: '2px', fontFamily: 'monospace' }}>
                {tiempo}
            </span>
        </div>
    );
}

// ── TABS ───────────────────────────────────────────────────────────────────

function TabMisViajes({ conductor, token }) {
    const [viajes, setViajes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [salidaSeleccionada, setSalidaSeleccionada] = useState(null);
    const [detallesSalida, setDetallesSalida] = useState(null);
    const [cargandoDetalles, setCargandoDetalles] = useState(false);
    const [modalConfig, setModalConfig] = useState(null);

    useEffect(() => {
        obtenerMisViajes(conductor.id, token)
            .then(data => setViajes(data))
            .catch(err => console.error(err))
            .finally(() => setCargando(false));
    }, [conductor.id, token]);

    const abrirDetalle = (salida) => {
        setSalidaSeleccionada(salida);
        setCargandoDetalles(true);
        obtenerDetalleSalida(salida.id)
            .then(data => setDetallesSalida(data))
            .catch(err => console.error(err))
            .finally(() => setCargandoDetalles(false));
    };

    const handleNotificarLlegada = () => {
        setModalConfig({
            titulo: 'Notificar Llegada',
            descripcion: '¿Confirmas que ya has llegado al punto de encuentro? Esto iniciará el conteo de tiempo real para el viaje.',
            labelConfirmar: 'Sí, ya llegué',
            labelCancelar: 'Cancelar',
            tipo: 'exito',
            onCancelar: () => setModalConfig(null),
            onConfirmar: () => {
                setModalConfig(prev => ({ ...prev, cargando: true, labelCargando: 'Notificando...' }));
                notificarLlegada(salidaSeleccionada.id, token)
                    .then(() => {
                        setModalConfig({
                            titulo: '¡Llegada Notificada!',
                            descripcion: 'Se ha registrado tu llegada exitosamente.',
                            labelConfirmar: 'Aceptar',
                            tipo: 'exito',
                            onConfirmar: () => {
                                setModalConfig(null);
                                setSalidaSeleccionada(prev => ({...prev, estado: 'en_ejecucion'}));
                                // Also update the trip in the list so it doesn't disappear from the local array before a refresh
                                setViajes(prev => prev.map(v => v.id === salidaSeleccionada.id ? {...v, estado: 'en_ejecucion'} : v));
                            },
                            onCancelar: () => setModalConfig(null)
                        });
                    })
                    .catch(err => {
                        setModalConfig({
                            titulo: 'Error',
                            descripcion: 'Error: ' + err.message,
                            labelConfirmar: 'Cerrar',
                            tipo: 'peligro',
                            onConfirmar: () => setModalConfig(null),
                            onCancelar: () => setModalConfig(null)
                        });
                    });
            }
        });
    };

    const handleFinalizarViaje = () => {
        setModalConfig({
            titulo: 'Finalizar Viaje',
            descripcion: '¿Confirmas que el viaje ha concluido en el destino final y deseas detener el tiempo?',
            labelConfirmar: 'Sí, finalizar viaje',
            labelCancelar: 'Cancelar',
            tipo: 'accion',
            onCancelar: () => setModalConfig(null),
            onConfirmar: () => {
                setModalConfig(prev => ({ ...prev, cargando: true, labelCargando: 'Finalizando...' }));
                finalizarViaje(salidaSeleccionada.id, token)
                    .then(() => {
                        setModalConfig({
                            titulo: '¡Viaje Finalizado!',
                            descripcion: 'Se ha registrado la finalización del servicio.',
                            labelConfirmar: 'Aceptar',
                            tipo: 'exito',
                            onConfirmar: () => {
                                setModalConfig(null);
                                setSalidaSeleccionada(prev => ({...prev, estado: 'finalizada'}));
                                setViajes(prev => prev.map(v => v.id === salidaSeleccionada.id ? {...v, estado: 'finalizada'} : v));
                            },
                            onCancelar: () => setModalConfig(null)
                        });
                    })
                    .catch(err => {
                        setModalConfig({
                            titulo: 'Error',
                            descripcion: 'Error: ' + err.message,
                            labelConfirmar: 'Cerrar',
                            tipo: 'peligro',
                            onConfirmar: () => setModalConfig(null),
                            onCancelar: () => setModalConfig(null)
                        });
                    });
            }
        });
    };

    const handleReportarFaltaItinerario = () => {
        setModalConfig({
            titulo: 'Reportar falta de itinerario',
            descripcion: '¿Desea reportar que esta salida no tiene un itinerario asignado? Esto enviará una alerta urgente al coordinador.',
            labelConfirmar: 'Sí, reportar',
            labelCancelar: 'Cancelar',
            tipo: 'peligro',
            onConfirmar: () => {
                setModalConfig(prev => ({ ...prev, cargando: true, labelCargando: 'Reportando...' }));
                reportarNovedad(salidaSeleccionada.id, 'alta', 'No hay itinerario creado para esta salida.', token)
                    .then(() => {
                        setModalConfig({
                            titulo: '¡Reporte enviado!',
                            descripcion: 'Novedad reportada correctamente al sistema.',
                            labelConfirmar: 'Aceptar',
                            tipo: 'exito',
                            onConfirmar: () => setModalConfig(null),
                            onCancelar: () => setModalConfig(null)
                        });
                    })
                    .catch(err => {
                        setModalConfig({
                            titulo: 'Error',
                            descripcion: 'Error: ' + err.message,
                            labelConfirmar: 'Cerrar',
                            tipo: 'peligro',
                            onConfirmar: () => setModalConfig(null),
                            onCancelar: () => setModalConfig(null)
                        });
                    });
            },
            onCancelar: () => setModalConfig(null)
        });
    };

    const handleComentarParada = (paradaId) => {
        const comentario = window.prompt('Añade un comentario para esta parada:');
        if (!comentario) return;
        comentarParada(paradaId, comentario, token)
            .then(() => {
                alert('Comentario guardado.');
                // Refresh details
                abrirDetalle(salidaSeleccionada);
            })
            .catch(err => alert('Error: ' + err.message));
    };

    const renderDetalle = () => {
        if (!salidaSeleccionada) return null;
        const s = salidaSeleccionada;
        const esUrgente = s.color === '#ef4444' || (s.nota_cambio && s.nota_cambio.includes('URGENTE'));
        const IcoComp = esUrgente ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        ) : (ICONOS[s.icono] || ICONOS['IcoMap']);
        const d = detallesSalida;

        return createPortal(
            <div className="det__overlay" onClick={() => setSalidaSeleccionada(null)}>
                <div className="det__sheet" onClick={e => e.stopPropagation()} style={{ height: '100dvh', maxHeight: '100dvh', borderRadius: 0 }}>
                    <div className="det__hero" style={{ background: s.color || '#4A8DAC' }}>
                        <div className="det__handle" />
                        {PORTADAS[s.icono] && !esUrgente ? (
                            <img src={PORTADAS[s.icono]} className="det__hero-img" alt="" />
                        ) : (
                            <div className="det__hero-icon">{IcoComp}</div>
                        )}
                        <div className="det__hero-overlay" />
                        <div className="det__hero-content">
                            <span className="det__badge">{(s.estado || 'sin_estado').replace(/_/g, ' ').toUpperCase()}</span>
                            <h2 className="det__hero-title">{s.nombre || 'Sin Nombre'}</h2>
                            {s.codigo && <span className="det__hero-code"># {s.codigo}</span>}
                        </div>
                        <button className="det__close" onClick={() => setSalidaSeleccionada(null)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>

                    <div className="det__body">
                        {s.estado === 'en_ejecucion' && (
                            <CronometroEnVivo notaCambio={s.nota_cambio} />
                        )}
                        
                        {(s.estado === 'finalizada') && (
                            <div style={{ textAlign: 'center', margin: '20px 0', padding: '15px', background: 'rgba(100, 116, 139, 0.2)', borderRadius: '12px', border: '1px solid #64748b' }}>
                                <span style={{ display: 'block', color: '#cbd5e1', fontSize: '1rem', fontWeight: 'bold' }}>✓ Viaje Finalizado</span>
                            </div>
                        )}

                        {(!s.estado || (s.estado !== 'en_ejecucion' && s.estado !== 'finalizada')) && (
                            <button 
                                onClick={handleNotificarLlegada}
                                style={{ width: '100%', marginBottom: '20px', padding: '16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                Notificar Llegada al Punto
                            </button>
                        )}
                        
                        {s.estado === 'en_ejecucion' && (
                            <button 
                                onClick={handleFinalizarViaje}
                                style={{ width: '100%', marginBottom: '20px', padding: '16px', background: 'var(--rojo)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(239, 68, 68, 0.2)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                                Finalizar Viaje
                            </button>
                        )}
                        <div className="det__section">
                            <p className="det__section-title">Itinerario de la Salida</p>

                            {/* Resumen Básico */}
                            {(s.punto_partida || s.destino) && (
                                <div style={{ marginBottom: '20px' }}>
                                    {s.punto_partida && (
                                        <div className="det__itinerary-row">
                                            <div className="det__itin-dot det__itin-dot--start" />
                                            <div className="det__itin-text">
                                                <span className="det__info-label">Punto de partida</span>
                                                <span className="det__info-val">{s.punto_partida}</span>
                                            </div>
                                        </div>
                                    )}
                                    {s.punto_partida && s.destino && <div className="det__itin-line" />}
                                    {s.destino && (
                                        <div className="det__itinerary-row">
                                            <div className="det__itin-dot det__itin-dot--end" />
                                            <div className="det__itin-text">
                                                <span className="det__info-label">Destino / Paradas</span>
                                                <span className="det__info-val">{s.destino}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {cargandoDetalles ? (
                                <p>Cargando detalles específicos del itinerario...</p>
                            ) : (!d?.itinerario_id || !d?.puntos_ruta || d.puntos_ruta.length === 0) ? (
                                <div className="app-cond__empty-state" style={{ margin: '20px 0', padding: '20px', background: 'rgba(245,158,11,0.1)', borderRadius: '12px' }}>
                                    <IcoAlert />
                                    <p style={{ color: '#d97706', fontWeight: 'bold' }}>No hay itinerario creado</p>
                                    <small style={{ color: '#b45309' }}>No se ha definido una ruta para esta salida, por lo que no se conoce el desplazamiento.</small>
                                    <button 
                                        onClick={handleReportarFaltaItinerario}
                                        style={{ marginTop: '10px', background: '#f59e0b', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                                        Reportar falta de itinerario
                                    </button>
                                </div>
                            ) : (
                                <div className="det__itinerary-list">
                                    {d.puntos_ruta.map((p, idx) => (
                                        <div key={idx} className="det__itinerary-row" style={{ marginBottom: '16px' }}>
                                            <div className="det__itin-dot det__itin-dot--start" />
                                            <div className="det__itin-text" style={{ flex: 1 }}>
                                                <span className="det__info-label">Parada {p.orden}</span>
                                                <span className="det__info-val">{p.nombre}</span>
                                                {p.notas_itinerario && <p style={{ fontSize: '0.75rem', color: '#10b981', margin: '4px 0' }}>💬 {p.notas_itinerario}</p>}
                                                <button 
                                                    onClick={() => handleComentarParada(p.id)}
                                                    style={{ marginTop: '6px', fontSize: '0.7rem', padding: '4px 10px', background: '#16a34a', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: '#e2e8f0', cursor: 'pointer' }}>
                                                    Añadir comentario
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    return (
        <div className="app-cond__tab-content anim-slide-up">
            <h2 className="app-cond__section-title">Rutas Asignadas</h2>
            {cargando ? (
                <p className="app-cond__loading">Cargando tus viajes...</p>
            ) : viajes.length === 0 ? (
                <div className="app-cond__empty-state">
                    <IcoHome />
                    <p>No tienes viajes asignados actualmente.</p>
                </div>
            ) : (
                <div className="app-cond__list">
                    {viajes.map(salida => {
                        const esUrgente = salida.color === '#ef4444' || (salida.nota_cambio && salida.nota_cambio.includes('URGENTE'));
                        const IcoComp = esUrgente ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        ) : (ICONOS[salida.icono] || ICONOS['IcoMap']);
                        const cardColor = salida.color || '#4A8DAC';
                        const isLight   = colorEsClaro(cardColor);
                        const claseTema = isLight ? 'card-new--light' : 'card-new--dark';
                        const sal = fmtFechaHora(salida.fecha_salida, salida.hora_salida);
                        const lle = fmtFechaHora(salida.fecha_regreso, salida.hora_regreso);

                        return (
                            <div
                                key={salida.id}
                                className={`card-new ${claseTema}`}
                                style={{ background: isLight ? '#ffffff' : cardColor, cursor: 'pointer' }}
                                onClick={() => abrirDetalle(salida)}
                            >
                                {PORTADAS[salida.icono] && !esUrgente ? (
                                    <div className="card-new__bg-icon" style={{ opacity:1, width:'220px', height:'220px', right:'-10px', top:'auto', bottom:'-10px', transform:'rotate(-5deg)', zIndex:0 }}>
                                        <img src={PORTADAS[salida.icono]} alt="" style={{ width:'100%', height:'100%', objectFit:'contain', mixBlendMode:'multiply' }} />
                                    </div>
                                ) : (
                                    <div className="card-new__bg-icon">{IcoComp}</div>
                                )}

                                <div className="card-new__content" style={{ zIndex:1 }}>
                                    <div className="card-new__header">
                                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%'}}>
                                            <h3 className="card-new__title">{salida.nombre || 'Sin Nombre'}</h3>
                                            <span className="app-cond__badge" style={{position:'static', fontSize:'10px', padding:'2px 6px', height:'auto'}}>{(salida.estado || 'sin_estado').replace(/_/g, ' ').toUpperCase()}</span>
                                        </div>
                                        <p className="card-new__subtitle">
                                            #{salida.codigo} | {[salida.facultad, salida.asignatura].filter(Boolean).join(' | ')}
                                        </p>
                                    </div>
                                    {(sal || lle) && (
                                        <div className="card-ticket">
                                            <div className="card-ticket__col">
                                                <span className="card-ticket__label">✈️ Salida</span>
                                                <span className="card-ticket__fecha-main">{sal?.dia} {sal?.fecha}</span>
                                                {sal?.hora && <span className="card-ticket__hora-sub">{sal.hora}</span>}
                                            </div>
                                            <div className="card-ticket__sep">→</div>
                                            <div className="card-ticket__col card-ticket__col--llegada">
                                                <span className="card-ticket__label">🏁 Llegada</span>
                                                <span className="card-ticket__fecha-main">{lle?.dia} {lle?.fecha}</span>
                                                {lle?.hora && <span className="card-ticket__hora-sub card-ticket__hora-sub--llegada">{lle.hora}</span>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {salidaSeleccionada && renderDetalle()}
            {modalConfig && createPortal(<ModalConfirmar {...modalConfig} />, document.body)}
        </div>
    );
}

function TabChecklist({ conductor, token }) {
    const [viajes, setViajes]               = useState([]);
    const [cargandoViajes, setCargandoViajes] = useState(true);
    const [salidaActiva, setSalidaActiva]   = useState(null);
    const [estudiantes, setEstudiantes]     = useState([]);
    const [cargandoEst, setCargandoEst]     = useState(false);
    const [presentes, setPresentes]         = useState({});   // { [id]: true|false }
    const [busqueda, setBusqueda]           = useState('');
    const [errorEst, setErrorEst]           = useState(null);

    // Carga los viajes del conductor al montar
    useEffect(() => {
        obtenerMisViajes(conductor.id, token)
            .then(data => setViajes(data))
            .catch(() => {})
            .finally(() => setCargandoViajes(false));
    }, [conductor.id, token]);

    const seleccionarSalida = useCallback((salida) => {
        setSalidaActiva(salida);
        setCargandoEst(true);
        setEstudiantes([]);
        setPresentes({});
        setBusqueda('');
        setErrorEst(null);
        obtenerEstudiantesSalida(salida.id)
            .then(data => {
                setEstudiantes(data);
                // Inicializar todos como pendiente (null)
                const init = {};
                data.forEach(e => { init[e.id] = null; });
                setPresentes(init);
            })
            .catch(err => setErrorEst(err.message || 'No se pudieron cargar los estudiantes.'))
            .finally(() => setCargandoEst(false));
    }, []);

    const marcar = (id, valor) => {
        setPresentes(prev => ({ ...prev, [id]: valor }));
    };

    // ── Pantalla 1: elegir viaje ──────────────────────────────────────────────
    if (!salidaActiva) {
        return (
            <div className="app-cond__tab-content anim-slide-up">
                <h2 className="app-cond__section-title">Lista de Pasajeros</h2>
                <p style={{ color: '#94a3b8', marginBottom: '20px', fontSize: '0.9rem' }}>
                    Selecciona la ruta para ver y marcar la asistencia de los estudiantes.
                </p>

                {cargandoViajes ? (
                    <p className="app-cond__loading">Cargando rutas...</p>
                ) : viajes.length === 0 ? (
                    <div className="app-cond__empty-state">
                        <IcoChecklist />
                        <p>No tienes rutas asignadas.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {viajes.map(v => (
                            <button
                                key={v.id}
                                onClick={() => seleccionarSalida(v)}
                                style={{
                                    width: '100%', textAlign: 'left', background: 'var(--gradiente-card)',
                                    border: '1px solid var(--borde-suave)', borderLeft: '4px solid var(--app-cyan)',
                                    borderRadius: '16px', padding: '18px 20px', cursor: 'pointer',
                                    color: 'var(--text-primario)', display: 'flex', alignItems: 'center',
                                    gap: '16px', transition: 'transform 0.15s, box-shadow 0.15s',
                                }}
                                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
                                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '12px',
                                    background: 'var(--bg-active)', border: '1px solid var(--borde-suave)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0, color: 'var(--app-cyan)'
                                }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '2px',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {v.nombre}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                        #{v.codigo} &bull; {(v.estado || '').replace(/_/g,' ')}
                                    </div>
                                </div>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--app-cyan)" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // ── Pantalla 2: lista de estudiantes ─────────────────────────────────────
    const totalPresentes = Object.values(presentes).filter(v => v === true).length;
    const totalAusentes  = Object.values(presentes).filter(v => v === false).length;
    const totalPendientes = Object.values(presentes).filter(v => v === null).length;
    const total = estudiantes.length;
    const pct = total > 0 ? Math.round((totalPresentes / total) * 100) : 0;

    const estudiantesFiltrados = estudiantes.filter(e => {
        const q = busqueda.toLowerCase();
        return !busqueda ||
            (e.nombre_completo || e.nombre || '').toLowerCase().includes(q) ||
            (e.numero_documento || '').toLowerCase().includes(q);
    });

    return (
        <div className="app-cond__tab-content anim-slide-up" style={{ paddingBottom: '100px' }}>
            {/* Cabecera con volver */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <button
                    onClick={() => setSalidaActiva(null)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', padding: 0 }}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 className="app-cond__section-title" style={{ margin: 0, fontSize: '1.1rem' }}>
                        {salidaActiva.nombre}
                    </h2>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>#{salidaActiva.codigo}</span>
                </div>
            </div>

            {/* Barra de progreso */}
            <div style={{ background: 'var(--bg-active)', borderRadius: '16px',
                padding: '16px 20px', marginBottom: '20px', border: '1px solid var(--borde-suave)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Asistencia</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: pct === 100 ? '#10b981' : 'white' }}>
                        {totalPresentes}<span style={{ fontSize: '0.9rem', fontWeight: 400, color: '#64748b' }}>/{total}</span>
                    </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#10b981' : 'var(--app-cyan)',
                        borderRadius: '4px', transition: 'width 0.4s ease' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>✓ {totalPresentes} presentes</span>
                    <span style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 700 }}>✗ {totalAusentes} ausentes</span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>? {totalPendientes} pendientes</span>
                </div>
            </div>

            {/* Buscador */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
                <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                    type="text"
                    placeholder="Buscar por nombre o documento..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    style={{ width: '100%', padding: '13px 16px 13px 40px', borderRadius: '12px',
                        border: '1px solid var(--borde-suave)', background: 'var(--bg-active)',
                        color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
            </div>

            {/* Contenido */}
            {cargandoEst ? (
                <p className="app-cond__loading">Cargando estudiantes...</p>
            ) : errorEst ? (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '12px', padding: '16px', color: '#fca5a5', fontSize: '0.9rem' }}>
                    ⚠️ {errorEst}
                </div>
            ) : estudiantesFiltrados.length === 0 ? (
                <div className="app-cond__empty-state">
                    <IcoUser />
                    <p>{busqueda ? 'Sin resultados para esa búsqueda.' : 'No hay estudiantes inscritos.'}</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {estudiantesFiltrados.map(est => {
                        const estado = presentes[est.id];  // null | true | false
                        const nombre = est.nombre_completo || [est.nombre, est.apellido].filter(Boolean).join(' ') || 'Estudiante';
                        const doc    = est.numero_documento || est.documento || '';
                        const foto   = est.foto_url || est.foto || null;
                        const estadoInscripcion = est.estado || '';

                        return (
                            <div key={est.id} style={{
                                display: 'flex', alignItems: 'center', gap: '14px',
                                background: estado === true  ? 'rgba(16,185,129,0.1)'
                                          : estado === false ? 'rgba(239,68,68,0.08)'
                                          : 'var(--gradiente-card)',
                                border: `1px solid ${estado === true ? 'rgba(16,185,129,0.3)' : estado === false ? 'rgba(239,68,68,0.2)' : 'var(--borde-suave)'}`,
                                borderRadius: '14px', padding: '12px 14px',
                                transition: 'all 0.2s',
                            }}>
                                {/* Foto o iniciales */}
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                                    background: foto ? 'transparent' : '#334155',
                                    border: `2px solid ${estado === true ? '#10b981' : estado === false ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                                    overflow: 'hidden', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700,
                                    color: '#94a3b8',
                                }}>
                                    {foto
                                        ? <img src={foto} alt={nombre} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                                        : nombre.charAt(0).toUpperCase()}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'white',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {nombre}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                                        {doc && <span>Doc: {doc}</span>}
                                        {estadoInscripcion && (
                                            <span style={{
                                                marginLeft: doc ? '8px' : 0,
                                                padding: '1px 7px', borderRadius: '20px', fontSize: '0.68rem',
                                                background: estadoInscripcion === 'autorizado' ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.2)',
                                                color: estadoInscripcion === 'autorizado' ? '#34d399' : '#94a3b8',
                                                fontWeight: 600
                                            }}>
                                                {estadoInscripcion}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Botones de check-in */}
                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                    <button
                                        onClick={() => marcar(est.id, estado === true ? null : true)}
                                        title="Presente"
                                        style={{
                                            width: '40px', height: '40px', borderRadius: '10px', border: 'none',
                                            background: estado === true ? '#10b981' : 'rgba(16,185,129,0.12)',
                                            color: estado === true ? 'white' : '#10b981',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', transition: 'all 0.15s',
                                            fontSize: '1.2rem',
                                        }}
                                    >✓</button>
                                    <button
                                        onClick={() => marcar(est.id, estado === false ? null : false)}
                                        title="Ausente"
                                        style={{
                                            width: '40px', height: '40px', borderRadius: '10px', border: 'none',
                                            background: estado === false ? '#ef4444' : 'rgba(239,68,68,0.1)',
                                            color: estado === false ? 'white' : '#ef4444',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', transition: 'all 0.15s',
                                            fontSize: '1.2rem',
                                        }}
                                    >✗</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Banner flotante si todos marcados */}
            {total > 0 && totalPendientes === 0 && (
                <div style={{
                    position: 'fixed', bottom: '90px', left: '50%', transform: 'translateX(-50%)',
                    background: pct === 100 ? '#10b981' : '#1e293b',
                    color: 'white', borderRadius: '40px', padding: '12px 24px',
                    fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.15)', whiteSpace: 'nowrap',
                    animation: 'fadeIn 0.3s ease',
                }}>
                    {pct === 100 ? '🎉 ¡Todos presentes!' : `⚠️ ${totalAusentes} estudiante${totalAusentes !== 1 ? 's' : ''} ausente${totalAusentes !== 1 ? 's' : ''}`}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB NOTIFICAR — Itinerario con checkpoints + novedad por parada
// ─────────────────────────────────────────────────────────────────────────────
const NIVEL_META = {
    baja:    { label: 'Baja',    color: '#22d3ee', bg: 'rgba(34,211,238,0.1)' },
    media:   { label: 'Media',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    alta:    { label: 'Alta',    color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
    critica: { label: 'Crítica', color: '#ef4444', bg: 'rgba(239,68,68,0.1)'  },
};

function TabNotificar({ conductor, token, reportadoPor = 'conductor' }) {
    const [viajes,        setViajes]        = useState([]);
    const [cargandoV,     setCargandoV]     = useState(true);
    const [salidaActiva,  setSalidaActiva]  = useState(null);
    const [detalle,       setDetalle]       = useState(null);
    const [cargandoD,     setCargandoD]     = useState(false);
    const [checks,        setChecks]        = useState({});  
    const [saving,        setSaving]        = useState(null);
    const [diaSeleccionado, setDiaSeleccionado] = useState(null);
    
    // Modal Confirmación Hora
    const [modalHora,     setModalHora]     = useState(null);
    const [horaConfirmacion, setHoraConfirmacion] = useState('');

    const [novedadOpen,   setNovedadOpen]   = useState(null);
    const [novForm,       setNovForm]       = useState({ nivel: 'media', mensaje: '', foto: '' });
    const [novSaving,     setNovSaving]     = useState(false);
    const [novOk,         setNovOk]         = useState(false);
    const [novError,      setNovError]      = useState(null);

    useEffect(() => {
        obtenerMisViajes(conductor.id, token)
            .then(d => setViajes(d)).catch(() => {}).finally(() => setCargandoV(false));
    }, [conductor.id, token]);

    const abrirSalida = useCallback((salida) => {
        setSalidaActiva(salida);
        setCargandoD(true);
        setDetalle(null);
        setChecks({});
        setNovedadOpen(null);
        Promise.all([
            obtenerDetalleSalida(salida.id),
            obtenerCheckpoints(salida.id),
        ]).then(([det, cps]) => {
            setDetalle(det);
            const mapa = {};
            cps.forEach(cp => { mapa[`${cp.parada_id}_${cp.reportado_por}`] = cp; });
            setChecks(mapa);
        }).catch(() => setDetalle({ puntos_ruta: [] }))
          .finally(() => setCargandoD(false));
    }, []);

    const toggleCheck = async (parada) => {
        const key = `${parada.id}_${reportadoPor}`;
        const cpYaChecked = checks[key];
        
        if (cpYaChecked) {
            setSaving(parada.id);
            try {
                await desmarcarCheckpoint({ salidaId: salidaActiva.id, paradaId: parada.id, reportadoPor, token });
                setChecks(prev => { const n = { ...prev }; delete n[key]; return n; });
            } catch (e) { /* silencioso */ }
            setSaving(null);
        } else {
            const now = new Date();
            const hs = String(now.getHours()).padStart(2, '0');
            const ms = String(now.getMinutes()).padStart(2, '0');
            setHoraConfirmacion(`${hs}:${ms}`);
            setModalHora(parada);
        }
    };

    const confirmarLlegadaHora = async () => {
        if (!modalHora) return;
        setSaving(modalHora.id);
        const parada = modalHora;
        const key = `${parada.id}_${reportadoPor}`;
        setModalHora(null);

        const notasConHora = horaConfirmacion ? `Llegada confirmada a las ${horaConfirmacion}` : '';

        try {
            const result = await marcarCheckpoint({
                salidaId: salidaActiva.id, paradaId: parada.id,
                paradaNombre: parada.nombre, reportadoPor,
                usuarioId: conductor.id, token, notas: notasConHora,
            });
            setChecks(prev => ({ ...prev, [key]: { notas: notasConHora } }));
        } catch (e) { /* silencioso */ }
        setSaving(null);
    };

    const handleFoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setNovForm(f => ({ ...f, foto: reader.result }));
        reader.readAsDataURL(file);
    };

    const enviarNovedad = async (e) => {
        e.preventDefault();
        if (!novForm.mensaje.trim()) return;
        setNovSaving(true); setNovError(null); setNovOk(false);
        try {
            await reportarNovedad(salidaActiva.id, novForm.nivel, novForm.mensaje, novForm.foto, token);
            setNovOk(true);
            setNovForm({ nivel: 'media', mensaje: '', foto: '' });
            setTimeout(() => { setNovedadOpen(null); setNovOk(false); }, 2000);
        } catch (err) { setNovError(err.message); }
        setNovSaving(false);
    };

    const parseFechaSegura = (fechaStr) => {
        if (!fechaStr) return null;
        if (fechaStr.includes('/')) {
            const parts = fechaStr.split('/');
            if (parts.length === 3) {
                // Asumimos DD/MM/YYYY
                return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
            }
        }
        return new Date(fechaStr + (fechaStr.includes('T') ? '' : 'T00:00:00'));
    };

    const getDiasRuta = (puntos, salida) => {
        const dias = new Set();
        const fechaIni = salida?.fecha_salida || salida?.fecha_inicio;
        const fechaFin = salida?.fecha_regreso || salida?.fecha_fin;
        // Intentar calcular por fecha programada de cada punto
        if (fechaIni) {
            const ini = parseFechaSegura(fechaIni);
            if (ini && !isNaN(ini.getTime())) {
                puntos.forEach(p => {
                    if (p.fecha_programada) {
                        const cur = parseFechaSegura(p.fecha_programada);
                        if (cur && !isNaN(cur.getTime())) {
                            const diff = Math.round((cur - ini) / (1000 * 60 * 60 * 24));
                            dias.add(diff + 1);
                        }
                    }
                });
            }
        }
        // Fallback: extraer días del tiempo_estimado si el profesor lo digitó allí
        if (dias.size === 0) {
            puntos.forEach(p => {
                if (p.tiempo_estimado) {
                    const match = p.tiempo_estimado.match(/d[ií]a\s*(\d+)/i);
                    if (match) dias.add(parseInt(match[1], 10));
                }
            });
        }
        // Fallback: usar fecha inicio y fin de la salida
        if (dias.size === 0 && fechaIni) {
            const ini = parseFechaSegura(fechaIni);
            if (ini && !isNaN(ini.getTime())) {
                let totalDias = 1;
                if (fechaFin) {
                    const fin = parseFechaSegura(fechaFin);
                    if (fin && !isNaN(fin.getTime())) {
                        totalDias = Math.max(1, Math.round((fin - ini) / (1000 * 60 * 60 * 24)) + 1);
                    }
                }
                for (let i = 1; i <= Math.min(totalDias, 15); i++) {
                    dias.add(i);
                }
            }
        }
        return Array.from(dias).sort((a,b) => a-b);
    };

    const getDiaLabel = (parada, salida) => {
        const fechaIni = salida?.fecha_salida || salida?.fecha_inicio;
        if (!parada.fecha_programada || !fechaIni) return null;
        const ini = parseFechaSegura(fechaIni);
        const cur = parseFechaSegura(parada.fecha_programada);
        if (ini && cur && !isNaN(ini.getTime()) && !isNaN(cur.getTime())) {
            const diff = Math.round((cur - ini) / (1000 * 60 * 60 * 24));
            return `Día ${diff + 1}`;
        }
        return null;
    };

    // ── Pantalla 1: elegir viaje ─────────────────────────────────────────────
    if (!salidaActiva) {
        return (
            <div className="app-cond__tab-content anim-slide-up" style={{ padding: '24px 20px', paddingBottom: '120px' }}>
                <div style={{ marginBottom: '36px' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 10px', letterSpacing: '-0.5px', background: 'linear-gradient(to right, #ffffff, var(--app-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow:'0 4px 20px rgba(6, 182, 212, 0.3)' }}>
                        Mis Checkpoints
                    </h2>
                    <p style={{ color: 'var(--app-muted)', fontSize: '0.95rem', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
                        Selecciona tu ruta activa para registrar el progreso.
                    </p>
                </div>

                {cargandoV ? (
                    <div style={{ display:'flex', justifyContent:'center', padding:'40px 0' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00d8ff" strokeWidth="2" style={{ animation:'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    </div>
                ) : viajes.length === 0 ? (
                    <div style={{ background:'rgba(15, 23, 42, 0.6)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border:'1px solid rgba(255, 255, 255, 0.05)', borderRadius:'24px', padding:'50px 24px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:'16px', boxShadow:'0 10px 30px rgba(0,0,0,0.2)' }}>
                        <div style={{ width:'70px', height:'70px', borderRadius:'50%', background:'rgba(255,255,255,0.03)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.1)' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--app-muted)" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        </div>
                        <p style={{ color:'var(--app-text)', fontWeight:700, fontSize:'1.1rem', margin:0 }}>Sin Rutas Asignadas</p>
                        <p style={{ color:'var(--app-muted)', fontSize:'0.9rem', margin:0 }}>No tienes rutas activas para hoy. Relájate y espera nuevas instrucciones.</p>
                    </div>
                ) : (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'12px' }}>
                        {viajes.map(v => (
                            <button key={v.id} onClick={() => abrirSalida(v)} style={{
                                width:'100%', textAlign:'left',
                                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                                backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
                                border:'1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius:'20px', padding:'16px', cursor:'pointer', 
                                boxShadow:'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 8px 24px rgba(0,0,0,0.4)',
                                color:'white', display:'flex', flexDirection:'column', alignItems:'flex-start', gap:'12px',
                                transition:'transform 0.15s ease-out', WebkitTapHighlightColor: 'transparent',
                                position: 'relative', overflow: 'hidden'
                            }} 
                            onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.96)'; }} 
                            onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                                {/* Subtle highlight orb inside the card */}
                                <div style={{ position:'absolute', top:'-15px', right:'-15px', width:'80px', height:'80px', background:'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)', filter:'blur(20px)', pointerEvents:'none' }} />

                                {/* Top row: Icon and arrow */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                                    <div style={{ width:'44px', height:'44px', borderRadius:'12px',
                                        background: v.estado === 'en_ejecucion' ? 'linear-gradient(135deg, var(--app-cyan), #006080)' : 'rgba(255,255,255,0.05)', 
                                        border: v.estado === 'en_ejecucion' ? 'none' : '1px solid rgba(255,255,255,0.2)',
                                        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, 
                                        boxShadow: v.estado === 'en_ejecucion' ? '0 8px 20px rgba(6, 182, 212, 0.5), inset 0 0 15px rgba(255,255,255,0.4)' : 'none',
                                        zIndex: 1 }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={v.estado === 'en_ejecucion' ? 'white' : 'var(--app-muted)'} strokeWidth="2.5" style={{ filter: v.estado === 'en_ejecucion' ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none' }}><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
                                    </div>
                                    <div style={{ width:'26px', height:'26px', borderRadius:'50%', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, zIndex: 1, backdropFilter:'blur(4px)' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                                    </div>
                                </div>
                                
                                <div style={{ flex:1, minWidth:0, zIndex: 1, marginTop: '2px' }}>
                                    <div style={{ fontWeight:900, fontSize:'1rem', overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', marginBottom:'8px', textShadow:'0 2px 4px rgba(0,0,0,0.5)', letterSpacing:'-0.2px', lineHeight:1.25 }}>{v.nombre}</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <span style={{ background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.1)', padding:'2px 6px', borderRadius:'6px', fontSize:'0.65rem', letterSpacing:'1px', color:'white', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.1)', alignSelf: 'flex-start' }}>#{v.codigo}</span>
                                        <span style={{ fontSize:'0.7rem', fontWeight: 700, color: v.estado === 'en_ejecucion' ? 'var(--app-cyan)' : 'var(--app-muted)', textShadow: v.estado === 'en_ejecucion' ? '0 0 10px rgba(6,182,212,0.6)' : 'none', letterSpacing:'0.5px' }}>{(v.estado||'').replace(/_/g,' ').toUpperCase()}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // ── Pantalla 2: itinerario con checkpoints ───────────────────────────────
    const puntos = detalle?.puntos_ruta || [];
    const totalPuntos   = puntos.length;
    const totalChecked  = puntos.filter(p => checks[`${p.id}_${reportadoPor}`]).length;
    const pct = totalPuntos > 0 ? Math.round((totalChecked / totalPuntos) * 100) : 0;
    const isCompletado = totalPuntos > 0 && pct === 100;
    
    const diasDeRuta = getDiasRuta(puntos, salidaActiva);
    
    const diasDetallados = diasDeRuta.map(d => {
        let fechaStr = '';
        const fechaIniSalida = salidaActiva?.fecha_salida || salidaActiva?.fecha_inicio;
        if (fechaIniSalida) {
            const dateObj = parseFechaSegura(fechaIniSalida);
            if (dateObj && !isNaN(dateObj.getTime())) {
                dateObj.setDate(dateObj.getDate() + (d - 1));
                const day = dateObj.getDate();
                const month = dateObj.toLocaleString('es-ES', { month: 'short' });
                fechaStr = `${day} ${month.charAt(0).toUpperCase() + month.slice(1)}`;
            }
        }
        return { numero: d, label: `DÍA ${d}`, fechaStr };
    });

    return (
        <div className="app-cond__tab-content anim-slide-up" style={{ padding: '24px 20px', paddingBottom: '120px' }}>
            {/* Cabecera Limpia */}
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px', 
background:'rgba(15, 23, 42, 0.6)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', border:'1px solid rgba(255, 255, 255, 0.08)', boxShadow:'0 10px 30px rgba(0,0,0,0.3)', borderRadius:'20px', padding:'16px 16px' }}>
                  <button onClick={() => setSalidaActiva(null)} style={{
                      background:'rgba(255, 255, 255, 0.05)', border:'1px solid rgba(255, 255, 255, 0.1)', color:'white', cursor:'pointer',
                      width:'42px', height:'42px', borderRadius:'14px', display:'flex', alignItems:'center', 
justifyContent:'center', transition:'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.transform = 'scale(1)'; }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <div style={{ flex:1, minWidth:0 }}>
                    <h2 style={{ margin:0, fontSize:'1.05rem', fontWeight:800, color:'white', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{salidaActiva.nombre}</h2>
                    <p style={{ margin:'4px 0 0', fontSize:'0.75rem', color:'#9ca3af', fontWeight:500, letterSpacing:'0.3px', display:'flex', alignItems:'center', gap:'4px' }}>
                        <span style={{ color:'#00d8ff', fontWeight:700 }}>ID:</span> #{salidaActiva.id}
                    </p>
                </div>
            </div>

            {/* Resumen de Avance */}
            <div style={{ 
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95))', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
                  border:'1px solid rgba(255, 255, 255, 0.08)', borderRadius:'24px', padding:'24px', marginBottom:'32px', position:'relative', overflow:'hidden',
                  boxShadow:'0 20px 40px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1)'
              }}>
                  <div style={{ position:'absolute', top:'-50%', right:'-20%', width:'150%', height:'200%', background:'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 60%)', zIndex:0 }}/>
                  
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', 
marginBottom:'20px', position:'relative', zIndex:1 }}>
                      <div>
                          <span style={{ fontSize:'0.75rem', color:'#9ca3af', fontWeight:700, 
textTransform:'uppercase', letterSpacing:'1.5px', display:'block', marginBottom:'6px' }}>Avance de Ruta</span>
                          <span style={{ fontSize:'1.05rem', color:'white', fontWeight:600 }}>{isCompletado ? 
'¡Completado!' : 'En progreso...'}</span>
                      </div>
                      <span style={{ fontSize:'2.4rem', fontWeight:900, color: 'white', lineHeight:1, textShadow:'0 4px 10px rgba(0,0,0,0.5)' }}>
                          {totalChecked}<span style={{ fontSize:'1.2rem', fontWeight:600, color:'rgba(255,255,255,0.4)' 
}}>/{totalPuntos}</span>
                      </span>
                  </div>
                  <div style={{ width:'100%', height:'8px', background:'rgba(255, 255, 255, 0.05)', borderRadius:'4px', 
overflow:'hidden', position:'relative', zIndex:1, border:'1px solid rgba(255,255,255,0.02)' }}>
                      <div style={{ width:`${pct}%`, height:'100%', background: isCompletado ? '#10b981' : 'linear-gradient(90deg, #06b6d4, #0891b2)',
                          borderRadius:'4px', transition:'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)', boxShadow: isCompletado ? '0 0 10px rgba(16, 185, 129, 0.5)' : '0 0 10px rgba(6, 182, 212, 0.4)' }}/>
                  </div>
              </div>

            {/* Días en la parte superior (NAVEGABLE) */}
            {diasDetallados.length > 0 && (
                <div style={{ marginBottom:'24px' }}>
                    <span style={{ fontSize:'0.7rem', color:'#4b5563', fontWeight:700, marginBottom:'10px', display:'block', textTransform:'uppercase', letterSpacing:'1.5px' }}>
                        DÍA DEL VIAJE
                    </span>
                    <div style={{ display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'4px' }}>
                        {diasDetallados.map(d => {
                            const isActive = diaSeleccionado === d.numero;
                            return (
                                <button
                                    key={d.numero}
                                    onClick={() => setDiaSeleccionado(isActive ? null : d.numero)}
                                    style={{
                                        display:'flex', flexDirection:'column', alignItems:'flex-start', flexShrink:0,
                                        padding: '10px 18px', borderRadius:'14px', cursor:'pointer',
                                        border: isActive ? '1px solid rgba(0, 216, 255, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                                        background: isActive
                                            ? 'linear-gradient(135deg, rgba(0,216,255,0.15), rgba(8,145,178,0.12))'
                                            : 'rgba(255,255,255,0.04)',
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: isActive ? '0 4px 20px rgba(0,216,255,0.15)' : 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <span style={{ fontSize:'0.6rem', color: isActive ? '#00d8ff' : '#6b7280', fontWeight:700, marginBottom:'3px', letterSpacing:'1px' }}>{d.label}</span>
                                    <span style={{ fontSize:'1rem', color: isActive ? 'white' : '#94a3b8', fontWeight:800, whiteSpace:'nowrap' }}>{d.fechaStr || `Día ${d.numero}`}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Lista de paradas */}
            {cargandoD ? (
                <div style={{ display:'flex', justifyContent:'center', padding:'40px 0' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00d8ff" strokeWidth="2" style={{ animation:'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                </div>
            ) : puntos.length === 0 ? (
                <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:'24px', padding:'40px 24px', textAlign:'center', border:'1px dashed rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize:'2.2rem', marginBottom:'12px' }}>🗺️</div>
                    <p style={{ color:'white', fontWeight:700, fontSize:'1rem', margin:'0 0 6px' }}>Sin itinerario definido</p>
                    <small style={{ color:'#6b7280', fontSize:'0.85rem' }}>El profesor no definió paradas para esta ruta.</small>
                </div>
            ) : (
                <div style={{ position:'relative', marginLeft:'8px' }}>
                      <div style={{ position:'absolute', left:'23px', top:'32px', bottom:'32px', width:'3px', 
background:'linear-gradient(to bottom, #00d8ff 0%, rgba(255,255,255,0.05) 100%)', zIndex:0, borderRadius:'2px' }}/>
                    
                    <div style={{ display:'flex', flexDirection:'column', gap:'0', position:'relative', zIndex:2 }}>
                        {(() => {
                            const algunTieneFecha = puntos.some(p => p.fecha_programada);
                            let puntosFiltrados = puntos;
                            let modoFiltro = 'todos'; // 'todos' | 'filtrado' | 'vacio'

                            if (diaSeleccionado) {
                                if (!algunTieneFecha) {
                                    // Sin fechas en ninguna parada: mostrar todo
                                    puntosFiltrados = puntos;
                                    modoFiltro = 'todos';
                                } else {
                                    const conFecha = puntos.filter(p => getDiaLabel(p, salidaActiva) === `Día ${diaSeleccionado}`);
                                    if (conFecha.length > 0) {
                                        puntosFiltrados = conFecha;
                                        modoFiltro = 'filtrado';
                                    } else {
                                        // Hay fechas en otras paradas pero ninguna para este día
                                        puntosFiltrados = [];
                                        modoFiltro = 'vacio';
                                    }
                                }
                            }

                            if (modoFiltro === 'vacio') {
                                return (
                                    <div style={{ textAlign:'center', padding:'40px 20px', background:'rgba(255,255,255,0.03)', borderRadius:'16px', border:'1px dashed rgba(255,255,255,0.1)' }}>
                                        <div style={{ fontSize:'2rem', marginBottom:'12px' }}>📋</div>
                                        <p style={{ color:'#9ca3af', fontWeight:600, margin:'0 0 6px', fontSize:'0.9rem' }}>Sin paradas para el Día {diaSeleccionado}</p>
                                        <small style={{ color:'#4b5563', fontSize:'0.78rem' }}>El profesor no asignó paradas específicas para este día.</small>
                                    </div>
                                );
                            }
                            return puntosFiltrados.map((parada, idx) => {
                            const key       = `${parada.id}_${reportadoPor}`;
                            const cpObj     = checks[key];
                            const checked   = !!cpObj;
                            const isSaving  = saving === parada.id;
                            const novAbierta = novedadOpen === parada.id;
                            const esUltima  = idx === puntos.length - 1;

                            const diaLabel = parada.tiempo_estimado || getDiaLabel(parada, salidaActiva);
                            const fmtHora = parada.hora_programada ? parada.hora_programada.slice(0,5) : '';

                            return (
                                  <div key={parada.id} style={{ display:'flex', gap:'20px', paddingBottom: esUltima ? 0 : '24px' }}>
                                      {/* Nodo del timeline */}
                                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', 
flexShrink:0, paddingTop:'16px' }}>
                                          <button
                                              onClick={() => toggleCheck(parada)}
                                              disabled={isSaving}
                                              title={checked ? 'Desmarcar parada' : 'Confirmar llegada'}
                                              style={{
                                                  width:'50px', height:'50px', borderRadius:'50%',
                                                  background: checked ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(15, 23, 42, 0.8)',
                                                  border: checked ? 'none' : '2px solid rgba(255,255,255,0.1)',
                                                  boxShadow: checked ? '0 8px 20px rgba(16, 185, 129, 0.4)' : '0 4px 12px rgba(0,0,0,0.3)',
                                                  cursor: isSaving ? 'wait' : 'pointer',
                                                  display:'flex', alignItems:'center', justifyContent:'center',
                                                  zIndex:2, position:'relative', padding:0, transition:'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                                  transform: isSaving ? 'scale(0.95)' : 'scale(1)'
                                              }}
                                              onMouseEnter={(e) => { if(!isSaving) e.currentTarget.style.transform = 'scale(1.1)'; }}
                                              onMouseLeave={(e) => { if(!isSaving) e.currentTarget.style.transform = 'scale(1)'; }}
                                          >
                                            {isSaving ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation:'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                                            ) : checked ? (
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                            ) : (
                                                <span style={{ width:'12px', height:'12px', borderRadius:'50%', background:'#4b5563', display:'block' }}/>
                                            )}
                                        </button>
                                    </div>

                                    {/* Contenido de la parada */}
                                      <div style={{ flex:1, minWidth:0 }}>
                                          <div style={{
                                              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.01))', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid rgba(255, 255, 255, 0.1)', boxShadow:'inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 8px 24px rgba(0,0,0,0.3)',
                                              borderRadius:'16px', padding:'12px 16px', transition:'transform 0.2s'
                                          }}>
                                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
                                                <div style={{ flex:1, minWidth:0 }}>
                                                    <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'8px', flexWrap:'wrap', overflow:'hidden' }}>
                                                          <span style={{ fontSize:'0.55rem', fontWeight:800, color: '#00d8ff', textTransform:'uppercase', letterSpacing:'1px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6,182,212,0.3)', padding:'2px 6px', borderRadius:'6px', whiteSpace:'nowrap' }}>
                                                              PARADA {String(idx+1).padStart(2,'0')}
                                                          </span>
                                                          {diaLabel && (
                                                              <span style={{ fontSize:'0.55rem', fontWeight:800, color: checked ? '#10b981' : '#cbd5e1', textTransform:'uppercase', letterSpacing:'1px', background: checked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.1)', border: checked ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.2)', padding:'2px 6px', borderRadius:'6px', whiteSpace:'nowrap' }}>
                                                                  {diaLabel} {fmtHora ? `• ${fmtHora}` : ''}
                                                              </span>
                                                          )}
                                                          {checked && cpObj?.notas && (
                                                              <span style={{ fontSize:'0.55rem', fontWeight:600, 
color:'#10b981', display:'flex', alignItems:'center', gap:'4px', background:'rgba(16,185,129,0.1)', padding:'2px 6px', borderRadius:'6px', whiteSpace:'nowrap' }}>
                                                                  ✓ {cpObj.notas.replace('Llegada confirmada a las ', '')}
                                                              </span>
                                                          )}
                                                      </div>
                                                      <p style={{ margin:0, fontWeight:800, fontSize:'0.75rem', 
color:'white', lineHeight:1.3, textShadow:'0 2px 4px rgba(0,0,0,0.5)', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', textOverflow:'ellipsis' }}>
                                                          {parada.nombre}
                                                      </p>
                                                      {parada.notas_itinerario && (
                                                          <p style={{ margin:'4px 0 0', fontSize:'0.65rem', 
color:'#9ca3af', lineHeight:1.4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', textOverflow:'ellipsis' }}>
                                                              {parada.notas_itinerario}
                                                          </p>
                                                      )}
                                                  </div>
                                                
                                                {/* Botón novedad */}
                                                <button
                                                    onClick={() => {
                                                        setNovedadOpen(novAbierta ? null : parada.id);
                                                        setNovForm({ nivel:'media', mensaje:'', foto:'' });
                                                        setNovOk(false); setNovError(null);
                                                    }}
                                                    title="Reportar novedad"
                                                    style={{
                                                        width:'36px', height:'36px', borderRadius:'10px', 
                                                        border: novAbierta ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                                                        background: novAbierta ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)',
                                                        color: novAbierta ? '#ef4444' : 'var(--app-muted)',
                                                        cursor:'pointer', display:'flex', alignItems:'center',
                                                        justifyContent:'center', flexShrink:0, transition:'all 0.2s',
                                                        boxShadow: novAbierta ? '0 4px 12px rgba(239, 68, 68, 0.2)' : 'none',
                                                        WebkitTapHighlightColor: 'transparent'
                                                    }}
                                                    onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.95)'; e.currentTarget.style.background = novAbierta ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255,255,255,0.1)'; }}
                                                    onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = novAbierta ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)'; }}
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" 
                                                         style={{ transform: novAbierta ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }}>
                                                        <polyline points="6 9 12 15 18 9"/>
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Formulario de novedad */}
                                            {novAbierta && (
                                                <div className="anim-slide-up" style={{
                                                    marginTop:'20px', borderTop:'1px dashed rgba(255,255,255,0.1)',
                                                    paddingTop:'20px',
                                                }}>
                                                    <p style={{ margin:'0 0 12px', fontSize:'0.9rem', fontWeight:800, color:'white', textTransform:'uppercase' }}>
                                                        Reportar Novedad
                                                    </p>
                                                    <form onSubmit={enviarNovedad} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                                                        {novOk && (
                                                            <div style={{ background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'12px',
                                                                padding:'12px 16px', color:'#6ee7b7', fontSize:'0.9rem', fontWeight:700, display:'flex', gap:'8px', alignItems:'center' }}>
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                                                Enviada con éxito
                                                            </div>
                                                        )}
                                                        {novError && (
                                                            <div style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'12px',
                                                                padding:'12px 16px', color:'#fca5a5', fontSize:'0.9rem', fontWeight:600 }}>{novError}</div>
                                                        )}
                                                        
                                                        {/* Nivel de Alerta */}
                                                        <div>
                                                            <label style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                                                                <span style={{ fontSize:'0.75rem', color:'#9ca3af', fontWeight:600, letterSpacing:'0.5px' }}>NIVEL DE NOVEDAD</span>
                                                                <div style={{ position:'relative' }}>
                                                                    <select
                                                                        value={novForm.nivel}
                                                                        onChange={e => {
                                                                            const val = e.target.value;
                                                                            setNovForm(f => ({ ...f, nivel: val }));
                                                                        }}
                                                                        onTouchStart={e => e.stopPropagation()}
                                                                        onClick={e => e.stopPropagation()}
                                                                        style={{
                                                                            appearance:'none', width:'100%',
                                                                            background: NIVEL_META[novForm.nivel]?.bg || 'rgba(255,255,255,0.03)',
                                                                            color: NIVEL_META[novForm.nivel]?.color || '#fff',
                                                                            border: `1px solid ${NIVEL_META[novForm.nivel]?.color || 'rgba(255,255,255,0.1)'}`,
                                                                            borderRadius:'10px', padding:'10px 14px',
                                                                            fontSize:'0.9rem', fontWeight:700, outline:'none', cursor:'pointer'
                                                                        }}
                                                                    >
                                                                        {Object.entries(NIVEL_META).map(([k, v]) => (
                                                                            <option key={k} value={k} style={{ background:'#1e293b', color:'white' }}>
                                                                                {v.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    <svg style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={NIVEL_META[novForm.nivel]?.color || '#fff'} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                                                                </div>
                                                            </label>
                                                        </div>

                                                        {/* Mensaje */}
                                                        <textarea
                                                            id={`novedad_msg_${parada.id}`}
                                                            value={novForm.mensaje}
                                                            onChange={e => {
                                                                const val = e.target.value;
                                                                setNovForm(f => ({ ...f, mensaje: val }));
                                                            }}
                                                            onTouchStart={e => e.stopPropagation()}
                                                            onClick={e => e.stopPropagation()}
                                                            placeholder="Describe la novedad..."
                                                            rows={2}
                                                            style={{
                                                                background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)',
                                                                borderRadius:'10px', color:'white', padding:'12px',
                                                                fontSize:'0.85rem', resize:'none', outline:'none',
                                                                fontFamily:'inherit', width:'100%', boxSizing:'border-box',
                                                                pointerEvents: 'auto', userSelect: 'text', WebkitUserSelect: 'text'
                                                            }}
                                                        />

                                                        {/* Foto */}
                                                        <label style={{
                                                            display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                                                            background: novForm.foto ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)', 
                                                            border: novForm.foto ? '1px solid rgba(16,185,129,0.3)' : '1px dashed rgba(255,255,255,0.2)',
                                                            borderRadius:'10px', padding:'12px', cursor:'pointer',
                                                        }}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={novForm.foto ? '#10b981' : '#94a3b8'} strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                                            <span style={{ fontSize:'0.9rem', fontWeight:600, color: novForm.foto ? '#10b981' : '#94a3b8' }}>
                                                                {novForm.foto ? 'Foto adjuntada' : 'Adjuntar fotografía'}
                                                            </span>
                                                            <input type="file" accept="image/*" capture="environment"
                                                                onChange={handleFoto} style={{ display:'none' }}/>
                                                        </label>

                                                        <button type="submit" disabled={novSaving || !novForm.mensaje.trim()} style={{
                                                            padding:'16px', borderRadius:'16px', border:'none',
                                                            background: novSaving || !novForm.mensaje.trim() ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#f97316,#ef4444)',
                                                            color: novSaving || !novForm.mensaje.trim() ? '#64748b' : 'white',
                                                            fontWeight:800, fontSize:'1rem', cursor: novSaving || !novForm.mensaje.trim() ? 'not-allowed' : 'pointer',
                                                            marginTop:'8px'
                                                        }}>
                                                            {novSaving ? 'Enviando...' : 'Enviar Novedad'}
                                                        </button>
                                                    </form>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        });
                        })()}
                    </div>
                </div>
            )}

            {/* Modal Confirmar Llegada */}
            {modalHora && (
                <div style={{
                    position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.8)',
                    zIndex:9999, display:'flex', alignItems:'flex-end', padding:'20px',
                }}>
                    <div className="anim-slide-up" style={{
                        background:'#0f172a', border:'1px solid rgba(255,255,255,0.1)',
                        borderRadius:'32px', padding:'32px 24px', width:'100%', maxWidth:'400px', margin:'0 auto',
                        boxShadow:'0 -20px 60px rgba(0,0,0,0.6)'
                    }}>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
                            <div style={{ width:'64px', height:'64px', borderRadius:'20px', background:'rgba(16,185,129,0.1)',
                                border:'1px solid rgba(16,185,129,0.3)', display:'flex', alignItems:'center', justifyContent:'center',
                                marginBottom:'24px' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            
                            <h3 style={{ margin:'0 0 12px', fontSize:'1.4rem', color:'white', fontWeight:800, letterSpacing:'-0.5px' }}>Confirmar Llegada</h3>
                            
                            <div style={{ background:'rgba(255,255,255,0.03)', padding:'12px 20px', borderRadius:'16px', marginBottom:'28px', border:'1px solid var(--borde-suave)', width:'100%' }}>
                                <span style={{ fontSize:'0.8rem', color:'#94a3b8', textTransform:'uppercase', fontWeight:700, letterSpacing:'1px', display:'block', marginBottom:'4px' }}>Destino</span>
                                <strong style={{ color:'white', fontSize:'1rem', lineHeight:1.3, display:'block' }}>{modalHora.nombre}</strong>
                            </div>

                            <div style={{ width:'100%', marginBottom:'32px' }}>
                                <label style={{ display:'block', color:'#94a3b8', fontSize:'0.85rem', fontWeight:600, marginBottom:'12px', textAlign:'left', paddingLeft:'8px' }}>
                                    HORA EXACTA DE LLEGADA
                                </label>
                                {(() => {
                                    const h24 = horaConfirmacion ? parseInt(horaConfirmacion.split(':')[0], 10) : 12;
                                    const mStr = horaConfirmacion ? horaConfirmacion.split(':')[1] : '00';
                                    const isPm = h24 >= 12;
                                    const h12Str = String(h24 % 12 || 12).padStart(2, '0');

                                    const setHora = (newH24) => {
                                        setHoraConfirmacion(`${String(newH24).padStart(2, '0')}:${mStr}`);
                                    };

                                    const toggleAmPm = () => setHora((h24 + 12) % 24);

                                    const handleHChange = (e) => {
                                        let val = e.target.value.replace(/\D/g, '');
                                        if (val.length > 2) val = val.slice(-2);
                                        let intVal = parseInt(val, 10);
                                        if (isNaN(intVal)) return;
                                        if (intVal > 12) intVal = 12;
                                        if (intVal === 0) intVal = 1;
                                        setHora(intVal === 12 ? (isPm ? 12 : 0) : intVal + (isPm ? 12 : 0));
                                    };

                                    const handleMChange = (e) => {
                                        let val = e.target.value.replace(/\D/g, '');
                                        if (val.length > 2) val = val.slice(-2);
                                        let intVal = parseInt(val, 10);
                                        if (isNaN(intVal)) return;
                                        if (intVal > 59) intVal = 59;
                                        setHoraConfirmacion(`${String(h24).padStart(2, '0')}:${String(intVal).padStart(2, '0')}`);
                                    };

                                    return (
                                        <div style={{ display:'flex', gap:'8px', height:'70px' }}>
                                            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.3)', borderRadius:'20px', border:'1px solid var(--borde-suave)' }}>
                                                <input 
                                                    type="text" inputMode="numeric"
                                                    value={h12Str} 
                                                    onChange={handleHChange}
                                                    onFocus={(e) => e.target.select()}
                                                    style={{ width:'50px', background:'transparent', border:'none', color:'white', fontSize:'2.2rem', textAlign:'right', outline:'none', fontFamily:'monospace', fontWeight:800 }}
                                                />
                                                <span style={{ fontSize:'2.2rem', color:'#64748b', fontWeight:800, margin:'0 4px', position:'relative', top:'-2px' }}>:</span>
                                                <input 
                                                    type="text" inputMode="numeric"
                                                    value={mStr} 
                                                    onChange={handleMChange}
                                                    onBlur={() => setHoraConfirmacion(`${String(h24).padStart(2, '0')}:${mStr.padStart(2, '0')}`)}
                                                    onFocus={(e) => e.target.select()}
                                                    style={{ width:'50px', background:'transparent', border:'none', color:'white', fontSize:'2.2rem', textAlign:'left', outline:'none', fontFamily:'monospace', fontWeight:800 }}
                                                />
                                            </div>
                                            <button 
                                                onClick={toggleAmPm}
                                                style={{
                                                    width:'80px', borderRadius:'20px', border:'none',
                                                    background: isPm ? 'rgba(0,216,255,0.15)' : 'rgba(255,255,255,0.05)',
                                                    color: isPm ? '#00d8ff' : '#94a3b8',
                                                    fontSize:'1.1rem', fontWeight:800, cursor:'pointer',
                                                    border: isPm ? '1px solid rgba(0,216,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                                                    transition:'all 0.2s', letterSpacing:'1px'
                                                }}
                                            >
                                                {isPm ? 'PM' : 'AM'}
                                            </button>
                                        </div>
                                    );
                                })()}
                            </div>

                            <div style={{ display:'flex', gap:'16px', width:'100%' }}>
                                <button onClick={() => setModalHora(null)} style={{
                                    flex:1, padding:'16px', borderRadius:'16px', border:'none',
                                    background:'rgba(255,255,255,0.05)', color:'white', fontWeight:700,
                                    cursor:'pointer', fontSize:'1rem'
                                }}>
                                    Cancelar
                                </button>
                                <button onClick={confirmarLlegadaHora} style={{
                                    flex:2, padding:'16px', borderRadius:'16px', border:'none',
                                    background:'linear-gradient(135deg,#10b981,#059669)', color:'white', fontWeight:800,
                                    cursor:'pointer', fontSize:'1rem',
                                    display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'
                                }}>
                                    Confirmar <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
function TabNovedades({ conductor, token }) {
    const [viajes, setViajes] = useState([]);
    const [cargandoViajes, setCargandoViajes] = useState(true);
    const [cargando, setCargando] = useState(false);
    const [exito, setExito] = useState(false);
    const [error, setError] = useState(null);
    
    // Nuevos estados para UI
    const [busqueda, setBusqueda] = useState('');
    const [viajeSeleccionado, setViajeSeleccionado] = useState(null);

    const [form, setForm] = useState({
        nivel: 'media',
        mensaje: '',
        foto: ''
    });

    useEffect(() => {
        obtenerMisViajes(conductor.id, token)
            .then(data => {
                setViajes(data);
            })
            .catch(err => console.error(err))
            .finally(() => setCargandoViajes(false));
    }, [conductor.id, token]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setForm(f => ({ ...f, foto: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!viajeSeleccionado || !form.mensaje) {
            setError('Por favor, selecciona un viaje y escribe un mensaje.');
            return;
        }
        setCargando(true);
        setError(null);
        setExito(false);

        reportarNovedad(viajeSeleccionado.id, form.nivel, form.mensaje, form.foto, token)
            .then(() => {
                setExito(true);
                setForm({ nivel: 'media', mensaje: '', foto: '' });
                setTimeout(() => {
                    setExito(false);
                    setViajeSeleccionado(null);
                }, 3000);
            })
            .catch(err => setError(err.message))
            .finally(() => setCargando(false));
    };

    const viajesFiltrados = viajes.filter(v => 
        (v.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) || 
        (v.codigo || '').toLowerCase().includes(busqueda.toLowerCase())
    );

    const getGlassGradient = (color) => {
        // Convierte hex a rgba para el gradiente suave
        let r=0, g=0, b=0;
        if(color && color.startsWith('#')){
            const c = color.substring(1);
            if(c.length===6){
                r = parseInt(c.substring(0,2), 16);
                g = parseInt(c.substring(2,4), 16);
                b = parseInt(c.substring(4,6), 16);
            }
        }
        return `linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(${r}, ${g}, ${b}, 0.15) 100%)`;
    };

    return (
        <div className="app-cond__tab-content anim-slide-up" style={{ paddingBottom: '80px' }}>
            <style>{`
                .driver-premium-card {
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                .driver-premium-card:active {
                    transform: scale(0.96);
                }
                @media (hover: hover) {
                    .driver-premium-card:hover {
                        transform: translateY(-5px) scale(1.02);
                        box-shadow: 0 15px 30px rgba(0,0,0,0.4) !important;
                        border-color: rgba(255,255,255,0.3) !important;
                    }
                }
            `}</style>
            {!viajeSeleccionado ? (
                <>
                    <h2 className="app-cond__section-title">Reportar Novedad</h2>
                    <p style={{ color: '#64748b', marginBottom: '20px' }}>Selecciona la ruta para la cual deseas generar un reporte.</p>

                    <div style={{ position: 'relative', marginBottom: '24px' }}>
                        <input 
                            type="text" 
                            placeholder="Buscar ruta o código..." 
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            style={{ 
                                width: '100%', padding: '16px 16px 16px 48px', borderRadius: '16px', 
                                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', fontSize: '1rem',
                                color: '#ffffff', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)', outline: 'none'
                            }} 
                        />
                        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                    </div>

                    {cargandoViajes ? (
                        <p className="app-cond__loading">Cargando rutas...</p>
                    ) : viajesFiltrados.length === 0 ? (
                        <div className="app-cond__empty-state">
                            <IcoAlert />
                            <p>No se encontraron viajes.</p>
                        </div>
                    ) : (
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
                            gap: '16px' 
                        }}>
                            {viajesFiltrados.map(v => {
                                const IcoComponent = ICONOS[v.icono] || ICONOS['IcoMap'];
                                const cardColor = v.color || '#4A8DAC';
                                const est = (v.estado || 'lista_ejecucion').replace(/_/g, ' ').toUpperCase();
                                const sal = fmtFechaHora(v.fecha_salida, v.hora_salida);
                                const lle = fmtFechaHora(v.fecha_regreso, v.hora_regreso);

                                return (
                                    <div key={v.id} onClick={() => setViajeSeleccionado(v)} className="driver-premium-card" style={{
                                        background: 'var(--gradiente-card)',
                                        borderRadius: 'var(--radio-base)',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '20px',
                                        color: 'var(--text-primario)',
                                        cursor: 'pointer',
                                        boxShadow: 'var(--sombra-card)',
                                        aspectRatio: '1 / 1.05', 
                                        border: '1px solid var(--borde-suave)',
                                        borderTop: `3px solid var(--app-cyan)`, // Accent color requested by user
                                        overflow: 'hidden'
                                    }}>
                                        {/* Graphic Element on the right */}
                                        <div style={{
                                            position: 'absolute', right: '-30px', bottom: '-20px', width: '160px', height: '160px',
                                            opacity: 0.05, transform: 'rotate(-15deg) scale(1.3)', pointerEvents: 'none', zIndex: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan-500)'
                                        }}>
                                            {IcoComponent}
                                        </div>

                                        {/* Top Left Icon Box */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
                                            <div style={{ 
                                                background: 'var(--bg-active)', borderRadius: '10px', width: '48px', height: '48px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--borde-suave)'
                                            }}>
                                                <span style={{ display: 'flex', color: 'var(--cyan-400)' }}>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M3 11l19-9-9 19-2-8-8-2z" fill="var(--cyan-400)" fillOpacity="0.2" />
                                                    </svg>
                                                </span>
                                            </div>
                                            <span style={{ 
                                                fontSize: '0.6rem', fontWeight: 'bold', color: 'var(--cyan-300)', background: 'var(--bg-active)', 
                                                padding: '4px 10px', borderRadius: 'var(--radio-pill)', textTransform: 'uppercase', letterSpacing: '0.5px',
                                                border: '1px solid var(--borde-suave)'
                                            }}>
                                                {est.split(' ')[0]}
                                            </span>
                                        </div>
                            
                                        {/* Title and details at the bottom */}
                                        <div style={{ marginTop: 'auto', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <h3 style={{ fontSize: '1.15rem', fontWeight: '600', margin: '0 0 2px 0', lineHeight: '1.2', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {v.nombre}
                                            </h3>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secundario)', margin: '0 0 10px 0', fontWeight: '500' }}>
                                                #{v.codigo} • {v.facultad || 'General'}
                                            </p>
                                            
                                            {/* Sleek Timeline for Dates matching App Palette */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', paddingLeft: '20px', marginTop: '4px' }}>
                                                {/* Connecting Line */}
                                                {sal && lle && <div style={{ position: 'absolute', left: '4px', top: '12px', bottom: '12px', width: '2px', background: 'var(--borde-suave)', borderRadius: '2px' }} />}
                                                
                                                {sal && (
                                                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                                        <div style={{ 
                                                            position: 'absolute', left: '-20px', width: '10px', height: '10px', 
                                                            borderRadius: '50%', border: '2px solid var(--cyan-400)', background: 'var(--bg-base)'
                                                        }} />
                                                        <span style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secundario)' }}>
                                                            {sal.dia} {sal.fecha.split(' ')[0]}
                                                        </span>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primario)', marginLeft: 'auto' }}>
                                                            {sal.hora}
                                                        </span>
                                                    </div>
                                                )}
                                                
                                                {lle && (
                                                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                                        <div style={{ 
                                                            position: 'absolute', left: '-20px', width: '10px', height: '10px', 
                                                            borderRadius: '50%', background: 'var(--cyan-400)', boxShadow: '0 0 8px var(--cyan-500)'
                                                        }} />
                                                        <span style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secundario)' }}>
                                                            {lle.dia} {lle.fecha.split(' ')[0]}
                                                        </span>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--cyan-300)', marginLeft: 'auto' }}>
                                                            {lle.hora}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            ) : (
                <div className="anim-slide-up">
                    <button 
                        onClick={() => { setViajeSeleccionado(null); setError(null); setExito(false); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#cbd5e1', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', padding: '0 0 20px 0', transition: 'color 0.2s' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Volver a Rutas
                    </button>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '4px' }}>Nueva Novedad</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '0.9rem' }}>Para la ruta: <strong style={{ color: '#e2e8f0' }}>{viajeSeleccionado.nombre}</strong></p>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
                            {exito && <div style={{ background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', border: '1px solid rgba(16,185,129,0.2)' }}>¡Novedad reportada con éxito!</div>}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '600' }}>Nivel de Urgencia</label>
                                <select 
                                    value={form.nivel} 
                                    onChange={e => setForm({...form, nivel: e.target.value})}
                                    style={{ padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#ffffff', fontSize: '1rem', outline: 'none' }}
                                >
                                    <option value="baja" style={{ background: '#1e293b' }}>Baja - Informativa</option>
                                    <option value="media" style={{ background: '#1e293b' }}>Media - Novedad en ruta</option>
                                    <option value="alta" style={{ background: '#1e293b' }}>Alta - Requiere atención</option>
                                    <option value="critica" style={{ background: '#1e293b' }}>Crítica - Emergencia</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '600' }}>Descripción</label>
                                <textarea 
                                    value={form.mensaje} 
                                    onChange={e => setForm({...form, mensaje: e.target.value})}
                                    placeholder="Describe qué ocurrió..."
                                    style={{ padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#ffffff', fontSize: '1rem', minHeight: '120px', resize: 'none', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '600' }}>Fotografía (Opcional)</label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', borderRadius: '16px', border: '2px dashed rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', cursor: 'pointer', color: '#94a3b8', justifyContent: 'center', transition: 'all 0.2s' }}>
                                    <IcoCamera />
                                    <span style={{ fontWeight: '500' }}>Tocar para tomar/subir foto</span>
                                    <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} style={{ display: 'none' }} />
                                </label>
                                {form.foto && (
                                    <div style={{ position: 'relative', marginTop: '12px' }}>
                                        <img src={form.foto} alt="Preview" style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }} />
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); setForm(f => ({ ...f, foto: '' })); }}
                                            style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                                        >✕</button>
                                    </div>
                                )}
                            </div>

                            <button 
                                type="submit" 
                                disabled={cargando}
                                style={{ marginTop: '16px', padding: '18px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 'bold', cursor: cargando ? 'not-allowed' : 'pointer', opacity: cargando ? 0.7 : 1, boxShadow: '0 4px 16px rgba(59,130,246,0.3)', transition: 'background 0.2s' }}>
                                {cargando ? 'Enviando Reporte...' : 'Enviar Reporte'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function TabPerfil({ conductor }) {
    return (
        <div className="app-cond__tab-content anim-slide-up">
            <h2 className="app-cond__section-title">Mi Perfil</h2>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'16px', padding:'8px 0 20px' }}>
                <div style={{ position:'relative' }}>
                    <div className="app-cond__avatar" style={{ width:'80px', height:'80px', fontSize:'1.8rem', overflow:'hidden', border: '2px solid var(--app-cyan)', padding: '2px', borderRadius: '50%' }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                            {conductor.foto 
                                ? <img src={conductor.foto} alt="Foto" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> 
                                : ((conductor.nombre?.charAt(0) || '') + (conductor.apellido?.charAt(0) || '')) || <IcoUser />}
                        </div>
                    </div>
                    <button style={{ position:'absolute', bottom:0, right:0, background:'#00bcd4', border:'none', borderRadius:'50%', width:'26px', height:'26px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}>
                        <IcoCamera />
                    </button>
                </div>
                <span style={{ fontSize:'0.75rem', color:'#64748b' }}>{conductor.correo || ''}</span>
            </div>
            
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                <div className="app-cond__input-wrap">
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Rol</span>
                    <input className="app-cond__input" value={conductor.tipo_conductor || 'Conductor'} disabled style={{ paddingLeft:'16px', background: 'var(--app-bg)', color: '#94a3b8', cursor: 'not-allowed' }} />
                </div>
                <div className="app-cond__input-wrap">
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Licencia</span>
                    <input className="app-cond__input" value={conductor.licencia || 'No especificada'} disabled style={{ paddingLeft:'16px', background: 'var(--app-bg)', color: '#94a3b8', cursor: 'not-allowed' }} />
                </div>
                <div className="app-cond__input-wrap">
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Nombre Completo</span>
                    <input className="app-cond__input" value={`${conductor.nombre || ''} ${conductor.apellido || ''}`.trim()} disabled style={{ paddingLeft:'16px', background: 'var(--app-bg)', color: '#94a3b8', cursor: 'not-allowed' }} />
                </div>
                <div className="app-cond__input-wrap">
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Cédula</span>
                    <input className="app-cond__input" value={conductor.cedula || 'No especificada'} disabled style={{ paddingLeft:'16px', background: 'var(--app-bg)', color: '#94a3b8', cursor: 'not-allowed' }} />
                </div>
                <div className="app-cond__input-wrap">
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Teléfono (Modificable)</span>
                    <input className="app-cond__input" placeholder="Teléfono" value={conductor.telefono || 'No especificado'} onChange={() => {}} style={{ paddingLeft:'16px' }} />
                </div>
            </div>
        </div>
    );
}

function TabAvisos() {
    return (
        <div className="app-cond__tab-content anim-slide-up">
            <h2 className="app-cond__section-title">Notificaciones</h2>
            <div className="app-cond__empty-state">
                <IcoBell />
                <p>No tienes notificaciones pendientes.</p>
            </div>
        </div>
    );
}

// ── APP RAÍZ ───────────────────────────────────────────────────────────────
export default function AppConductor({ conductor, token, onLogout, isEmbedded }) {
    const [tabActiva, setTabActiva] = useState('mis-viajes');
    const [typed, setTyped] = useState('');
    const intervalRef = useRef(null);

    useEffect(() => {
        let i = 0;
        const escribir = () => {
            intervalRef.current = setInterval(() => {
                i++;
                setTyped(TAGLINE.slice(0, i));
                if (i >= TAGLINE.length) { clearInterval(intervalRef.current); setTimeout(borrar, 2200); }
            }, 55);
        };
        const borrar = () => {
            intervalRef.current = setInterval(() => {
                i--;
                setTyped(TAGLINE.slice(0, i));
                if (i <= 0) { clearInterval(intervalRef.current); setTimeout(escribir, 500); }
            }, 30);
        };
        const inicio = setTimeout(escribir, 800);
        return () => { clearTimeout(inicio); clearInterval(intervalRef.current); };
    }, []);

    return (
        <div className="app-cond mode-app">
            {/* Topbar */}
            <div className="app-cond__topbar">
                <div className="app-cond__topbar-user">
                    <div className="app-cond__avatar" style={{ overflow: 'hidden' }}>
                        {conductor.foto 
                            ? <img src={conductor.foto} alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> 
                            : ((conductor.nombre?.charAt(0) || '') + (conductor.apellido?.charAt(0) || ''))}
                    </div>
                    <div className="app-cond__user-info">
                        <strong>{conductor.nombre} {conductor.apellido || ''}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{conductor.correo}</span>
                        <span>{conductor.tipo_conductor || 'Conductor'}</span>
                    </div>
                </div>
                <button className="app-cond__logout-btn" onClick={onLogout} title="Cerrar sesión">
                    <IcoLogOut />
                </button>
            </div>

            {/* Content Area */}
            <div className="app-cond__main-content">
                {tabActiva === 'mis-viajes' && <TabMisViajes conductor={conductor} token={token} />}
                {tabActiva === 'checklist' && <TabChecklist conductor={conductor} token={token} />}
                {tabActiva === 'novedades' && <TabNotificar conductor={conductor} token={token} reportadoPor="conductor" />}
                {tabActiva === 'perfil' && <TabPerfil conductor={conductor} />}
                {tabActiva === 'avisos' && <TabAvisos />}
            </div>

            {/* Bottom Nav */}
            <div className="app-cond__bottom-nav">
                <div className="nav-group">
                    <button className={`nav-item ${tabActiva === 'mis-viajes' ? 'active' : ''}`} onClick={() => setTabActiva('mis-viajes')}>
                        <IcoHome /><span>Viajes</span>
                    </button>
                    <button className={`nav-item ${tabActiva === 'checklist' ? 'active' : ''}`} onClick={() => setTabActiva('checklist')}>
                        <IcoChecklist /><span>Checklist</span>
                    </button>
                </div>

                <div className="nav-fab-wrapper">
                    <button className={`nav-fab ${tabActiva === 'novedades' ? 'active' : ''}`} onClick={() => setTabActiva('novedades')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
                    </button>
                    <span className="nav-fab-label">Notificar</span>
                </div>

                <div className="nav-group">
                    <button className={`nav-item ${tabActiva === 'perfil' ? 'active' : ''}`} onClick={() => setTabActiva('perfil')}>
                        <IcoUser /><span>Perfil</span>
                    </button>
                    <button className={`nav-item ${tabActiva === 'avisos' ? 'active' : ''}`} onClick={() => setTabActiva('avisos')}>
                        <IcoBell /><span>Avisos</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
