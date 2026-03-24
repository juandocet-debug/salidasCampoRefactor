// src/modulos/profesor/componentes/mapa/PantallaParadaContexto.jsx
import React from 'react';
import { IcoUbi } from './PantallaParadaIconos';
import MiniMapaParada from '../MiniMapaParada/MiniMapaParada';

export function PanelContextoLateral({
    form, setForm, rutaInfo, tieneSug, buscandoPueblos, pueblos, POR_PAGINA,
    pagina, setPagina, lugarViendo, setLugarViendo,
    puntosRuta = [], routeCoords = null,
}) {
    return (
        <div className="pp-context-area">
            {/* Tarjeta 1: Mini mapa real de ubicación */}
            <div className="pp-card-smooth pp-card-status">
                <div className="pp-card-smooth-head">
                    <h3 className="pp-card-smooth-title">
                        {form.motivo === 'almuerzo' ? 'Lugar para almorzar' :
                         form.motivo === 'hospedaje' ? 'Lugar de hospedaje' :
                         'Ubicación de la Parada'}
                    </h3>
                    <p className="pp-card-smooth-subtitle">
                        {form.lat && form.lng
                            ? (form.ubicacion || 'Parada seleccionada')
                            : 'Busca y selecciona un lugar en el formulario.'}
                    </p>
                </div>

                {form.lat && form.lng ? (
                    <MiniMapaParada
                        lat={form.lat}
                        lng={form.lng}
                        nombre={form.nombre || form.ubicacion}
                        puntosRuta={puntosRuta}
                        routeCoords={routeCoords}
                    />
                ) : (
                    <div style={{
                        height: 160, borderRadius: 12,
                        background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', gap: 8,
                        border: '1.5px dashed #cbd5e1', color: '#94a3b8',
                        fontSize: '0.8rem', fontWeight: 600,
                    }}>
                        <span style={{ fontSize: '1.8rem' }}>🗺️</span>
                        <span>El mapa aparecerá aquí</span>
                        <span style={{ fontWeight: 400, fontSize: '0.72rem' }}>
                            Busca una dirección en "Ubicación"
                        </span>
                    </div>
                )}

                <div className="pp-status-loc">
                    <div className="pp-status-distance" style={{ marginTop: 0 }}>
                        <strong>
                            {rutaInfo?.distancia_km ? `${rutaInfo.distancia_km}`.split('.')[0] : '—'}
                        </strong>{' '}
                        <span>km de recorrido total de la ruta</span>
                    </div>
                </div>
            </div>

            {/* Tarjeta 2: Sugerencias de Lugares Img 1 */}
            {tieneSug && (
                <div className="pp-card-smooth pp-card-places">
                    <div className="pp-card-smooth-head pp-card-smooth-head--flex">
                        <h3 className="pp-card-smooth-title">Explorar lugares en la ruta</h3>
                        {!buscandoPueblos && pueblos.length > POR_PAGINA && (
                            <div className="pp-muni-pag-top">
                                <button className="pp-pag-btn-sm" onClick={() => setPagina(p => Math.max(0,p-1))} disabled={pagina===0}>&lt;</button>
                                <span className="pp-pag-info-sm">{pagina+1} de {Math.ceil(pueblos.length/POR_PAGINA)}</span>
                                <button className="pp-pag-btn-sm" onClick={() => setPagina(p => Math.min(Math.ceil(pueblos.length/POR_PAGINA)-1,p+1))} disabled={(pagina+1)*POR_PAGINA>=pueblos.length}>&gt;</button>
                            </div>
                        )}
                    </div>
                    
                    {buscandoPueblos ? (
                        <div className="pp-muni-loading"><div className="pp-muni-spinner" /> Analizando corredor vial…</div>
                    ) : pueblos.length > 0 ? (
                        <>
                            <div className="pp-places-grid">
                                {pueblos.slice(pagina*POR_PAGINA, (pagina+1)*POR_PAGINA).map((p, i) => {
                                    const isSelected = form.nombre === p.nombre;
                                    const isLarge = i === 0; // El primero es más grande
                                    return (
                                        <button key={p.id} type="button"
                                            className={`pp-place-card ${isLarge ? 'pp-place-card--lg' : ''} ${isSelected ? 'pp-place-card--sel' : ''}`}
                                            onClick={() => setLugarViendo(p)}
                                            style={p.foto ? { backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%), url(${p.foto})` } : {}}>
                                            
                                            <div className="pp-place-card-content">
                                                <div className="pp-place-card-header">
                                                    <IcoUbi />
                                                    <span className="pp-place-nombre">{p.nombre}</span>
                                                </div>
                                                <div className="pp-place-card-meta">
                                                    <span>{p.depto || 'Colombia'}</span>
                                                </div>
                                                {isLarge && p.descripcion && (
                                                    <p className="pp-place-desc">{p.descripcion}</p>
                                                )}
                                            </div>
                                            
                                            {!isLarge && (
                                                <div className="pp-place-card-action">
                                                    <span className="pp-place-card-plus">+</span>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="pp-empty pp-empty--smooth">
                            <span className="pp-empty-text">No hay lugares sugeridos cerca.</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export function ModalDetalleLugar({ lugarViendo, setLugarViendo, form, setForm }) {
    if (!lugarViendo) return null;

    return (
        <div className="pp-lugar-modal-overlay" onClick={() => setLugarViendo(null)}>
            <div className="pp-lugar-modal" onClick={e => e.stopPropagation()}>
                <button className="pp-lugar-modal-close" onClick={() => setLugarViendo(null)}>×</button>
                
                {lugarViendo.foto ? (
                    <div className="pp-lugar-modal-foto" style={{ backgroundImage: `url(${lugarViendo.foto})` }}></div>
                ) : (
                    <div className="pp-lugar-modal-foto pp-lugar-modal-foto--empty">Sin Imagen</div>
                )}
                
                <div className="pp-lugar-modal-info">
                    <div className="pp-lugar-modal-head">
                        <IcoUbi />
                        <h3 className="pp-lugar-modal-nombre">{lugarViendo.nombre}</h3>
                    </div>
                    <p className="pp-lugar-modal-meta">{lugarViendo.depto || 'Colombia'}</p>
                    
                    <div className="pp-lugar-modal-desc-full">
                        {lugarViendo.descripcion ? (
                            <>
                                {lugarViendo.descripcion}
                                {lugarViendo.wikiUrl && (
                                    <a href={lugarViendo.wikiUrl} target="_blank" rel="noreferrer" className="pp-lugar-lee-mas">
                                        {' '}Leer más en Wikipedia
                                    </a>
                                )}
                            </>
                        ) : (
                            'No hay descripción detallada disponible para este lugar en este momento.'
                        )}
                    </div>
                    
                    <button 
                        className={`pp-lugar-modal-btn ${form.nombre === lugarViendo.nombre ? 'pp-lugar-modal-btn--added' : ''}`}
                        onClick={() => {
                            setForm(prev => ({
                                ...prev, nombre: lugarViendo.nombre,
                                ubicacion: lugarViendo.nombre + (lugarViendo.depto ? `, ${lugarViendo.depto}` : ''),
                                lat: lugarViendo.lat, lng: lugarViendo.lng,
                            }));
                            setTimeout(() => setLugarViendo(null), 850);
                        }}
                    >
                        {form.nombre === lugarViendo.nombre ? '¡Lugar Agregado! ✓' : 'Agregar como destino'}
                    </button>
                </div>
            </div>
        </div>
    );
}
