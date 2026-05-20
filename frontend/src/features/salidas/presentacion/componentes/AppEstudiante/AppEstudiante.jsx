import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { ICONOS, PORTADAS, ETAPAS_STEPPER, colorEsClaro } from '@/features/salidas/presentacion/componentes/ListaTarjetasProfesor/constantesTarjetas';
import '@/features/salidas/presentacion/componentes/ListaTarjetasProfesor/ListaTarjetasProfesor.css';
import './AppEstudiante.css';

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
  return palabras.length > max ? palabras.slice(0, max).join(' ') + '…' : texto;
};

const IMG_SALIDA = 'https://i.ibb.co/gM0V53bQ/Gemini-Generated-Image-waibopwaibopwaib.png';
const IMG_UPN    = 'https://i.ibb.co/HfF3ZTrD/uopn-bklanco.png';
const IMG_OTIUM  = 'https://i.ibb.co/gFMbpC0X/Gemini-Generated-Image-svbxdfsvbxdfsvbx-removebg-preview.png';
const TAGLINE    = 'Explora, aprende y vive el territorio';

// ── Íconos SVG inline ────────────────────────────
const IcoEmail  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>;
const IcoLock   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const IcoCamera = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const IcoCheck  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoPen    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const IcoHome   = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcoPlus   = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcoDoc    = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const IcoLogOut = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcoUser   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoBell   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IcoEye    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcoTrash  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const IcoUpload = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const IcoRefresh= () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>;

// ── LOGIN COMPONENT ────────────────────────────────────────────────────────
function PasoLogin({ onLoginOk }) {
    const [correo,   setCorreo]   = useState('');
    const [password, setPassword] = useState('');
    const [error,    setError]    = useState('');
    const [cargando, setCargando] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);
        try {
            const res = await fetch('/api/auth/estudiante/login/', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ correo: correo.trim().toLowerCase(), password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Credenciales inválidas');
            onLoginOk(data.datos);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <form className="app-est__form" onSubmit={handleLogin}>
            <h2 className="app-est__card-title anim-slide-up">Ingresar</h2>
            {error && <div className="app-est__error anim-slide-up delay-1">{error}</div>}
            
            <div className="app-est__input-wrap anim-slide-up delay-1">
                <span className="app-est__input-icono"><IcoEmail /></span>
                <input className="app-est__input" type="email" placeholder="usuario@upn.edu.co" value={correo} onChange={e => setCorreo(e.target.value)} required />
            </div>

            <div className="app-est__input-wrap anim-slide-up delay-2">
                <span className="app-est__input-icono"><IcoLock /></span>
                <input className="app-est__input" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <div className="anim-slide-up delay-3" style={{ width: '100%', marginTop: '8px' }}>
                <button className="app-est__btn" type="submit" disabled={cargando}>
                    {cargando ? 'Verificando...' : 'Iniciar Sesión'}
                </button>
            </div>
            <p className="app-est__hint anim-slide-up delay-3">Usa las mismas credenciales del sistema UPN</p>
        </form>
    );
}

// ── TABS DEL DASHBOARD ─────────────────────────────────────────────────────

