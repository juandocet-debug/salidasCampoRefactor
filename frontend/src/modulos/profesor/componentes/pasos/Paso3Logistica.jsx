// src/modulos/profesor/componentes/pasos/Paso3Logistica.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Paso 3: Logística — Mapa · Rutas IDA/RETORNO · Resumen de costos · Kanban
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useMemo, useRef } from 'react';
import InputDireccion from '../mapa/InputDireccion';
import MapaRuta       from '../mapa/MapaRuta';
import WidgetCosto    from '../mapa/WidgetCosto';
import PantallaParada from '../mapa/PantallaParada';
import ModalHospedaje from '../mapa/ModalHospedaje';
import ResumenRuta    from '../logistica/ResumenRuta';
import usePuntosRuta  from '../logistica/usePuntosRuta';
import KanbanItinerario from './KanbanItinerario';
import { useAutoHoraFin, useSyncCostosForm, useAutoTipoVehiculo } from './LogisticaHooks';
import { IconoIda, IconoRetorno, IconoGlobo, IconoDolar } from '../logistica/LogisticaIconos';
import imgBrujula    from '../../../../assets/portadas/brujula.png';
import imgMochila    from '../../../../assets/portadas/mochila.png';
import imgBinoculares from '../../../../assets/portadas/binoculares.png';
import './Paso3Logistica.css';

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function Paso3Logistica({ form, setForm }) {
    const {
        puntosRuta, puntosRetorno,
        rutaInfoIda, setRutaInfoIda,
        rutaInfoRetorno, setRutaInfoRetorno,
        tiempos, tiemposRetorno,
        actualizarPunto, actualizarPuntoRetorno,
        agregarParada, agregarHospedaje, quitarParada, moverParada,
        agregarParadaRetorno, quitarParadaRetorno, moverParadaRetorno,
        MAX_HORAS_CONDUCTOR,
    } = usePuntosRuta(form, setForm);

    // ── Estado UI ────────────────────────────────────────────────────────────
    const [tabActivo,       setTabActivo]       = useState('ida');
    const [pantallaAbierta, setPantallaAbierta] = useState(false);
    const [paradaEditando,  setParadaEditando]  = useState(null);
    const [modalHospedaje,  setModalHospedaje]  = useState(false);
    const [routeCoords,     setRouteCoords]     = useState(null);

    // Ref para evitar race conditions: el closure de handleDistanciaCalculada
    // puede capturar un tabActivo stale; la ref siempre apunta al valor actual.
    const tabActivoRef = useRef('ida');
    const cambiarTab   = (tab) => { setTabActivo(tab); tabActivoRef.current = tab; };

    // ── Helpers derivados ────────────────────────────────────────────────────
    const calcularDias = () => {
        if (!form.fecha_inicio || !form.fecha_fin) return 1;
        return Math.max(1, Math.ceil((new Date(form.fecha_fin) - new Date(form.fecha_inicio)) / 86400000) + 1);
    };
    const calcularHorasTotales = () => {
        const totalMin = (tiempos?.totalMin || 0) + (tiemposRetorno?.totalMin || 0);
        return totalMin > 0 ? totalMin / 60 : calcularDias() * 10;
    };

    // ── Efectos secundarios (encapsulados en hooks) ───────────────────────────
    useAutoHoraFin({ form, setForm, tiempos, tiemposRetorno, rutaInfoIda, rutaInfoRetorno });
    useSyncCostosForm({ form, setForm, rutaInfoIda, rutaInfoRetorno, calcularDias, calcularHorasTotales, tiempos, tiemposRetorno });
    useAutoTipoVehiculo({ form, setForm });

    // ── Handlers de mapa ─────────────────────────────────────────────────────
    const handleDistanciaCalculada = (data) => {
        const { routeCoords: rc, ...info } = data;
        const setter = tabActivoRef.current === 'retorno' ? setRutaInfoRetorno : setRutaInfoIda;
        setter(prev => ({
            ...info,
            duracion_min:      (prev._gemini && prev.duracion_min > 0) ? prev.duracion_min : 0,
            _pendienteGemini:  !(prev._gemini && prev.duracion_min > 0),
            _gemini:           prev._gemini      || false,
            _geminiError:      prev._geminiError || false,
        }));
        if (rc) setRouteCoords(rc);
    };

    // ── Handlers de paradas ──────────────────────────────────────────────────
    const editarParada     = (i) => {
        const esRetorno = tabActivo === 'retorno';
        setParadaEditando({ index: i, data: esRetorno ? puntosRetorno[i] : puntosRuta[i], esRetorno });
        setPantallaAbierta(true);
    };
    const abrirNuevaParada = () => { setParadaEditando(null); setPantallaAbierta(true); };
    const cerrarPantalla   = () => { setPantallaAbierta(false); setParadaEditando(null); };
    const handleAgregarParada = (data) => {
        if (paradaEditando?.esRetorno || tabActivo === 'retorno') {
            agregarParadaRetorno(data, paradaEditando?.index ?? null);
        } else {
            agregarParada(data, paradaEditando?.index ?? null);
        }
        setParadaEditando(null);
    };

    // ── Puntos del tab activo (para el mapa) ─────────────────────────────────
    const puntosRutaActiva = useMemo(
        () => tabActivo === 'ida' ? puntosRuta : puntosRetorno,
        [tabActivo, puntosRuta, puntosRetorno],
    );

    return (
        <>
            {/* ─── MAPA full width ────────────────────────────────────── */}
            <div className="p3l-mapa-full">
                <MapaRuta
                    puntos={puntosRutaActiva}
                    onDistanciaCalculada={handleDistanciaCalculada}
                />
            </div>

            {/* ─── DOS COLUMNAS: IDA | RETORNO ────────────────────────── */}
            <div className="p3l-cols-2">
                <div className="p3l-card">
                    <div className="p3l-card-header">
                        <IconoIda />
                        <h4 className="p3l-card-title">Viaje de Ida</h4>
                    </div>
                    <InputDireccion
                        label="Punto de Partida"
                        icono={LETRAS[0]}
                        valor={puntosRuta[0]?.nombre || ''}
                        placeholder="Ej: Universidad Nacional, Bogotá"
                        onChange={d => actualizarPunto(0, d)}
                    />
                    <InputDireccion
                        label="Destino Final"
                        icono={LETRAS[puntosRuta.length - 1]}
                        valor={puntosRuta[puntosRuta.length - 1]?.nombre || ''}
                        placeholder="Ej: Páramo de Chingaza"
                        onChange={d => actualizarPunto(puntosRuta.length - 1, d)}
                    />
                </div>

                <div className="p3l-card">
                    <div className="p3l-card-header">
                        <IconoRetorno />
                        <h4 className="p3l-card-title">Viaje de Retorno</h4>
                    </div>
                    <InputDireccion
                        label="Punto de Partida (Retorno)"
                        icono={LETRAS[0]}
                        valor={puntosRetorno[0]?.nombre || ''}
                        placeholder="Ej: Páramo de Chingaza"
                        onChange={d => actualizarPuntoRetorno(0, d)}
                    />
                    <InputDireccion
                        label="Destino Final (Retorno)"
                        icono={LETRAS[puntosRetorno.length - 1]}
                        valor={puntosRetorno[puntosRetorno.length - 1]?.nombre || ''}
                        placeholder="Ej: Universidad Nacional, Bogotá"
                        onChange={d => actualizarPuntoRetorno(puntosRetorno.length - 1, d)}
                    />
                </div>
            </div>

            {/* ─── RESUMEN + COSTO ────────────────────────────────────── */}
            <div className="p3l-resumen-full">
                {/* Resumen de Ruta */}
                <div className="p3l-info-card">
                    <div className="p3l-info-card-header">
                        <IconoGlobo />
                        <span className="p3l-info-card-title">Resumen de Ruta</span>
                    </div>
                    <div className="p3l-km-strip">
                        <div className="p3l-km-chip p3l-km-chip--ida">
                            <img src={imgBrujula} alt="" className="p3l-km-chip-img" />
                            <span className="p3l-km-chip-val">
                                {rutaInfoIda.distancia_km > 0 ? `${Math.round(rutaInfoIda.distancia_km)} km` : '— km'}
                            </span>
                            <span className="p3l-km-chip-lbl">Ida</span>
                        </div>
                        <div className="p3l-km-sep">+</div>
                        <div className="p3l-km-chip p3l-km-chip--vuelta">
                            <img src={imgMochila} alt="" className="p3l-km-chip-img" />
                            <span className="p3l-km-chip-val">
                                {rutaInfoRetorno.distancia_km > 0 ? `${Math.round(rutaInfoRetorno.distancia_km)} km` : '— km'}
                            </span>
                            <span className="p3l-km-chip-lbl">Vuelta</span>
                        </div>
                        <div className="p3l-km-sep">=</div>
                        <div className="p3l-km-chip p3l-km-chip--total">
                            <img src={imgBinoculares} alt="" className="p3l-km-chip-img" />
                            <span className="p3l-km-chip-val">
                                {rutaInfoIda.distancia_km > 0
                                    ? `${Math.round(rutaInfoIda.distancia_km + rutaInfoRetorno.distancia_km)} km`
                                    : '— km'}
                            </span>
                            <span className="p3l-km-chip-lbl">Total</span>
                        </div>
                    </div>
                    <ResumenRuta
                        rutaInfo={tabActivo === 'retorno' ? rutaInfoRetorno : rutaInfoIda}
                        tiempos={tabActivo === 'retorno' ? tiemposRetorno : tiempos}
                        maxHoras={MAX_HORAS_CONDUCTOR}
                        onBuscarHotel={() => setModalHospedaje(true)}
                    />
                </div>

                {/* Costos Estimados */}
                <div className="p3l-info-card">
                    <div className="p3l-info-card-header">
                        <IconoDolar />
                        <span className="p3l-info-card-title">Costos Estimados</span>
                    </div>
                    <WidgetCosto
                        distanciaKm={rutaInfoIda.distancia_km + rutaInfoRetorno.distancia_km}
                        duracionDias={calcularDias()}
                        horasTotales={calcularHorasTotales()}
                        numEstudiantes={form.num_estudiantes}
                        horaInicio={form.hora_inicio}
                        horaFin={form.hora_fin}
                        tipoVehiculo={form.tipo_vehiculo_calculo || 'bus'}
                        onTipoChange={(tipo) => setForm(f => ({ ...f, tipo_vehiculo_calculo: tipo }))}
                        onCostoCalculado={(costo) => {
                            if (form.costo_estimado !== costo) {
                                setForm(f => ({ ...f, costo_estimado: costo }));
                            }
                        }}
                    />
                </div>
            </div>

            {/* ─── KANBAN ITINERARIO ───────────────────────────────────── */}
            <KanbanItinerario
                tabActivo={tabActivo}
                onCambiarTab={cambiarTab}
                puntosRuta={puntosRuta}
                puntosRetorno={puntosRetorno}
                fechaInicio={form.fecha_inicio || ''}
                onEditarParada={editarParada}
                onNuevaParada={abrirNuevaParada}
                onQuitarParada={quitarParada}
                onQuitarParadaRetorno={quitarParadaRetorno}
                onMoverParada={moverParada}
                onMoverParadaRetorno={moverParadaRetorno}
            />

            {/* ─── MODALES ─────────────────────────────────────────────── */}
            <PantallaParada
                abierto={pantallaAbierta}
                onCerrar={cerrarPantalla}
                onAgregar={handleAgregarParada}
                paradaEditar={paradaEditando?.data || null}
                puntosRuta={puntosRutaActiva}
                rutaInfo={tabActivo === 'retorno' ? rutaInfoRetorno : rutaInfoIda}
                routeCoords={routeCoords}
                fechaInicioSalida={form.fecha_inicio || ''}
                fechaFinSalida={form.fecha_fin || ''}
            />
            <ModalHospedaje
                abierto={modalHospedaje}
                onCerrar={() => setModalHospedaje(false)}
                onSeleccionar={agregarHospedaje}
                puntosRuta={puntosRuta}
            />
        </>
    );
}
