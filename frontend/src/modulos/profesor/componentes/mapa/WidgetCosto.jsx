// src/modulos/profesor/componentes/mapa/WidgetCosto.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Widget compacto de costos — solo UI. Toda la lógica está en costoUtils.js.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect } from 'react';
import { useParametrosSistema } from './useParametrosSistema';
import { cop, getOpcionesVehiculo, calcularCostos } from './costoUtils';
import './WidgetCosto.css';
import imgFuel     from '../../../../assets/portadas/fuel_3d.png';
import imgLodge    from '../../../../assets/portadas/lodge_3d.png';
import imgTime     from '../../../../assets/portadas/time_3d.png';
import imgBus      from '../../../../assets/bus_1.png';
import imgBuseta   from '../../../../assets/bus_2.png';
import imgCamioneta from '../../../../assets/bus_3.png';
import { CardMatcha } from '../../../../nucleo/componentes/generales/Tarjetas/Tarjetas';

// Re-exportar para que los consumidores existentes no rompan
export { tipoVehiculoSugerido } from './costoUtils';

const TIPOS_VEHICULO = {
    bus:       { img: imgBus,       label: 'Bus',       capacidad: 50 },
    buseta:    { img: imgBuseta,    label: 'Buseta',    capacidad: 30 },
    camioneta: { img: imgCamioneta, label: 'Camioneta', capacidad: 15 },
};