// Tab 1: Historial de Salidas
function TabMisSalidas({ usuario, token }) {
    const [salidas,           setSalidas]           = useState([]);
    const [cargando,          setCargando]          = useState(true);
    const [salidaSeleccionada, setSalidaSeleccionada] = useState(null);
    const [busqueda,          setBusqueda]          = useState('');
    const [filtroAnio,        setFiltroAnio]        = useState('');

    useEffect(() => {
        fetch(`/api/estudiante/mis-salidas/?usuario_id=${usuario.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(data => { if (data.ok) setSalidas(data.datos || []); })
        .finally(() => setCargando(false));
    }, [usuario.id, token]);

    // Años disponibles para filtro
    const anios = [...new Set(salidas.map(s => s.fecha_inicio?.slice(0,4)).filter(Boolean))].sort().reverse();

    // Salidas filtradas
    const salidaFiltradas = salidas.filter(s => {
        const texto = busqueda.toLowerCase();
        const coincideTexto = !busqueda ||
            s.nombre?.toLowerCase().includes(texto) ||
            s.asignatura?.toLowerCase().includes(texto) ||
            s.facultad?.toLowerCase().includes(texto);
        const coincideAnio = !filtroAnio || s.fecha_inicio?.startsWith(filtroAnio);
        return coincideTexto && coincideAnio;
    });

    // ── Renderizado del Bottom Sheet (via Portal) ────────────────────
    const renderDetalle = () => {
        const s = salidaSeleccionada;
        if (!s) return null;
        const IcoComponent = ICONOS[s.icono] || ICONOS['IcoMap'];
        const sal = fmtFechaHora(s.fecha_inicio, s.hora_inicio);
        const lle = fmtFechaHora(s.fecha_fin, s.hora_fin);
        const STEPS = ['borrador','aprobada','preembarque','ejecucion','finalizada'];
        const STEP_LABELS = ['Borrador','Coordinación','Pre‑embarque','En curso','Finalizada'];
        const currentStep = STEPS.indexOf((s.estado_salida || '').toLowerCase());

        const sheet = (
            <div className="det__overlay" onClick={() => setSalidaSeleccionada(null)}>
                <div className="det__sheet" onClick={e => e.stopPropagation()} style={{ height: '100dvh', maxHeight: '100dvh', borderRadius: 0 }}>

                    {/* Hero con handle flotante */}
                    <div className="det__hero" style={{ background: s.color || '#16a34a' }}>
                        <div className="det__handle" />
                        {PORTADAS[s.icono] ? (
                            <img src={PORTADAS[s.icono]} className="det__hero-img" alt="" />
                        ) : (
                            <div className="det__hero-icon">{IcoComponent}</div>
                        )}
                        <div className="det__hero-overlay" />
                        <div className="det__hero-content">
                            <span className="det__badge">{s.estado_inscripcion}</span>
                            <h2 className="det__hero-title">{s.nombre}</h2>
                            {s.codigo && <span className="det__hero-code"># {s.codigo}</span>}
                        </div>
                        <button className="det__close" onClick={() => setSalidaSeleccionada(null)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>

                    {/* Scrollable body */}
                    <div className="det__body">


                        {/* Info académica */}
                        <div className="det__section">
                            <p className="det__section-title">Información Académica</p>
                            <div className="det__info-grid">
                                {s.facultad && <div className="det__info-item"><span className="det__info-label">Facultad</span><span className="det__info-val">{s.facultad}</span></div>}
                                {s.programa  && <div className="det__info-item"><span className="det__info-label">Programa</span><span className="det__info-val">{s.programa}</span></div>}
                                {s.asignatura && <div className="det__info-item"><span className="det__info-label">Asignatura</span><span className="det__info-val">{s.asignatura}</span></div>}
                                {s.semestre  && <div className="det__info-item"><span className="det__info-label">Semestre</span><span className="det__info-val">{s.semestre}</span></div>}
                            </div>
                        </div>

                        {/* Ticket de fechas */}
                        {(sal || lle) && (
                            <div className="det__section">
                                <p className="det__section-title">Horario</p>
                                <div className="det__ticket">
                                    <div className="det__ticket-col">
                                        <span className="det__ticket-label">Salida</span>
                                        {sal && <span className="det__ticket-date">{sal.dia}</span>}
                                        {sal?.hora && <span className="det__ticket-time">{sal.hora}</span>}
                                    </div>
                                    <span className="det__ticket-arrow">→</span>
                                    <div className="det__ticket-col det__ticket-col--arr">
                                        <span className="det__ticket-label">Llegada</span>
                                        {lle && <span className="det__ticket-date">{lle.dia}</span>}
                                        {lle?.hora && <span className="det__ticket-time det__ticket-time--arr">{lle.hora}</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Métricas */}
                        {(s.dias_duracion || s.horas_viaje || s.distancia_km || s.cupos_disponibles) && (
                            <div className="det__section">
                                <p className="det__section-title">Métricas</p>
                                <div className="det__metrics">
                                    {s.dias_duracion   && <div className="det__metric-chip"><span className="det__metric-val">{s.dias_duracion}</span><span className="det__metric-label">Días</span></div>}
                                    {s.horas_viaje     && <div className="det__metric-chip"><span className="det__metric-val">{s.horas_viaje}</span><span className="det__metric-label">Hrs viaje</span></div>}
                                    {s.distancia_km    && <div className="det__metric-chip"><span className="det__metric-val">{s.distancia_km}</span><span className="det__metric-label">Km</span></div>}
                                    {s.cupos_disponibles && <div className="det__metric-chip"><span className="det__metric-val">{s.cupos_disponibles}</span><span className="det__metric-label">Cupos</span></div>}
                                </div>
                            </div>
                        )}

                        {/* Itinerario */}
                        {(s.punto_partida || s.parada_max) && (
                            <div className="det__section">
                                <p className="det__section-title">Itinerario</p>
                                {s.punto_partida && (
                                    <div className="det__itinerary-row">
                                        <div className="det__itin-dot det__itin-dot--start" />
                                        <div className="det__itin-text">
                                            <span className="det__info-label">Punto de partida</span>
                                            <span className="det__info-val">{s.punto_partida}</span>
                                        </div>
                                    </div>
                                )}
                                {s.punto_partida && s.parada_max && <div className="det__itin-line" />}
                                {s.parada_max && (
                                    <div className="det__itinerary-row">
                                        <div className="det__itin-dot det__itin-dot--end" />
                                        <div className="det__itin-text">
                                            <span className="det__info-label">Destino / Paradas</span>
                                            <span className="det__info-val">{s.parada_max}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Descripción académica */}
                        {(s.resumen || s.objetivo_general || s.justificacion) && (
                            <div className="det__section">
                                <p className="det__section-title">Académico</p>
                                {s.resumen && <div className="det__text-block"><span className="det__info-label">Resumen</span><p className="det__text-p">{s.resumen}</p></div>}
                                {s.objetivo_general && <div className="det__text-block"><span className="det__info-label">Objetivo general</span><p className="det__text-p">{s.objetivo_general}</p></div>}
                                {s.justificacion && <div className="det__text-block"><span className="det__info-label">Justificación</span><p className="det__text-p">{s.justificacion}</p></div>}
                            </div>
                        )}

                        {/* Nota del profesor */}
                        {s.nota_cambio && (
                            <div className="det__section det__section--alert">
                                <div className="det__alert">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                    <div>
                                        <span className="det__alert-title">Nota del profesor</span>
                                        <p className="det__alert-text">{s.nota_cambio}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ height: '24px' }} />
                    </div>
                </div>
            </div>
        );

        return createPortal(sheet, document.body);
    };

    return (
        <div className="app-est__tab-content anim-slide-up">
            <h2 className="app-est__section-title">Mis Salidas</h2>

            {/* Buscador */}
            <div style={{ display:'flex', gap:'8px', marginBottom:'12px', flexWrap:'wrap' }}>
                <input
                    className="app-est__input"
                    placeholder="Buscar salida..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    style={{ flex:1, minWidth:'140px', paddingLeft:'12px', fontSize:'0.82rem' }}
                />
                {anios.length > 0 && (
                    <select
                        className="app-est__input"
                        value={filtroAnio}
                        onChange={e => setFiltroAnio(e.target.value)}
                        style={{ flex:'0 0 90px', paddingLeft:'8px', fontSize:'0.82rem', cursor:'pointer' }}
                    >
                        <option value="">Año</option>
                        {anios.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                )}
            </div>

            {cargando ? (
                <p className="app-est__loading">Cargando salidas...</p>
            ) : salidaFiltradas.length === 0 ? (
                <div className="app-est__empty-state">
                    <IcoCheck />
                    <p>{busqueda || filtroAnio ? 'Sin resultados para tu búsqueda.' : 'No tienes salidas registradas.'}</p>
                </div>
            ) : (
                <div className="app-est__list">
                    {salidaFiltradas.map(salida => {
                        const IcoComp  = ICONOS[salida.icono] || ICONOS['IcoMap'];
                        const cardColor = salida.color || '#4A8DAC';
                        const isLight   = colorEsClaro(cardColor);
                        const claseTema = isLight ? 'card-new--light' : 'card-new--dark';
                        const sal = fmtFechaHora(salida.fecha_inicio, salida.hora_inicio);
                        const lle = fmtFechaHora(salida.fecha_fin,    salida.hora_fin);

                        return (
                            <div
                                key={salida.salida_id}
                                className={`card-new ${claseTema}`}
                                style={{ background: isLight ? '#ffffff' : cardColor, cursor: 'pointer' }}
                                onClick={() => setSalidaSeleccionada(salida)}
                            >
                                {/* Imagen/Ícono de fondo */}
                                {PORTADAS[salida.icono] ? (
                                    <div className="card-new__bg-icon" style={{ opacity:1, width:'220px', height:'220px', right:'-10px', top:'auto', bottom:'-10px', transform:'rotate(-5deg)', zIndex:0 }}>
                                        <img src={PORTADAS[salida.icono]} alt="" style={{ width:'100%', height:'100%', objectFit:'contain', mixBlendMode:'multiply' }} />
                                    </div>
                                ) : (
                                    <div className="card-new__bg-icon">{IcoComp}</div>
                                )}

                                <div className="card-new__content" style={{ zIndex:1 }}>
                                    <div className="card-new__header">
                                        <h3 className="card-new__title">{salida.nombre || 'Sin Nombre'}</h3>
                                        <p className="card-new__subtitle">
                                            {[salida.facultad, salida.programa].filter(Boolean).join(' | ') || truncarPalabras(salida.asignatura)}
                                        </p>
                                        {salida.nota_cambio && (
                                            <div style={{ display:'inline-flex', alignItems:'center', gap:'5px', marginTop:'6px', padding:'4px 10px', background:'rgba(255,255,255,0.8)', border:'1px solid rgba(0,0,0,0.1)', borderRadius:'6px', fontSize:'10px', fontWeight:'700', color:'#1e293b', backdropFilter:'blur(4px)' }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                                {salida.nota_cambio}
                                            </div>
                                        )}
                                    </div>

                                    {/* Ticket Salida → Llegada */}
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

            {/* Bottom sheet portal */}
            {salidaSeleccionada && renderDetalle()}
        </div>
    );
}

// Tab 2: Inscribirse (Ficha Autorización)
function TabInscribirse({ usuario, token, paramSalidaId, onExito }) {
    const [salidaId, setSalidaId] = useState(paramSalidaId || '');
    const [paso, setPaso] = useState(1);
    const [yaInscrito, setYaInscrito] = useState(false);
    const [mostrarTerminos, setMostrarTerminos] = useState(false);

    const TERMINOS = "Al firmar este documento, declaro que participo de manera libre y voluntaria en la salida de campo académica. Comprendo y acepto acatar todas las normas de convivencia, seguridad y protocolos establecidos por la Universidad y los docentes a cargo. Asumo la responsabilidad por mi comportamiento y cuidado personal. Asimismo, exonero a la Universidad de toda responsabilidad civil, penal o administrativa frente a situaciones de fuerza mayor, caso fortuito o aquellas derivadas de mi propia negligencia o incumplimiento de instrucciones durante el desarrollo de la actividad.";

    // Escáner QR
    const scannerRef = useRef(null);
    const [foto, setFoto] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [tieneFirma, setTieneFirma] = useState(false);
    const [requiereFoto, setRequiereFoto] = useState(true);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    // Escáner QR
    const [escaneando, setEscaneando] = useState(false);
    const videoRef  = useRef(null);
    const streamRef = useRef(null);

    const abrirEscaner = async () => {
        setEscaneando(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                const scan = () => {
                    if (!videoRef.current || !escaneando) return;
                    const canvas = document.createElement('canvas');
                    canvas.width  = videoRef.current.videoWidth;
                    canvas.height = videoRef.current.videoHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(videoRef.current, 0, 0);
                    // Leer QR via API de BarcodeDetector si disponible
                    if ('BarcodeDetector' in window) {
                        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
                        detector.detect(canvas).then(codes => {
                            if (codes.length > 0) {
                                const val = codes[0].rawValue;
                                setSalidaId(val);
                                cerrarEscaner();
                                return;
                            }
                            requestAnimationFrame(scan);
                        }).catch(() => requestAnimationFrame(scan));
                    } else {
                        requestAnimationFrame(scan);
                    }
                };
                videoRef.current.onloadedmetadata = () => requestAnimationFrame(scan);
            }
        } catch (err) {
            setError('No se pudo acceder a la cámara.');
            setEscaneando(false);
        }
    };

    const cerrarEscaner = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        setEscaneando(false);
    };

    const inputFotoRef = useRef(null);
    const canvasRef = useRef(null);
    const dibujando = useRef(false);
    const ultimoPos = useRef({ x: 0, y: 0 });

    const handleValidarCodigo = async (e) => {
        e.preventDefault();
        if (!salidaId) return;

        setCargando(true);
        setError('');
        setYaInscrito(false);
        try {
            const formData = new FormData();
            formData.append('usuario_id', usuario.id);

            const res = await fetch(`/api/estudiante/salidas/${salidaId}/inscribirse/`, {
                method:  'POST',
                headers: { Authorization: `Bearer ${token}` },
                body:    formData,
            });
            const data = await res.json();

            if (!res.ok) {
                if (data.error && data.error.includes('Firma requerida')) {
                    setRequiereFoto(data.requiere_foto !== false); // Si viene false, no la requiere
                    setPaso(2); // Solicitar foto (opcional) y firma (obligatoria)
                } else if (data.error && data.error.includes('Certificado EPS')) {
                    throw new Error(data.error); // Ya tiene un msj descriptivo
                } else if (data.error && data.error.includes('Ya estás inscrito')) {
                    setYaInscrito(true); // Mostrar mensaje especial
                } else {
                    throw new Error(data.error || 'Error al validar la inscripción');
                }
            } else {
                setPaso(3); // Inscripción exitosa
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };


    // Foto
    const handleFoto = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFoto(file);
        setFotoPreview(URL.createObjectURL(file));
    };

    // Canvas de firma
    const getPosCanvas = (e, canvas) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width  / rect.width;
        const scaleY = canvas.height / rect.height;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top)  * scaleY,
        };
    };

    const iniciarTrazo = useCallback((e) => {
        e.preventDefault();
        dibujando.current = true;
        const pos = getPosCanvas(e, canvasRef.current);
        ultimoPos.current = pos;
    }, []);

    const dibujar = useCallback((e) => {
        e.preventDefault();
        if (!dibujando.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const pos = getPosCanvas(e, canvas);

        ctx.strokeStyle = '#00bcd4';
        ctx.lineWidth   = 2.5;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';

        ctx.beginPath();
        ctx.moveTo(ultimoPos.current.x, ultimoPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        ultimoPos.current = pos;
        if (!tieneFirma) setTieneFirma(true);
    }, [tieneFirma]);

    const finalizarTrazo = useCallback(() => { dibujando.current = false; }, []);

    useEffect(() => {
        if (paso !== 2) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        canvas.width  = rect.width  * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        const ctx = canvas.getContext('2d');
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        ctx.fillStyle = '#112240';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, [paso]);

    const limpiarFirma = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#112240';
        ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
        setTieneFirma(false);
    };

    const handleEnviar = async () => {
        if (requiereFoto && !foto) { setError('Debes subir tu foto de identificación.'); return; }
        if (!tieneFirma) { setError('Debes dibujar tu firma digital.'); return; }
        setError('');
        setCargando(true);

        try {
            const canvas = canvasRef.current;
            const firmaBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const formData = new FormData();
            if (foto) {
                formData.append('foto_ficha', foto, 'foto.jpg');
            }
            formData.append('firma_digital', firmaBlob, 'firma.png');
            formData.append('usuario_id', usuario.id);

            const res = await fetch(`/api/estudiante/salidas/${salidaId}/inscribirse/`, {
                method:  'POST',
                headers: { Authorization: `Bearer ${token}` },
                body:    formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'No se pudo completar la inscripción');
            
            // Éxito
            setPaso(3);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    if (paso === 1) {
        return (
            <div className="app-est__tab-content anim-slide-up">
                <h2 className="app-est__section-title">Nueva Salida</h2>
                <p className="app-est__hint">Ingresa el código numérico de la salida a la que te vas a inscribir.</p>
                {error && <div className="app-est__error">{error}</div>}

                {/* Escáner QR activo */}
                {escaneando && (
                    <div style={{ position:'relative', borderRadius:'16px', overflow:'hidden', marginBottom:'16px', background:'#000' }}>
                        <video ref={videoRef} style={{ width:'100%', display:'block', maxHeight:'240px', objectFit:'cover' }} playsInline muted />
                        <button onClick={cerrarEscaner} style={{ position:'absolute', top:'8px', right:'8px', background:'rgba(0,0,0,0.6)', border:'none', borderRadius:'50%', width:'32px', height:'32px', color:'white', cursor:'pointer', fontSize:'18px' }}>×</button>
                        <div style={{ position:'absolute', inset:0, border:'2px solid #00bcd4', borderRadius:'16px', pointerEvents:'none' }} />
                        <p style={{ position:'absolute', bottom:'8px', left:0, right:0, textAlign:'center', color:'white', fontSize:'0.75rem', background:'rgba(0,0,0,0.5)', margin:0, padding:'4px' }}>Apunta la cámara al QR de la salida</p>
                    </div>
                )}

                {/* Mensaje ya inscrito */}
                {yaInscrito && (
                    <div style={{ background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'14px', padding:'16px', textAlign:'center', marginBottom:'16px' }}>
                        <div style={{ fontSize:'2rem', marginBottom:'8px' }}>✅</div>
                        <p style={{ color:'#10b981', fontWeight:700, margin:'0 0 4px' }}>¡Ya estás inscrito en esta salida!</p>
                        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.8rem', margin:0 }}>Puedes ver el estado en la pestaña <strong>Inicio</strong>.</p>
                    </div>
                )}

                <form onSubmit={handleValidarCodigo} style={{ marginTop: yaInscrito ? '0' : '20px' }}>
                    <div style={{ display:'flex', gap:'8px', marginBottom:'12px' }}>
                        <div className="app-est__input-wrap" style={{ flex:1 }}>
                            <input
                                className="app-est__input"
                                type="text"
                                placeholder="Código de la salida"
                                value={salidaId}
                                onChange={e => setSalidaId(e.target.value)}
                                required
                                style={{ paddingLeft: '20px' }}
                            />
                        </div>
                        <button type="button" onClick={escaneando ? cerrarEscaner : abrirEscaner} title="Escanear QR"
                            style={{ flexShrink:0, background: escaneando ? 'rgba(239,68,68,0.15)' : 'rgba(0,188,212,0.12)', border: `1px solid ${escaneando ? 'rgba(239,68,68,0.4)' : 'rgba(0,188,212,0.35)'}`, borderRadius:'14px', color: escaneando ? '#ef4444' : '#00bcd4', padding:'0 16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', height:'48px', transition:'all 0.2s' }}>
                            {escaneando ? (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            ) : (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    {/* Esquinas del frame QR */}
                                    <path d="M3 7V4a1 1 0 011-1h3" strokeLinecap="round"/>
                                    <path d="M17 3h3a1 1 0 011 1v3" strokeLinecap="round"/>
                                    <path d="M21 17v3a1 1 0 01-1 1h-3" strokeLinecap="round"/>
                                    <path d="M7 21H4a1 1 0 01-1-1v-3" strokeLinecap="round"/>
                                    {/* Cuadrado superior izquierdo */}
                                    <rect x="6" y="6" width="4" height="4" rx="0.5"/>
                                    {/* Cuadrado superior derecho */}
                                    <rect x="14" y="6" width="4" height="4" rx="0.5"/>
                                    {/* Cuadrado inferior izquierdo */}
                                    <rect x="6" y="14" width="4" height="4" rx="0.5"/>
                                    {/* Línea de datos */}
                                    <line x1="14" y1="14" x2="14" y2="14.01" strokeWidth="2.5"/>
                                    <line x1="14" y1="17" x2="18" y2="17"/>
                                    <line x1="18" y1="14" x2="18" y2="18"/>
                                </svg>
                            )}
                        </button>
                    </div>
                    <button type="submit" className="app-est__btn" disabled={cargando}>
                        {cargando ? 'Verificando...' : 'Inscribirme'}
                    </button>
                </form>
            </div>
        );
    }

    if (paso === 3) {
        return (
            <div className="app-est__tab-content anim-slide-up" style={{ textAlign: 'center', paddingTop: '40px' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--app-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <IcoCheck />
                </div>
                <h2 className="app-est__section-title">¡Inscripción Enviada!</h2>
                <p className="app-est__hint">Tu profesor revisará tu autorización.</p>
                <button className="app-est__btn app-est__btn--outline" onClick={() => { setSalidaId(''); setPaso(1); onExito(); }} style={{ marginTop: '30px' }}>
                    Volver a Mis Salidas
                </button>
            </div>
        );
    }

    return (
        <div className="app-est__tab-content anim-slide-up">
            <h2 className="app-est__section-title">Autorización (Salida #{salidaId})</h2>

            <div className="app-est__ficha-grid">
                <div className="app-est__foto-area" style={{ display: requiereFoto ? 'block' : 'none' }}>
                    <input ref={inputFotoRef} type="file" accept="image/*" capture="user" className="app-est__input-file" onChange={handleFoto} />
                    {fotoPreview ? (
                        <img src={fotoPreview} alt="Tu foto" className="app-est__foto-preview" onClick={() => inputFotoRef.current?.click()} />
                    ) : (
                        <div className="app-est__foto-placeholder" onClick={() => inputFotoRef.current?.click()}>
                            <IcoCamera /><span>Tomar selfie</span>
                        </div>
                    )}
                </div>

                {!requiereFoto && (
                    <div style={{ background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'14px', padding:'12px', textAlign:'center', marginBottom:'16px' }}>
                        <span style={{ fontSize:'1.5rem', display:'block', marginBottom:'4px' }}>✅</span>
                        <p style={{ color:'#10b981', fontWeight:600, fontSize:'0.85rem', margin:0 }}>Tu foto de identificación ya está guardada en el sistema.</p>
                    </div>
                )}

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', marginBottom: '16px', fontSize: '0.8rem', color: 'var(--app-dim)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: mostrarTerminos ? '8px' : '0' }}>
                        <strong style={{ color: 'white' }}>Consentimiento Informado</strong>
                        <button type="button" onClick={() => setMostrarTerminos(!mostrarTerminos)} style={{ background: 'none', border: 'none', color: 'var(--app-cyan)', fontSize: '0.8rem', cursor: 'pointer', padding: 0, fontWeight: 700 }}>
                            {mostrarTerminos ? 'Ver menos' : 'Leer completo'}
                        </button>
                    </div>
                    {mostrarTerminos ? (
                        <p style={{ margin: 0, lineHeight: 1.5, textAlign: 'justify', color: 'var(--app-muted)' }}>{TERMINOS}</p>
                    ) : (
                        <p style={{ margin: 0, lineHeight: 1.5, textAlign: 'justify', color: 'var(--app-muted)' }}>
                            {TERMINOS.substring(0, 110)}...
                        </p>
                    )}
                </div>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--app-muted)' }}>Firma digital de aceptación</span>
                        <button type="button" className="app-est__limpiar-btn" onClick={limpiarFirma}><IcoPen /> Limpiar</button>
                    </div>
                    <canvas
                        ref={canvasRef}
                        className={`app-est__firma-canvas ${tieneFirma ? 'tiene-firma' : ''}`}
                        onMouseDown={iniciarTrazo} onMouseMove={dibujar} onMouseUp={finalizarTrazo} onMouseLeave={finalizarTrazo}
                        onTouchStart={iniciarTrazo} onTouchMove={dibujar} onTouchEnd={finalizarTrazo}
                    />
                </div>

                {error && <div className="app-est__error" style={{ marginTop: '16px', marginBottom: '16px' }}>{error}</div>}

                <button className="app-est__btn" onClick={handleEnviar} disabled={cargando || (requiereFoto && !foto) || !tieneFirma} type="button">
                    {cargando ? 'Enviando...' : 'Confirmar Inscripción'}
                </button>
                <button className="app-est__btn app-est__btn--outline" onClick={() => setPaso(1)} type="button" style={{ marginTop: '0' }}>
                    Cancelar
                </button>
            </div>
        </div>
    );
}

// Tab 3: Documentos
function TabDocumentos({ usuario, token }) {
    const [docs, setDocs] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [subiendo, setSubiendo] = useState('');
    const [docPreviewUrl, setDocPreviewUrl] = useState(null);

    const cargarDocs = useCallback(() => {
        fetch(`/api/estudiante/mis-documentos/?usuario_id=${usuario.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(data => {
            if (data.ok) setDocs(data.datos || []);
        })
        .finally(() => setCargando(false));
    }, [usuario.id, token]);

    useEffect(() => {
        cargarDocs();
    }, [cargarDocs]);

    const handleSubir = async (e, tipo) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSubiendo(tipo);
        const formData = new FormData();
        formData.append('archivo', file);
        formData.append('usuario_id', usuario.id);
        formData.append('tipo_documento', tipo);

        try {
            const res = await fetch(`/api/estudiante/mis-documentos/`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            if (!res.ok) throw new Error('Error en el servidor');
            cargarDocs();
        } catch (error) {
            alert('Error al subir documento');
        } finally {
            setSubiendo('');
        }
    };

    const handleEliminar = async (tipo) => {
        if (!window.confirm('¿Seguro que deseas eliminar este documento?')) return;
        setSubiendo(tipo); // reusar estado de loading
        try {
            const res = await fetch(`/api/estudiante/mis-documentos/?usuario_id=${usuario.id}&tipo_documento=${tipo}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Error al eliminar');
            cargarDocs();
        } catch (error) {
            alert('Error al eliminar documento');
        } finally {
            setSubiendo('');
        }
    };

    const getDocUrl = (tipo) => {
        const doc = docs.find(d => d.tipo_documento === tipo);
        return doc ? doc.url : null;
    };

    const isImage = docPreviewUrl && docPreviewUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i);

    return (
        <div className="app-est__tab-content anim-slide-up">
            <h2 className="app-est__section-title">Mis Documentos</h2>
            <p className="app-est__hint">Carga o actualiza tus documentos obligatorios.</p>

            <div className="app-est__doc-grid">
                <DocumentCard 
                    titulo="Certificado EPS" 
                    tipo="eps" 
                    url={getDocUrl('eps')} 
                    onSubir={handleSubir}
                    onEliminar={handleEliminar}
                    onPreview={() => setDocPreviewUrl(getDocUrl('eps'))}
                    subiendo={subiendo === 'eps'}
                />
                <DocumentCard 
                    titulo="Doc. Identidad" 
                    tipo="documento_identidad" 
                    url={getDocUrl('documento_identidad')} 
                    onSubir={handleSubir}
                    onEliminar={handleEliminar}
                    onPreview={() => setDocPreviewUrl(getDocUrl('documento_identidad'))}
                    subiendo={subiendo === 'documento_identidad'}
                />
            </div>

            {docPreviewUrl && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end', background: 'var(--app-card-dark)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                        <button onClick={() => setDocPreviewUrl(null)} className="app-est__btn app-est__btn--outline" style={{ width: 'auto', minHeight: '36px', padding: '0 20px', margin: 0 }}>Cerrar Preview</button>
                    </div>
                    <div style={{ flex: 1, padding: '10px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {isImage ? (
                            <img src={docPreviewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                        ) : (
                            <iframe src={docPreviewUrl} style={{ width: '100%', height: '100%', border: 'none', background: 'white', borderRadius: '8px' }} title="Previsualizador de Documento" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function DocumentCard({ titulo, tipo, url, onSubir, onEliminar, onPreview, subiendo }) {
    const inputRef = useRef(null);
    return (
        <div className="app-est__doc-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                <div className="app-est__doc-icon">
                    <IcoDoc />
                </div>
                <div className="app-est__doc-info" style={{ flex: 1 }}>
                    <strong>{titulo}</strong>
                    {url ? (
                        <span className="doc-status ok" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Listo
                        </span>
                    ) : (
                        <span className="doc-status missing" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            Pendiente
                        </span>
                    )}
                </div>
            </div>

            <input type="file" ref={inputRef} style={{ display: 'none' }} accept=".pdf,image/*" onChange={(e) => onSubir(e, tipo)} />
            
            <div style={{ display: 'grid', gridTemplateColumns: url ? '1fr 1fr 1fr' : '1fr', gap: '8px' }}>
                {url ? (
                    <>
                        <button className="app-est__doc-btn app-est__doc-btn--outline" onClick={onPreview} disabled={subiendo} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <IcoEye /> Ver
                        </button>
                        <button className="app-est__doc-btn app-est__doc-btn--outline" onClick={() => onEliminar(tipo)} disabled={subiendo} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <IcoTrash /> Borrar
                        </button>
                        <button className="app-est__doc-btn" onClick={() => inputRef.current?.click()} disabled={subiendo} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            {subiendo ? '...' : <><IcoRefresh /> Cambiar</>}
                        </button>
                    </>
                ) : (
                    <button className="app-est__doc-btn" onClick={() => inputRef.current?.click()} disabled={subiendo} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        {subiendo ? '...' : <><IcoUpload /> Subir Documento</>}
                    </button>
                )}
            </div>
        </div>
    );
}

// Tab 4: Perfil
function TabPerfil({ usuario, token, onActualizarUsuario }) {
    const [nombre,   setNombre]   = useState(usuario.nombre   || '');
    const [apellido, setApellido] = useState(usuario.apellido || '');
    const [telefono, setTelefono] = useState(usuario.telefono || '');
    const [guardando, setGuardando] = useState(false);
    const [msg, setMsg] = useState('');
    const [foto, setFoto] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(usuario.foto || null);
    const inputFotoRef = useRef(null);

    const handleGuardar = async (e) => {
        e.preventDefault();
        setGuardando(true); setMsg('');
        try {
            const fd = new FormData();
            fd.append('nombre',   nombre);
            fd.append('apellido', apellido);
            fd.append('telefono', telefono);
            if (foto) fd.append('foto', foto);
            const res = await fetch(`/api/estudiante/perfil/${usuario.id}/`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al guardar');
            setMsg('Perfil actualizado correctamente');
            if (onActualizarUsuario) onActualizarUsuario({ ...usuario, nombre, apellido, telefono, foto: fotoPreview });
        } catch (err) {
            setMsg(err.message);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="app-est__tab-content anim-slide-up">
            <h2 className="app-est__section-title">Mi Perfil</h2>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'16px', padding:'8px 0 20px' }}>
                <div style={{ position:'relative' }}>
                    <div className="app-est__avatar" style={{ width:'80px', height:'80px', fontSize:'1.8rem', overflow:'hidden' }}>
                        {fotoPreview
                            ? <img src={fotoPreview} alt="Foto" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                            : (usuario.nombre?.charAt(0) || '') + (usuario.apellido?.charAt(0) || '')}
                    </div>
                    <button onClick={() => inputFotoRef.current?.click()} style={{ position:'absolute', bottom:0, right:0, background:'#00bcd4', border:'none', borderRadius:'50%', width:'26px', height:'26px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}>
                        <IcoCamera />
                    </button>
                    <input type="file" ref={inputFotoRef} style={{ display:'none' }} accept="image/*" onChange={e => { const f = e.target.files?.[0]; if(f){ setFoto(f); setFotoPreview(URL.createObjectURL(f)); } }} />
                </div>
                <span style={{ fontSize:'0.75rem', color:'#64748b' }}>{usuario.correo}</span>
            </div>
            <form onSubmit={handleGuardar} style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {msg && <div className={msg.includes('Error') ? 'app-est__error' : 'app-est__success'}>{msg}</div>}
                
                <div className="app-est__input-wrap">
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Facultad</span>
                    <input className="app-est__input" value={usuario.facultad || 'No especificada'} disabled style={{ paddingLeft:'16px', background: 'var(--app-bg)', color: '#94a3b8', cursor: 'not-allowed' }} />
                </div>
                <div className="app-est__input-wrap">
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Programa</span>
                    <input className="app-est__input" value={usuario.programa || 'No especificado'} disabled style={{ paddingLeft:'16px', background: 'var(--app-bg)', color: '#94a3b8', cursor: 'not-allowed' }} />
                </div>
                <div className="app-est__input-wrap">
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Nombre</span>
                    <input className="app-est__input" value={nombre} disabled style={{ paddingLeft:'16px', background: 'var(--app-bg)', color: '#94a3b8', cursor: 'not-allowed' }} />
                </div>
                <div className="app-est__input-wrap">
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Apellido</span>
                    <input className="app-est__input" value={apellido} disabled style={{ paddingLeft:'16px', background: 'var(--app-bg)', color: '#94a3b8', cursor: 'not-allowed' }} />
                </div>
                <div className="app-est__input-wrap">
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Teléfono (Modificable)</span>
                    <input className="app-est__input" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} style={{ paddingLeft:'16px' }} />
                </div>
                <button type="submit" className="app-est__btn" disabled={guardando} style={{ marginTop:'8px' }}>
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>
            </form>
        </div>
    );
}

// Tab 5: Avisos y Notificaciones
function TabAvisos({ usuario, token }) {
    const [avisos,   setAvisos]   = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        fetch(`/api/estudiante/mis-salidas/?usuario_id=${usuario.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(data => {
            if (data.ok) {
                const nuevos = [];
                (data.datos || []).forEach(s => {
                    if ((s.estado_salida || '').toLowerCase() === 'cancelada') {
                        nuevos.push({ id: s.salida_id + '_cancel', tipo: 'alerta', titulo: `Salida cancelada: ${s.nombre}`, mensaje: 'Esta salida ha sido cancelada.', fecha: s.fecha_inicio });
                    }
                    if (s.nota_cambio) {
                        nuevos.push({ id: s.salida_id + '_nota', tipo: 'advertencia', titulo: `Novedad en: ${s.nombre}`, mensaje: s.nota_cambio, fecha: s.fecha_inicio });
                    }
                });
                setAvisos(nuevos);
            }
        })
        .finally(() => setCargando(false));
    }, [usuario.id, token]);

    return (
        <div className="app-est__tab-content anim-slide-up">
            <h2 className="app-est__section-title">Avisos y Notificaciones</h2>
            {cargando ? (
                <p className="app-est__loading">Buscando novedades...</p>
            ) : avisos.length === 0 ? (
                <div className="app-est__empty-state">
                    <IcoBell />
                    <p>No tienes nuevos avisos</p>
                    <small>Te notificaremos cuando haya novedades en tus salidas.</small>
                </div>
            ) : (
                <div className="app-est__list">
                    {avisos.map(aviso => (
                        <div key={aviso.id} className={`app-est__aviso-card ${aviso.tipo === 'advertencia' ? 'warning' : ''}`}>
                            <h4 className="app-est__aviso-title"><IcoBell /> {aviso.titulo}</h4>
                            <p className="app-est__aviso-desc">{aviso.mensaje}</p>
                            <small style={{ color:'rgba(255,255,255,0.5)', marginTop:'8px', display:'block' }}>Ref: {aviso.fecha}</small>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── COMPONENTE RAÍZ (DASHBOARD) ──────────────────────────────────────────────
export function AppEstudiante({ estudiante, token, onLogout, isEmbedded }) {
    const [searchParams] = useSearchParams();
    const urlSalidaId = searchParams.get('salidaId');

    const [tabActiva, setTabActiva] = useState(urlSalidaId ? 'inscribirse' : 'mis-salidas');

    // Efecto Typewriter
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

    // ── VISTA 2: MODO APP (Dashboard Completo) ──
    return (
        <div className="app-est mode-app">
            {/* Top App Bar */}
            <div className="app-est__topbar">
                <div className="app-est__topbar-user">
                    <div className="app-est__avatar" style={{ overflow:'hidden' }}>
                        {estudiante.foto
                            ? <img src={estudiante.foto} alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                            : (estudiante.nombre?.charAt(0) || '') + (estudiante.apellido?.charAt(0) || '')}
                    </div>
                    <div className="app-est__user-info">
                        <strong>{estudiante.nombre}</strong>
                        <span>{estudiante.programa}</span>
                    </div>
                </div>
                <button className="app-est__logout-btn" onClick={onLogout} title="Cerrar sesión">
                    <IcoLogOut />
                </button>
            </div>

            {/* Main Content Area */}
            <div className="app-est__main-content">
                {tabActiva === 'mis-salidas' && <TabMisSalidas usuario={estudiante} token={token} />}
                {tabActiva === 'inscribirse' && <TabInscribirse usuario={estudiante} token={token} paramSalidaId={urlSalidaId} onExito={() => setTabActiva('mis-salidas')} />}
                {tabActiva === 'documentos'  && <TabDocumentos usuario={estudiante} token={token} />}
                {tabActiva === 'perfil'      && <TabPerfil usuario={estudiante} token={token} />}
                {tabActiva === 'avisos'      && <TabAvisos usuario={estudiante} token={token} />}
            </div>

            {/* Bottom Navigation con FAB central */}
            <div className="app-est__bottom-nav">
                <div className="nav-group">
                    <button className={`nav-item ${tabActiva === 'mis-salidas' ? 'active' : ''}`} onClick={() => setTabActiva('mis-salidas')}>
                        <IcoHome /><span>Inicio</span>
                    </button>
                    <button className={`nav-item ${tabActiva === 'documentos' ? 'active' : ''}`} onClick={() => setTabActiva('documentos')}>
                        <IcoDoc /><span>Docs</span>
                    </button>
                </div>

                <div className="nav-fab-wrapper">
                    <button className={`nav-fab ${tabActiva === 'inscribirse' ? 'active' : ''}`} onClick={() => setTabActiva('inscribirse')}>
                        <IcoPlus />
                    </button>
                    <span className="nav-fab-label">Nueva</span>
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

export default AppEstudiante;
