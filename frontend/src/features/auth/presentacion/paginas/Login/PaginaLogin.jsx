// src/modulos/autenticacion/paginas/PaginaLogin.jsx

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAutenticacion from '@/shared/hooks/useAutenticacion';
import { clienteHttp } from '@/shared/api/clienteHttp';
import './PaginaLogin.css';
import './PaginaLoginAnimaciones.css';

import { API_URL } from '@/shared/api/config';
const IMG_SALIDA = 'https://i.ibb.co/gM0V53bQ/Gemini-Generated-Image-waibopwaibopwaib.png';
const IMG_OTIUM = 'https://i.ibb.co/gFMbpC0X/Gemini-Generated-Image-svbxdfsvbxdfsvbx-removebg-preview.png';
const IMG_UPN = 'https://i.ibb.co/HfF3ZTrD/uopn-bklanco.png';
const TAGLINE = 'Explora, aprende y vive el territorio';

function OlaVertical() {
    return (
        <svg className="login__ola-svg" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 120 900" preserveAspectRatio="none">
            <path d="M120,0 C 70,150 130,300 80,450 C 30,600 80,750 120,900 L 120,900 L 120,0 Z"
                fill="#050e1a" />
            <path d="M120,0 C 70,150 130,300 80,450 C 30,600 80,750 120,900"
                fill="none" stroke="rgba(0,188,212,0.35)" strokeWidth="1.5" />
        </svg>
    );
}

const IcoEmail = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" />
    </svg>
);
const IcoLock = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
);

export default function PaginaLogin() {
    const navigate = useNavigate();
    const iniciarSesion = useAutenticacion(s => s.iniciarSesion);

    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    // Typewriter cíclico
    const [typed, setTyped] = useState('');
    const intervalRef = useRef(null);

    useEffect(() => {
        let i = 0;
        const escribir = () => {
            intervalRef.current = setInterval(() => {
                i++;
                setTyped(TAGLINE.slice(0, i));
                if (i >= TAGLINE.length) {
                    clearInterval(intervalRef.current);
                    setTimeout(borrar, 2200);
                }
            }, 55);
        };
        const borrar = () => {
            intervalRef.current = setInterval(() => {
                i--;
                setTyped(TAGLINE.slice(0, i));
                if (i <= 0) {
                    clearInterval(intervalRef.current);
                    setTimeout(escribir, 500);
                }
            }, 30);
        };
        const inicio = setTimeout(escribir, 800);
        return () => { clearTimeout(inicio); clearInterval(intervalRef.current); };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);
        try {
            const { data } = await clienteHttp.post('/api/auth/login/', { correo, contrasena });
            if (data.ok) {
                const { usuario, access } = data.datos;
                iniciarSesion(
                    { ...usuario, nombre: `${usuario.first_name} ${usuario.last_name}`.trim() },
                    access
                );
                navigate('/tablero', { replace: true });
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Error al conectar con el servidor');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login">

            {/* Panel izquierdo — Paisaje */}
            <div className="login__ilustracion">
                <img src={IMG_SALIDA} alt="Paisaje" className="login__img-fondo" />
                <div className="login__img-overlay" />
                <OlaVertical />
            </div>

            {/* Panel derecho — Formulario */}
            <div className="login__formulario-panel">

                {/* UPN arriba */}
                <div className="login__upn-header">
                    <img src={IMG_UPN} alt="Universidad Pedagógica Nacional" className="login__upn-img" />
                </div>

                {/* Card */}
                <div className="login__card">
                    <div className="login__form-header anim-entrada" style={{ animationDelay: '0.08s' }}>
                        <h1 className="login__titulo">Bienvenido de vuelta</h1>
                        <p className="login__subtitulo">Ingresa tus credenciales institucionales</p>
                    </div>

                    <form className="login__form" onSubmit={handleSubmit}>
                        <div className="login__campo anim-entrada" style={{ animationDelay: '0.16s' }}>
                            <label className="login__label" htmlFor="correo">Correo institucional</label>
                            <div className="login__input-wrap">
                                <span className="login__input-icono"><IcoEmail /></span>
                                <input id="correo" type="email" className="login__input"
                                    placeholder="usuario@upn.edu.co"
                                    value={correo} onChange={e => setCorreo(e.target.value)}
                                    required autoComplete="email" />
                            </div>
                        </div>

                        <div className="login__campo anim-entrada" style={{ animationDelay: '0.24s' }}>
                            <label className="login__label" htmlFor="contrasena">Contraseña</label>
                            <div className="login__input-wrap">
                                <span className="login__input-icono"><IcoLock /></span>
                                <input id="contrasena" type="password" className="login__input"
                                    placeholder="••••••••"
                                    value={contrasena} onChange={e => setContrasena(e.target.value)}
                                    required autoComplete="current-password" />
                            </div>
                        </div>

                        {error && <div className="login__error anim-entrada">{error}</div>}

                        <button type="submit" className="login__btn anim-entrada"
                            style={{ animationDelay: '0.32s' }} disabled={cargando}>
                            {cargando
                                ? <span className="login__btn-cargando"><span className="login__spinner" /> Verificando...</span>
                                : 'Ingresar al sistema →'}
                        </button>
                    </form>

                    <div className="login__hint anim-entrada" style={{ animationDelay: '0.40s' }}>
                        Acceso de prueba:{' '}
                        <strong>profesor@upn.edu.co</strong> · <strong>otium2026</strong>
                    </div>
                </div>

                {/* OTIUM abajo */}
                <div className="login__footer-logo">
                    <img src={IMG_OTIUM} alt="OTIUM" className="login__logo-img" />
                    <span className="login__tagline">
                        {typed}<span className="login__cursor" />
                    </span>
                </div>

            </div>
        </div>
    );
}
