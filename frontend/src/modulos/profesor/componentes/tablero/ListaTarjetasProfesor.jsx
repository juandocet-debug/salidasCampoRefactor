import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAutenticacion from '../../../autenticacion/estado/useAutenticacion';
import useAlertas from '../../../../nucleo/estado/useAlertas';
import ModalConfirmar from '../../../../nucleo/componentes/generales/ModalConfirmar/ModalConfirmar';
import { ICONOS, PORTADAS, ETAPAS_STEPPER, colorEsClaro } from './constantesTarjetas';
import { API_URL } from '../../../../nucleo/api/config';
import './ListaTarjetasProfesor.css';


const FullStepper = ({ estadoSistema }) => {
    const uiOrden = ETAPAS_STEPPER.findIndex(e => e.estados.includes(estadoSistema)) + 1 || 1;
    return (
        <div className="c-stepper-full">
            {ETAPAS_STEPPER.map((etapa, index) => {
                const isActive = uiOrden === etapa.id;
                const isPast = uiOrden > etapa.id;
                const isFirst = index === 0;
                const isLast = index === ETAPAS_STEPPER.length - 1;

                let labelClass = "c-step-label";
                if (isActive) labelClass += " label-active";
                if (isFirst) labelClass += " text-start";
                else if (isLast) labelClass += " text-end";
                else labelClass += " text-center";

                return (
                    <div key={etapa.id} className="c-step-item">
                        <div className="c-step-indicator">
                            <div className={`c-stepper-circle ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}></div>
                            {!isLast && (
                                <div className={`c-stepper-line ${isPast || isActive ? 'line-past' : ''}`}></div>
                            )}
                        </div>
                        <span className={labelClass}>{etapa.label}</span>
                    </div>
                );
            })}
        </div>
    );
};

// ModalConfirmarBorrar → ahora usa el componente compartido de nucleo/generales


// ── Helpers ───────────────────────────────────────────────────────────────────
const truncarPalabras = (texto, max = 20) => {
    if (!texto) return '';
    const palabras = texto.split(/\s+/);
    return palabras.length > max ? palabras.slice(0, max).join(' ') + '…' : texto;
};

const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const fmtFechaHora = (fecha, hora) => {
    if (!fecha) return null;
    const d = new Date(fecha + 'T00:00:00');
    return {
        dia: DIAS_CORTOS[d.getDay()],
        fecha: `${d.getDate()} ${MESES_CORTOS[d.getMonth()]}`,
        hora: hora ? hora.slice(0, 5) : null,
    };
};

// ── Componente principal ──────────────────────────────────────────────────────
const ListaTarjetasProfesor = ({ salidas = [], cargando = false, onSalidaEliminada }) => {
    const navigate = useNavigate();
    const { token } = useAutenticacion();
    const { agregarAlerta } = useAlertas();
    const [salidaABorrar, setSalidaABorrar] = useState(null);
    const [borrando, setBorrando] = useState(false);

    const esBorrador = (estado) => estado === 'borrador';

    const handleEditar = (salida) => navigate(`/nueva-salida?editar=${salida.id}`);

    const handleConfirmarBorrar = async () => {
        if (!salidaABorrar) return;
        setBorrando(true);
        try {
            await axios.delete(`${API_URL}/api/profesor/salidas/${salidaABorrar.id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            agregarAlerta(`Salida "${salidaABorrar.nombre}" eliminada.`, 'exito');
            if (onSalidaEliminada) onSalidaEliminada(salidaABorrar.id);
            setSalidaABorrar(null);
        } catch (error) {
            const msg = error.response?.data?.detail || 'No se pudo eliminar la salida.';
            agregarAlerta(msg, 'error');
        } finally {
            setBorrando(false);
        }
    };

    if (cargando) return <div style={{ padding: '40px', color: '#64748b' }}>Cargando salidas del tablero...</div>;

    if (salidas.length === 0) {
        return (
            <div className="tp-empty-state">
                <h3>No hay salidas registradas</h3>
                <p>Crea tu primera salida haciendo clic en el botón superior "+ Nueva Solicitud".</p>
                <button onClick={() => navigate('/nueva-salida')}>+ Empezar</button>
            </div>
        );
    }

    return (
        <>
            <div className="tp-lista">
                {salidas.map(salida => {
                    const IcoComponent = ICONOS[salida.icono] || ICONOS['IcoMap'];
                    const cardColor = salida.color || '#4A8DAC';
                    const puedeEditar = esBorrador(salida.estado);
                    const isLight = colorEsClaro(cardColor);

                    const claseTema = isLight ? 'card-new--light' : 'card-new--dark';

                    // Buscar la etapa/instancia actual para mostrarla
                    const etapaActual = ETAPAS_STEPPER.find(e => e.estados.includes(salida.estado)) || ETAPAS_STEPPER[0];

                    return (
                        <div className={`card-new ${claseTema}`} key={salida.id} style={{ background: isLight ? '#ffffff' : cardColor }}>
                            {/* Imagen Gigante (Ahora como icono integrado) */}
                            {PORTADAS[salida.icono] ? (
                                <div className="card-new__bg-icon" style={{ opacity: 1, width: '220px', height: '220px', right: '-25px', top: 'auto', bottom: '-40px', transform: 'rotate(-5deg)', zIndex: 0 }}>
                                    <img src={PORTADAS[salida.icono]} alt="Portada" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                                </div>
                            ) : (
                                <div className="card-new__bg-icon">
                                    {IcoComponent}
                                </div>
                            )}

                            <div className="card-new__content" style={{ zIndex: 1 }}>
                                {/* Encabezado: Titulo y Subtítulo */}
                                <div className="card-new__header">
                                    <h3 className="card-new__title">{salida.nombre || 'Sin Nombre'}</h3>
                                    <p className="card-new__subtitle">{truncarPalabras(salida.resumen || salida.asignatura)}</p>
                                </div>

                                {/* Botones Fijos de Acción Rápida (Arriba) */}
                                <div className="card-new__actions-top">
                                    {puedeEditar ? (
                                        <>
                                            <button className="c-btn-action top-btn c-btn-action--editar" onClick={(e) => { e.stopPropagation(); handleEditar(salida); }} title="Editar Salida">
                                                <span className="action-circle">
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </span>
                                            </button>
                                            <button className="c-btn-action top-btn c-btn-action--borrar" onClick={(e) => { e.stopPropagation(); setSalidaABorrar(salida); }} title="Eliminar Salida">
                                                <span className="action-circle _del">
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"></path></svg>
                                                </span>
                                            </button>
                                        </>
                                    ) : (
                                        <button className="c-btn-action top-btn c-btn-action--ver" title="Ver Detalles">
                                            <span className="action-circle">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            </span>
                                        </button>
                                    )}
                                </div>

                                {/* Mini-ticket Salida → Llegada */}
                                {(salida.fecha_inicio || salida.fecha_fin) && (() => {
                                    const sal = fmtFechaHora(salida.fecha_inicio, salida.hora_inicio);
                                    const lle = fmtFechaHora(salida.fecha_fin, salida.hora_fin);
                                    if (!sal && !lle) return null;
                                    return (
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
                                    );
                                })()}


                                {/* Área Inferior: Solo Stepper (Todo el ancho) */}
                                <div className="card-new__footer">
                                    {/* Progreso visual y status textual */}
                                    <div className="card-new__stepper-wrapper">
                                        <FullStepper estadoSistema={salida.estado} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {salidaABorrar && (
                <ModalConfirmar
                    titulo="¿Eliminar salida?"
                    descripcion={<>Se eliminará permanentemente <strong>"{salidaABorrar.nombre}"</strong>. Esta acción no se puede deshacer.</>}
                    cargando={borrando}
                    onConfirmar={handleConfirmarBorrar}
                    onCancelar={() => setSalidaABorrar(null)}
                />
            )}
        </>
    );
};

export default ListaTarjetasProfesor;
