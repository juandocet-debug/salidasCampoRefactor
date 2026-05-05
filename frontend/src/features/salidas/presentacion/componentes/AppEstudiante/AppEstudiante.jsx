import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import './AppEstudiante.css';

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
    const [salidas, setSalidas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        fetch(`/api/estudiante/mis-salidas/?usuario_id=${usuario.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(data => {
            if (data.ok) setSalidas(data.datos || []);
        })
        .finally(() => setCargando(false));
    }, [usuario.id, token]);

    return (
        <div className="app-est__tab-content anim-slide-up">
            <h2 className="app-est__section-title">Mis Salidas</h2>
            {cargando ? (
                <p className="app-est__loading">Cargando salidas...</p>
            ) : salidas.length === 0 ? (
                <div className="app-est__empty-state">
                    <IcoCheck />
                    <p>No tienes salidas registradas.</p>
                </div>
            ) : (
                <div className="app-est__list">
                    {salidas.map(salida => (
                        <div key={salida.salida_id} className="app-est__card-item">
                            <div className="app-est__card-item-header">
                                <strong>{salida.nombre}</strong>
                                <span className={`app-est__badge status-${salida.estado_inscripcion.toLowerCase().replace(' ', '-')}`}>
                                    {salida.estado_inscripcion}
                                </span>
                            </div>
                            <div className="app-est__card-item-body">
                                <p>{salida.asignatura}</p>
                                <small>{salida.fecha_inicio} al {salida.fecha_fin}</small>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Tab 2: Inscribirse (Ficha Autorización)
function TabInscribirse({ usuario, token, paramSalidaId, onExito }) {
    const [salidaId, setSalidaId] = useState(paramSalidaId || '');
    const [paso, setPaso] = useState(1);
    
    const [foto, setFoto] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [tieneFirma, setTieneFirma] = useState(false);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const inputFotoRef = useRef(null);
    const canvasRef = useRef(null);
    const dibujando = useRef(false);
    const ultimoPos = useRef({ x: 0, y: 0 });

    const handleValidarCodigo = async (e) => {
        e.preventDefault();
        if (!salidaId) return;
        
        setCargando(true);
        setError('');
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
                if (data.error && data.error.includes('obligatorias para tu primera inscripción')) {
                    setPaso(2); // Solicitar foto y firma por ser la primera vez
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
        if (!foto) { setError('Debes subir tu foto de identificación.'); return; }
        if (!tieneFirma) { setError('Debes dibujar tu firma digital.'); return; }
        setError('');
        setCargando(true);

        try {
            const canvas = canvasRef.current;
            const firmaBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const formData = new FormData();
            formData.append('foto_ficha', foto, 'foto.jpg');
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
                
                <form onSubmit={handleValidarCodigo} style={{ marginTop: '20px' }}>
                    <div className="app-est__input-wrap">
                        <input 
                            className="app-est__input" 
                            type="number" 
                            placeholder="Código de la salida" 
                            value={salidaId} 
                            onChange={e => setSalidaId(e.target.value)} 
                            required 
                            style={{ paddingLeft: '20px' }}
                        />
                    </div>
                    <button type="submit" className="app-est__btn" disabled={cargando}>
                        {cargando ? 'Inscribiendo...' : 'Inscribirme'}
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
            {error && <div className="app-est__error">{error}</div>}

            <div className="app-est__ficha-grid">
                <div className="app-est__foto-area">
                    <input ref={inputFotoRef} type="file" accept="image/*" capture="user" className="app-est__input-file" onChange={handleFoto} />
                    {fotoPreview ? (
                        <img src={fotoPreview} alt="Tu foto" className="app-est__foto-preview" onClick={() => inputFotoRef.current?.click()} />
                    ) : (
                        <div className="app-est__foto-placeholder" onClick={() => inputFotoRef.current?.click()}>
                            <IcoCamera /><span>Tomar selfie</span>
                        </div>
                    )}
                </div>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--app-muted)' }}>Firma digital</span>
                        <button type="button" className="app-est__limpiar-btn" onClick={limpiarFirma}><IcoPen /> Limpiar</button>
                    </div>
                    <canvas
                        ref={canvasRef}
                        className={`app-est__firma-canvas ${tieneFirma ? 'tiene-firma' : ''}`}
                        onMouseDown={iniciarTrazo} onMouseMove={dibujar} onMouseUp={finalizarTrazo} onMouseLeave={finalizarTrazo}
                        onTouchStart={iniciarTrazo} onTouchMove={dibujar} onTouchEnd={finalizarTrazo}
                    />
                </div>

                <button className="app-est__btn" onClick={handleEnviar} disabled={cargando || !foto || !tieneFirma} type="button">
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
            await fetch(`/api/estudiante/mis-documentos/`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            cargarDocs();
        } catch (error) {
            alert('Error al subir documento');
        } finally {
            setSubiendo('');
        }
    };

    const getDocUrl = (tipo) => {
        const doc = docs.find(d => d.tipo_documento === tipo);
        return doc ? doc.url : null;
    };

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
                    subiendo={subiendo === 'eps'}
                />
                <DocumentCard 
                    titulo="Doc. Identidad" 
                    tipo="documento_identidad" 
                    url={getDocUrl('documento_identidad')} 
                    onSubir={handleSubir}
                    subiendo={subiendo === 'documento_identidad'}
                />
            </div>
        </div>
    );
}

function DocumentCard({ titulo, tipo, url, onSubir, subiendo }) {
    const inputRef = useRef(null);
    return (
        <div className="app-est__doc-card">
            <div className="app-est__doc-icon">
                <IcoDoc />
            </div>
            <div className="app-est__doc-info">
                <strong>{titulo}</strong>
                {url ? <span className="doc-status ok">Cargado</span> : <span className="doc-status missing">Pendiente</span>}
            </div>
            <input type="file" ref={inputRef} style={{ display: 'none' }} accept=".pdf,image/*" onChange={(e) => onSubir(e, tipo)} />
            <button className="app-est__doc-btn" onClick={() => inputRef.current?.click()} disabled={subiendo}>
                {subiendo ? '...' : (url ? 'Actualizar' : 'Subir')}
            </button>
        </div>
    );
}

// ── COMPONENTE RAÍZ (DASHBOARD) ──────────────────────────────────────────────
export default function AppEstudiante() {
    const [searchParams] = useSearchParams();
    const urlSalidaId = searchParams.get('salidaId');

    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState('');
    const [tabActiva, setTabActiva] = useState(urlSalidaId ? 'inscribirse' : 'mis-salidas');

    // Efecto Typewriter (Solo para login)
    const [typed, setTyped] = useState('');
    const intervalRef = useRef(null);

    useEffect(() => {
        if (usuario) return; // Si ya se logueó, no animar
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
    }, [usuario]);

    const handleLoginOk = ({ usuario: usr, access }) => {
        setUsuario(usr);
        setToken(access);
    };

    const handleLogout = () => {
        setUsuario(null);
        setToken('');
    };

    // ── VISTA 1: LOGIN (Con Hero Image) ──
    if (!usuario) {
        return (
            <div className="app-est">
                <div className="app-est__hero">
                    <img src={IMG_SALIDA} alt="Paisaje" className="app-est__hero-img" />
                    <div className="app-est__hero-overlay" />
                    <div className="app-est__hero-content anim-slide-up">
                        <img src={IMG_UPN} alt="UPN" className="app-est__logo" />
                        <h1 className="app-est__hero-title">Otium Estudiante</h1>
                        <div className="app-est__otium-box">
                            <img src={IMG_OTIUM} alt="OTIUM" className="app-est__otium-logo" />
                            <span className="app-est__otium-tagline">{typed}<span className="app-est__cursor" /></span>
                        </div>
                    </div>
                </div>
                <div className="app-est__card login-card">
                    <PasoLogin onLoginOk={handleLoginOk} />
                </div>
            </div>
        );
    }

    // ── VISTA 2: MODO APP (Dashboard Completo) ──
    return (
        <div className="app-est mode-app">
            {/* Top App Bar */}
            <div className="app-est__topbar">
                <div className="app-est__topbar-user">
                    <div className="app-est__avatar">
                        {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
                    </div>
                    <div className="app-est__user-info">
                        <strong>{usuario.nombre}</strong>
                        <span>{usuario.programa}</span>
                    </div>
                </div>
                <button className="app-est__logout-btn" onClick={handleLogout} title="Cerrar sesión">
                    <IcoLogOut />
                </button>
            </div>

            {/* Main Content Area */}
            <div className="app-est__main-content">
                {tabActiva === 'mis-salidas' && <TabMisSalidas usuario={usuario} token={token} />}
                {tabActiva === 'inscribirse' && <TabInscribirse usuario={usuario} token={token} paramSalidaId={urlSalidaId} onExito={() => setTabActiva('mis-salidas')} />}
                {tabActiva === 'documentos'  && <TabDocumentos usuario={usuario} token={token} />}
            </div>

            {/* Bottom Navigation */}
            <div className="app-est__bottom-nav">
                <button className={`nav-item ${tabActiva === 'mis-salidas' ? 'active' : ''}`} onClick={() => setTabActiva('mis-salidas')}>
                    <IcoHome />
                    <span>Inicio</span>
                </button>
                <button className={`nav-item ${tabActiva === 'inscribirse' ? 'active' : ''}`} onClick={() => setTabActiva('inscribirse')}>
                    <div className="nav-fab"><IcoPlus /></div>
                    <span>Nueva</span>
                </button>
                <button className={`nav-item ${tabActiva === 'documentos' ? 'active' : ''}`} onClick={() => setTabActiva('documentos')}>
                    <IcoDoc />
                    <span>Documentos</span>
                </button>
            </div>
        </div>
    );
}