// ── Sub-componente: Selector de tipo de vehículo ──────────────────────────────
function SelectorVehiculo({ pax, tipoVehiculo, onTipoChange }) {
    const opciones = getOpcionesVehiculo(pax);
    return (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {opciones.map(key => {
                const val      = TIPOS_VEHICULO[key];
                const isActive = tipoVehiculo === key;
                const qty      = Math.ceil(pax / val.capacidad) || 1;
                
                const COLORES_MATCHA = {
                    bus: 'orange',
                    buseta: 'blue',
                    camioneta: 'green'
                };
                
                return (
                    <div 
                        key={key} 
                        onClick={() => onTipoChange?.(key)}
                        style={{ 
                            flex: '1', 
                            minWidth: '200px', 
                            maxWidth: '280px',
                            cursor: 'pointer',
                            transform: isActive ? 'scale(1.02)' : 'scale(1)',
                            opacity: isActive ? 1 : 0.6,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <CardMatcha
                            title={val.label}
                            color={COLORES_MATCHA[key] || 'slate'}
                            badgeText={isActive ? 'ACTIVO' : ''}
                            badgeColor={isActive ? '#16a34a' : '#64748b'}
                            imageSrc={val.img}
                            bannerText={qty > 1 ? `${qty} Vehículos necesarios` : '1 Vehículo necesario'}
                            tags={[
                                `${qty * val.capacidad} Cupos Totales`,
                                `${val.capacidad} PAX/Unidad`
                            ]}
                        />
                    </div>
                );
            })}
        </div>
    );
}

// ── Sub-componente: Timeline de desglose de jornada ──────────────────────────
function TimelineJornada({ jornada, horasTotales, numVehiculos, p }) {
    const { heManana, ordinarias, heTarde, heNoche, horasEfectivas } = jornada;
    const buf = p.horas_buffer || 0;
    return (
        <div className="wc-timeline">
            <div className="wc-timeline-header">
                <span className="wc-timeline-title">📊 Desglose de Jornada</span>
                <span className="wc-timeline-total">
                    {horasTotales.toFixed(1)}h ruta + {buf}h buffer = <strong>{horasEfectivas.toFixed(1)}h total</strong>
                </span>
            </div>

            <div className="wc-timeline-bar">
                {heManana > 0 && (
                    <div className="wc-tl-seg wc-tl-seg--manana" style={{ flex: heManana }}
                        title={`HE Mañana: ${heManana.toFixed(1)}h × ${cop(p.costo_hora_extra || 11000)}`}>
                        <span>{heManana.toFixed(1)}h</span>
                    </div>
                )}
                {ordinarias > 0 && (
                    <div className="wc-tl-seg wc-tl-seg--ordinario" style={{ flex: ordinarias }}
                        title={`Ordinario: ${ordinarias.toFixed(1)}h`}>
                        <span>{ordinarias.toFixed(1)}h</span>
                    </div>
                )}
                {heTarde > 0 && (
                    <div className="wc-tl-seg wc-tl-seg--tarde" style={{ flex: heTarde }}
                        title={`HE Tarde: ${heTarde.toFixed(1)}h × ${cop(p.costo_hora_extra || 11000)}`}>
                        <span>{heTarde.toFixed(1)}h</span>
                    </div>
                )}
                {heNoche > 0 && (
                    <div className="wc-tl-seg wc-tl-seg--noche" style={{ flex: heNoche }}
                        title={`HE Noche: ${heNoche.toFixed(1)}h × ${cop(p.costo_hora_extra_2 || 15000)}`}>
                        <span>{heNoche.toFixed(1)}h</span>
                    </div>
                )}
            </div>

            <div className="wc-timeline-legend">
                {heManana > 0 && (
                    <div className="wc-tl-legend-item">
                        <span className="wc-tl-dot wc-tl-dot--manana" />
                        <span>5–8am: {heManana.toFixed(1)}h × {cop(p.costo_hora_extra || 11000)} = <strong>{cop(heManana * (p.costo_hora_extra || 11000) * numVehiculos)}</strong></span>
                    </div>
                )}
                <div className="wc-tl-legend-item">
                    <span className="wc-tl-dot wc-tl-dot--ordinario" />
                    <span>8am–5pm: {ordinarias.toFixed(1)}h <em>(incluido en viático)</em></span>
                </div>
                {heTarde > 0 && (
                    <div className="wc-tl-legend-item">
                        <span className="wc-tl-dot wc-tl-dot--tarde" />
                        <span>5–6pm: {heTarde.toFixed(1)}h × {cop(p.costo_hora_extra || 11000)} = <strong>{cop(heTarde * (p.costo_hora_extra || 11000) * numVehiculos)}</strong></span>
                    </div>
                )}
                {heNoche > 0 && (
                    <div className="wc-tl-legend-item">
                        <span className="wc-tl-dot wc-tl-dot--noche" />
                        <span>6–8pm: {heNoche.toFixed(1)}h × {cop(p.costo_hora_extra_2 || 15000)} = <strong>{cop(heNoche * (p.costo_hora_extra_2 || 15000) * numVehiculos)}</strong></span>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function WidgetCosto({
    distanciaKm = 0,
    duracionDias = 1,
    horasTotales = 9,
    numEstudiantes = 0,
    horaInicio = '',
    horaFin = '',
    tipoVehiculo = 'bus',
    parametros,
    onCostoCalculado,
    onTipoChange,
}) {
    const paramsSistema = useParametrosSistema();
    const p             = { ...paramsSistema, ...parametros };
    const pax           = parseInt(numEstudiantes) || 0;
    const tipoInfo      = TIPOS_VEHICULO[tipoVehiculo] || TIPOS_VEHICULO.bus;

    const { combustible, costoConductor, costoExtra, total, numVehiculos, viaticos, jornada } =
        calcularCostos({
            distanciaKm, duracionDias, horasTotales, pax,
            tipoVehiculo, capacidadVehiculo: tipoInfo.capacidad,
            params: p, horaInicio,
        });

    useEffect(() => {
        if (distanciaKm > 0 && onCostoCalculado) {
            onCostoCalculado(Math.round(total));
        }
    }, [total, distanciaKm, horaFin, duracionDias, numEstudiantes, tipoVehiculo]);

    if (distanciaKm === 0) {
        return (
            <div className="wc-premium--empty">
                <p>Agrega puntos de ruta para calcular costos</p>
            </div>
        );
    }

    return (
        <div className="wc-container">
            <SelectorVehiculo pax={pax} tipoVehiculo={tipoVehiculo} onTipoChange={onTipoChange} />

            <div className="wc-top">
                <span className="wc-top-label">Costo Estimado Total</span>
                <span className="wc-top-total">{cop(total)}</span>
            </div>

            <div className="wc-grid">
                <div className="wc-card wc-card--amber">
                    <img src={imgFuel} alt="" className="wc-card-img" />
                    <div className="wc-card-body">
                        <span className="wc-card-val">{cop(combustible)}</span>
                        <span className="wc-card-lbl">Combustible</span>
                        <div className="wc-card-bar"><div style={{ width: '100%' }} /></div>
                        <span className="wc-card-detail">
                            {distanciaKm.toFixed(0)}km • {numVehiculos} {tipoInfo.label}{numVehiculos !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                <div className="wc-card wc-card--blue">
                    <img src={imgLodge} alt="" className="wc-card-img" />
                    <div className="wc-card-body">
                        <span className="wc-card-val">{cop(costoConductor)}</span>
                        <span className="wc-card-lbl">Conductor</span>
                        <div className="wc-card-bar"><div style={{ width: '100%' }} /></div>
                        <span className="wc-card-detail">{viaticos} viático{viaticos !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                <div className="wc-card wc-card--pink">
                    <img src={imgTime} alt="" className="wc-card-img" />
                    <div className="wc-card-body">
                        <span className="wc-card-val">{cop(costoExtra)}</span>
                        <span className="wc-card-lbl">Horas Extra</span>
                        <div className="wc-card-bar"><div style={{ width: '100%' }} /></div>
                        <span className="wc-card-detail">{jornada.horasExtraTotal.toFixed(1)}h extra</span>
                    </div>
                </div>
            </div>

            <TimelineJornada
                jornada={jornada}
                horasTotales={horasTotales}
                numVehiculos={numVehiculos}
                p={p}
            />
        </div>
    );
}
