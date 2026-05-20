import re
with open('frontend/src/features/conductor/presentacion/componentes/AppConductor/AppConductor.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_tab = """function TabMisViajes({ conductor, token }) {
    const [viajes, setViajes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [salidaSeleccionada, setSalidaSeleccionada] = useState(null);
    const [detallesSalida, setDetallesSalida] = useState(null);
    const [cargandoDetalles, setCargandoDetalles] = useState(false);

    const fetchViajes = () => {
        obtenerMisViajes(conductor.id, token)
            .then(data => setViajes(data))
            .catch(err => console.error(err))
            .finally(() => setCargando(false));
    };

    useEffect(() => {
        fetchViajes();
    }, [conductor.id, token]);

    const abrirDetalle = (salida) => {
        setSalidaSeleccionada(salida);
        setCargandoDetalles(true);
        obtenerDetalleSalida(salida.id)
            .then(data => setDetallesSalida(data))
            .catch(err => console.error(err))
            .finally(() => setCargandoDetalles(false));
    };

    const handleReportarFaltaItinerario = () => {
        if (!window.confirm('¿Desea reportar que esta salida no tiene un itinerario asignado?')) return;
        reportarNovedad(salidaSeleccionada.id, 'alta', 'No hay itinerario creado para esta salida.', token)
            .then(() => {
                alert('Novedad reportada correctamente.');
            })
            .catch(err => alert('Error: ' + err.message));
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
        const IcoComp = ICONOS[s.icono] || ICONOS['IcoMap'];
        const d = detallesSalida;

        return createPortal(
            <div className="det__overlay" onClick={() => setSalidaSeleccionada(null)}>
                <div className="det__sheet" onClick={e => e.stopPropagation()}>
                    <div className="det__hero" style={{ background: s.color || '#4A8DAC' }}>
                        <div className="det__handle" />
                        {PORTADAS[s.icono] ? (
                            <img src={PORTADAS[s.icono]} className="det__hero-img" alt="" />
                        ) : (
                            <div className="det__hero-icon">{IcoComp}</div>
                        )}
                        <div className="det__hero-overlay" />
                        <div className="det__hero-content">
                            <span className="det__badge">{s.estado}</span>
                            <h2 className="det__hero-title">{s.nombre || 'Sin Nombre'}</h2>
                            {s.codigo && <span className="det__hero-code"># {s.codigo}</span>}
                        </div>
                        <button className="det__close" onClick={() => setSalidaSeleccionada(null)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>

                    <div className="det__body">
                        <div className="det__section">
                            <p className="det__section-title">Itinerario de la Salida</p>
                            {cargandoDetalles ? (
                                <p>Cargando itinerario...</p>
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
                        const IcoComp  = ICONOS[salida.icono] || ICONOS['IcoMap'];
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
                                {PORTADAS[salida.icono] ? (
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
                                            <span className="app-cond__badge" style={{position:'static', fontSize:'10px', padding:'2px 6px', height:'auto'}}>{salida.estado}</span>
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
        </div>
    );
}
"""

start_idx = None
end_idx = None
lines = content.split('\n')
for i, l in enumerate(lines):
    if 'function TabMisViajes' in l: start_idx = i
    if 'function TabChecklist' in l: end_idx = i

if start_idx is not None and end_idx is not None:
    new_content = '\n'.join(lines[:start_idx]) + '\n' + new_tab + '\n' + '\n'.join(lines[end_idx:])
    with open('frontend/src/features/conductor/presentacion/componentes/AppConductor/AppConductor.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Replaced successfully')
else:
    print('Could not find boundaries')
