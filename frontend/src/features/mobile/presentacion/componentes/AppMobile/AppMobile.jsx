import React, { useState, useEffect, useRef } from 'react';
import './AppMobile.css';
import { AppEstudiante } from '@/features/salidas/presentacion/componentes/AppEstudiante/AppEstudiante';
import AppConductor from '@/features/conductor/presentacion/componentes/AppConductor/AppConductor';
import { mobileAuthService } from '../../../api/mobileAuth.service';

const IMG_SALIDA = 'https://i.ibb.co/gM0V53bQ/Gemini-Generated-Image-waibopwaibopwaib.png';
const IMG_UPN    = 'https://i.ibb.co/HfF3ZTrD/uopn-bklanco.png';
const IMG_OTIUM  = 'https://i.ibb.co/gFMbpC0X/Gemini-Generated-Image-svbxdfsvbxdfsvbx-removebg-preview.png';
const TAGLINE    = 'Explora, aprende y vive el territorio';

const IcoEmail  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>;
const IcoLock   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;

export const AppMobile = () => {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const [cargando, setCargando] = useState(true);
    
    // Estados de Login
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loadingLogin, setLoadingLogin] = useState(false);

    // Estado Cambio Contraseña
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [errorPass, setErrorPass] = useState('');
    const [loadingPass, setLoadingPass] = useState(false);

    // Efecto Typewriter
    const [typed, setTyped] = useState('');
    const intervalRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('mobile_usuario');
        const storedToken = localStorage.getItem('mobile_token');
        if (storedUser && storedToken) {
            try {
                setUsuario(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (e) {
                console.error("Error parseando usuario", e);
            }
        }
        setCargando(false);
    }, []);

    useEffect(() => {
        if (usuario || cargando) return; // Si ya se logueó, no animar
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
    }, [usuario, cargando]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoadingLogin(true);

        try {
            const datosAuth = await mobileAuthService.login(correo, password);

            const userData = datosAuth.usuario;
            const userToken = datosAuth.access;

            setUsuario(userData);
            setToken(userToken);
            localStorage.setItem('mobile_usuario', JSON.stringify(userData));
            localStorage.setItem('mobile_token', userToken);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingLogin(false);
        }
    };

    const handleLogout = () => {
        setUsuario(null);
        setToken(null);
        localStorage.removeItem('mobile_usuario');
        localStorage.removeItem('mobile_token');
        
        // También limpiar variables antiguas si las hay
        localStorage.removeItem('estudiante');
        localStorage.removeItem('conductor_token');
        localStorage.removeItem('conductor_perfil');
    };

    if (cargando) {
        return <div className="app-mobile-loading">Cargando Otium...</div>;
    }

    // Si NO hay sesión, mostrar pantalla de Login Unificada (Estilo Estudiante Premium)
    if (!usuario || !token) {
        return (
            <div className="app-mobile">
                <div className="app-mobile__hero">
                    <img src={IMG_SALIDA} alt="Paisaje" className="app-mobile__hero-img" />
                    <div className="app-mobile__hero-overlay" />
                    <div className="app-mobile__hero-content anim-slide-up">
                        <img src={IMG_UPN} alt="UPN" className="app-mobile__logo" />
                        <h1 className="app-mobile__hero-title">Otium App</h1>
                        <div className="app-mobile__otium-box">
                            <img src={IMG_OTIUM} alt="OTIUM" className="app-mobile__otium-logo" />
                            <span className="app-mobile__otium-tagline">{typed}<span className="app-mobile__cursor" /></span>
                        </div>
                    </div>
                </div>
                <div className="app-mobile__card login-card">
                    <form className="app-mobile__form" onSubmit={handleLogin}>
                        <h2 className="app-mobile__card-title anim-slide-up">Ingresar</h2>
                        {error && <div className="app-mobile__error anim-slide-up delay-1">{error}</div>}
                        
                        <div className="app-mobile__input-wrap anim-slide-up delay-1">
                            <span className="app-mobile__input-icono"><IcoEmail /></span>
                            <input className="app-mobile__input" type="email" placeholder="usuario@upn.edu.co" value={correo} onChange={e => setCorreo(e.target.value)} required />
                        </div>

                        <div className="app-mobile__input-wrap anim-slide-up delay-2">
                            <span className="app-mobile__input-icono"><IcoLock /></span>
                            <input className="app-mobile__input" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>

                        <div className="anim-slide-up delay-3" style={{ width: '100%', marginTop: '8px' }}>
                            <button className="app-mobile__btn" type="submit" disabled={loadingLogin}>
                                {loadingLogin ? 'Verificando...' : 'Iniciar Sesión'}
                            </button>
                        </div>
                        <p className="app-mobile__hint anim-slide-up delay-3">Usa las credenciales de tu rol (Estudiante/Conductor)</p>
                    </form>
                </div>
            </div>
        );
    }

    // Si DEBE cambiar contraseña (primera vez o forzado)
    if (usuario.debe_cambiar_password) {
        const handleCambiarPassword = async (e) => {
            e.preventDefault();
            setErrorPass('');
            if (nuevaPassword.length < 4) {
                setErrorPass('La contraseña debe tener al menos 4 caracteres.');
                return;
            }
            if (nuevaPassword !== confirmarPassword) {
                setErrorPass('Las contraseñas no coinciden.');
                return;
            }
            setLoadingPass(true);
            try {
                const res = await mobileAuthService.cambiarPassword(nuevaPassword, token);
                setUsuario(res.usuario);
                setToken(res.access);
                localStorage.setItem('mobile_usuario', JSON.stringify(res.usuario));
                localStorage.setItem('mobile_token', res.access);
            } catch (err) {
                setErrorPass(err.message);
            } finally {
                setLoadingPass(false);
            }
        };

        return (
            <div className="app-mobile">
                <div className="app-mobile__card login-card" style={{ margin: 'auto', marginTop: '40px' }}>
                    <form className="app-mobile__form" onSubmit={handleCambiarPassword}>
                        <h2 className="app-mobile__card-title">Cambio de Contraseña</h2>
                        <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', marginBottom: '20px' }}>
                            Por tu seguridad, debes actualizar tu contraseña antes de continuar.
                        </p>
                        
                        {errorPass && <div className="app-mobile__error">{errorPass}</div>}
                        
                        <div className="app-mobile__input-wrap">
                            <span className="app-mobile__input-icono"><IcoLock /></span>
                            <input className="app-mobile__input" type="password" placeholder="Nueva Contraseña" value={nuevaPassword} onChange={e => setNuevaPassword(e.target.value)} required minLength="4" />
                        </div>
                        
                        <div className="app-mobile__input-wrap" style={{ marginTop: '12px' }}>
                            <span className="app-mobile__input-icono"><IcoLock /></span>
                            <input className="app-mobile__input" type="password" placeholder="Confirmar Contraseña" value={confirmarPassword} onChange={e => setConfirmarPassword(e.target.value)} required minLength="4" />
                        </div>

                        <div style={{ width: '100%', marginTop: '20px' }}>
                            <button className="app-mobile__btn" type="submit" disabled={loadingPass}>
                                {loadingPass ? 'Guardando...' : 'Actualizar Contraseña'}
                            </button>
                        </div>
                        <button type="button" onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', marginTop: '16px', cursor: 'pointer', textDecoration: 'underline', width: '100%' }}>
                            Cerrar Sesión
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Ruteo Interno basado en ROL
    if (usuario.rol === 'conductor') {
        return <AppConductor conductor={usuario} token={token} onLogout={handleLogout} isEmbedded={true} />;
    } else {
        return <AppEstudiante estudiante={usuario} token={token} onLogout={handleLogout} isEmbedded={true} />;
    }
};

export default AppMobile;
