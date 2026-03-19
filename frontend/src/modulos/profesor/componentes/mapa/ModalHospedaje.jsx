// src/modulos/profesor/componentes/mapa/ModalHospedaje.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Muestra los pueblos y municipios a lo largo del trayecto con foto y reseña.
// El profesor puede seleccionar uno como base de planificación.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import InputDireccion from './InputDireccion';
import { distanciaKm, distanciaMinAlaRuta } from '../logistica/hotelUtils';
import './ModalHospedaje.css';

import { buscarPueblosEnRutaHospedaje } from './ModalHospedajeHelpers';
import Spinner from '../../../../nucleo/componentes/generales/Spinner/Spinner';
import BadgeMunicipio from '../../../../nucleo/componentes/generales/BadgeMunicipio/BadgeMunicipio';

export default function ModalHospedaje({ abierto, onCerrar, onSeleccionar, puntosRuta }) {
    const [pueblos, setPueblos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [tab, setTab] = useState('pueblos');
    const [hotelPropio, setHotelPropio] = useState({ nombre: '', lat: null, lng: null });
    const [errorPropio, setErrorPropio] = useState('');

    useEffect(() => {
        if (!abierto) return;
        setPueblos([]); setError(''); setErrorPropio(''); setTab('pueblos');
        buscar();
    }, [abierto]);

    const buscar = async () => {
        const v = puntosRuta.filter(p => p.lat && p.lng);
        if (v.length < 2) { setError('No hay puntos válidos en la ruta'); return; }
        setCargando(true);
        try {
            const resultado = await buscarPueblosEnRutaHospedaje(puntosRuta);
            setPueblos(resultado);
            if (!resultado.length) setError('No se encontraron municipios en la ruta.');
        } catch (e) {
            setError('Error buscando municipios: ' + e.message);
        } finally {
            setCargando(false);
        }
    };

    const seleccionar = (p) => {
        onSeleccionar({
            nombre: p.nombre,
            ubicacion: p.nombre + (p.depto ? `, ${p.depto}` : ''),
            lat: p.lat, lng: p.lng,
            motivo: 'hospedaje',
            tiempoEstimado: '8 horas',
            actividad: `Hospedaje nocturno en ${p.nombre}`,
            nombreParada: p.nombre,
        });
        onCerrar();
    };

    const seleccionarPropio = () => {
        if (!hotelPropio.nombre || !hotelPropio.lat) { setErrorPropio('Seleccione una dirección válida'); return; }
        onSeleccionar({
            nombre: hotelPropio.nombre, ubicacion: hotelPropio.nombre,
            lat: hotelPropio.lat, lng: hotelPropio.lng,
            motivo: 'hospedaje', tiempoEstimado: '8 horas',
            actividad: `Hospedaje nocturno — ${hotelPropio.nombre}`,
            nombreParada: hotelPropio.nombre,
        });
        onCerrar();
    };

    if (!abierto) return null;

    return (
        <div className="mh-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
            <div className="mh-modal" onMouseDown={e => e.stopPropagation()}>
                <div className="mh-header">
                    <div className="mh-header__icono">🗺️</div>
                    <div>
                        <h3 className="mh-titulo">Municipios en la Ruta</h3>
                        <p className="mh-subtitulo">Pueblos y ciudades a lo largo del trayecto para planificar la pernocta.</p>
                    </div>
                </div>

                <div className="mh-tabs">
                    <button className={`mh-tab ${tab === 'pueblos' ? 'mh-tab--on' : ''}`} onClick={() => setTab('pueblos')}>🏘️ En Ruta</button>
                    <button className={`mh-tab ${tab === 'propio' ? 'mh-tab--on' : ''}`} onClick={() => setTab('propio')}>✏️ Ingresar Manualmente</button>
                </div>

                {tab === 'pueblos' && (
                    <div className="mh-contenido">
                        {cargando && (
                            <div className="mh-cargando">
                                <Spinner size={20} color="#1e293b" />
                                Buscando municipios en la ruta… (puede tardar unos segundos)
                            </div>
                        )}
                        {error && !cargando && (
                            <div className="mh-empty-box">
                                <span className="mh-empty-text">{error}</span>
                                <button className="mh-btn-propio mh-btn-propio--small" onClick={() => setTab('propio')}>
                                    Ingresar ubicación manualmente
                                </button>
                            </div>
                        )}
                        {!error && !cargando && pueblos.length > 0 && (
                            <div className="mh-pueblos-list">
                                {pueblos.map((p) => (
                                    <div key={p.id} className="mh-pueblo-card">
                                        <div className="mh-pueblo-card__left">
                                            {p.foto
                                                ? <img src={p.foto} alt={p.nombre} className="mh-pueblo-card__img" />
                                                : <div className="mh-pueblo-card__img mh-pueblo-card__img--placeholder">🏘️</div>
                                            }
                                        </div>
                                        <div className="mh-pueblo-card__body">
                                            <div className="mh-pueblo-card__header">
                                                <h4 className="mh-pueblo-card__nombre">{p.nombre}</h4>
                                                <div className="mh-pueblo-card__badges">
                                                    <BadgeMunicipio km={`📍 ~${p.kmDesdeOrigen}`} departamento={p.depto} />
                                                </div>
                                            </div>
                                            <p className="mh-pueblo-card__desc">{p.descripcion}</p>
                                            <div className="mh-pueblo-card__footer">
                                                {p.wikiUrl && (
                                                    <a href={p.wikiUrl} target="_blank" rel="noopener noreferrer" className="mh-wiki-link">
                                                        Ver en Wikipedia →
                                                    </a>
                                                )}
                                                <button className="mh-card__btn" onClick={() => seleccionar(p)}>
                                                    Planificar aquí
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {tab === 'propio' && (
                    <div className="mh-contenido">
                        <p className="mh-propio-desc">Busque la ciudad, pueblo o hotel donde pernoctará.</p>
                        <InputDireccion label="Ubicación de Hospedaje" icono="🏨" valor={hotelPropio.nombre}
                            placeholder="Ej: Bucaramanga, Santander…" onChange={d => { setHotelPropio(d); setErrorPropio(''); }} />
                        {errorPropio && <div className="mh-error">{errorPropio}</div>}
                        <button className="mh-btn-propio" onClick={seleccionarPropio} disabled={!hotelPropio.nombre}>
                            Confirmar Ubicación
                        </button>
                    </div>
                )}

                <div className="mh-footer"><button className="mh-btn-cancelar" onClick={onCerrar}>Cancelar</button></div>
            </div>
        </div>
    );
}
