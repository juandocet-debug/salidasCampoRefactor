// src/modulos/profesor/componentes/pasos/Paso3Logistica.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Paso 3: Logística — Mapa · Rutas IDA/RETORNO · Resumen de costos · Kanban
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useMemo, useRef } from 'react';
import InputDireccion from '@/features/salidas/presentacion/componentes/mapa/InputDireccion/InputDireccion';
import MapaRuta       from '@/features/salidas/presentacion/componentes/mapa/MapaRuta/MapaRuta';
import WidgetCosto    from '@/features/salidas/presentacion/componentes/mapa/WidgetCosto/WidgetCosto';
import PantallaParada from '@/features/salidas/presentacion/componentes/mapa/PantallaParada/PantallaParada';
import ModalHospedaje from '@/features/salidas/presentacion/componentes/mapa/ModalHospedaje/ModalHospedaje';
import ResumenRuta    from '@/features/salidas/presentacion/componentes/logistica/ResumenRuta/ResumenRuta';
import usePuntosRuta  from '@/features/salidas/presentacion/componentes/logistica/hooks/usePuntosRuta';
import KanbanItinerario from '../KanbanItinerario/KanbanItinerario';
import { useAutoHoraFin, useSyncCostosForm, useAutoFlota } from '@/features/salidas/presentacion/componentes/logistica/hooks/LogisticaHooks';
import { IconoIda, IconoRetorno, IconoGlobo, IconoDolar } from '@/features/salidas/presentacion/componentes/logistica/LogisticaIconos/LogisticaIconos';
import imgBrujula    from '@/assets/portadas/brujula.png';
import imgMochila    from '@/assets/portadas/mochila.png';
import imgBinoculares from '@/assets/portadas/binoculares.png';
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
    const [routeCoordsIda,     setRouteCoordsIda]     = useState(null);
    const [routeCoordsRetorno, setRouteCoordsRetorno] = useState(null);

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
    useAutoFlota({ form, setForm });

    // ── Handlers de mapa ─────────────────────────────────────────────────────
    const handleDistanciaCalculada = (data) => {
        const { routeCoords: rc, ...info } = data;
        const esRetorno = tabActivoRef.current === 'retorno';
        const setter = esRetorno ? setRutaInfoRetorno : setRutaInfoIda;
        setter(prev => ({
            ...info,
            duracion_min:      (prev._gemini && prev.duracion_min > 0) ? prev.duracion_min : 0,
            _pendienteGemini:  !(prev._gemini && prev.duracion_min > 0),
            _gemini:           prev._gemini      || false,
            _geminiError:      prev._geminiError || false,
        }));
        if (rc) {
            if (esRetorno) setRouteCoordsRetorno(rc);
            else setRouteCoordsIda(rc);
        }
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
                        {/* Total Ida */}
                        <div>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>→</span> Total Ida
                            </div>
                            <ResumenRuta
                                rutaInfo={rutaInfoIda}
                                tiempos={tiempos}
                                maxHoras={MAX_HORAS_CONDUCTOR}
                                onBuscarHotel={() => setModalHospedaje(true)}
                            />
                        </div>
                        {/* Total Vuelta */}
                        <div>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>↩</span> Total Vuelta
                            </div>
                            <ResumenRuta
                                rutaInfo={rutaInfoRetorno}
                                tiempos={tiemposRetorno}
                                maxHoras={MAX_HORAS_CONDUCTOR}
                                onBuscarHotel={() => setModalHospedaje(true)}
                            />
                        </div>
                    </div>
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
                        vehiculosAsignados={form.vehiculos_asignados || []}
                        onVehiculosChange={(v) => setForm(f => ({ ...f, vehiculos_asignados: v }))}
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
                routeCoords={tabActivo === 'retorno' ? routeCoordsRetorno : routeCoordsIda}
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
