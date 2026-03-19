// src/modulos/profesor/componentes/mapa/ModalAgregarParada.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Modal para agregar/editar paradas con sugerencias de Google Places.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import InputDireccion from './InputDireccion';
import MiniMapaParada from './MiniMapaParada';
import { buscarPueblosEnRuta, enriquecerPueblos } from '../logistica/buscarPueblos';
import './ModalAgregarParada.css';

import {
    MOTIVOS, MOTIVOS_CON_BUSQUEDA, INICIAL, parsearTiempoGuardado
} from './PantallaParadaHelpers';

import { 
    SugerenciasMunicipios, 
    ProgramacionItinerario, 
    MotivoYDuracion 
} from './ModalAgregarParadaSugerencias';

export default function ModalAgregarParada({ abierto, onCerrar, onAgregar, paradaEditar, puntosRuta = [], rutaInfo = {}, routeCoords = null }) {
    const [form, setForm] = useState({ ...INICIAL });
    const [pueblos, setPueblos] = useState([]);
    const [buscandoPueblos, setBuscandoPueblos] = useState(false);
    const [pagina, setPagina] = useState(0);
    const POR_PAGINA = 4;
    const esEdicion = Boolean(paradaEditar);

    useEffect(() => {
        if (abierto && paradaEditar) {
            const esOtro = !MOTIVOS.some(m => m.value === paradaEditar.motivo && m.value !== '');
            const t = parsearTiempoGuardado(paradaEditar.tiempoEstimado);
            setForm({
                nombre: paradaEditar.nombreParada || paradaEditar.nombre || '',
                motivo: esOtro ? 'otro' : (paradaEditar.motivo || ''),
                motivoOtro: esOtro ? (paradaEditar.motivo || '') : '',
                tiempoCantidad: t.cantidad, tiempoUnidad: t.unidad,
                actividad: paradaEditar.actividad || '',
                lat: paradaEditar.lat || null, lng: paradaEditar.lng || null,
                ubicacion: paradaEditar.nombre || paradaEditar.ubicacion || '',
                fechaProgramada: paradaEditar.fechaProgramada || '',
                horaProgramada: paradaEditar.horaProgramada || '',
                notasItinerario: paradaEditar.notasItinerario || '',
            });
        } else if (abierto) {
            setForm({ ...INICIAL });
        }
        setPueblos([]);
        setPagina(0);
    }, [abierto, paradaEditar]);

    // FASE 1: Gemini AI (o fallback OSRM+Overpass) → muestra resultados
    // FASE 2: Wikipedia lazy solo para la página visible
    useEffect(() => {
        if (!abierto || !MOTIVOS_CON_BUSQUEDA.includes(form.motivo)) {
            setPueblos([]);
            return;
        }
        // Necesitar al menos nombre de origen y destino
        const ori = puntosRuta[0];
        const dst = puntosRuta[puntosRuta.length - 1];
        if (!ori?.nombre && !ori?.lat) return;
        if (!dst?.nombre && !dst?.lat) return;
        setPagina(0);
        setBuscandoPueblos(true);
        buscarPueblosEnRuta(puntosRuta, routeCoords)  // Usa coordenadas reales del mapa si están disponibles
            .then(async (lista) => {
                setPueblos(lista);
                const pag0 = lista.slice(0, POR_PAGINA);
                const enriquecidos = await enriquecerPueblos(pag0);
                setPueblos(prev => {
                    const copia = [...prev];
                    enriquecidos.forEach((e, i) => { copia[i] = e; });
                    return copia;
                });
            })
            .catch(e => { console.error('[Modal] buscarPueblosEnRuta error:', e); setPueblos([]); })
            .finally(() => setBuscandoPueblos(false));
    }, [form.motivo, abierto, puntosRuta[0]?.nombre, puntosRuta[0]?.lat,
    puntosRuta[puntosRuta.length - 1]?.nombre, puntosRuta[puntosRuta.length - 1]?.lat]);

    // Enriquecer nueva página cuando el usuario navega
    useEffect(() => {
        if (!pueblos.length || buscandoPueblos) return;
        const inicio = pagina * POR_PAGINA;
        const pagActual = pueblos.slice(inicio, inicio + POR_PAGINA);
        if (pagActual.every(p => p._enriquecido)) return; // Ya enriquecida
        enriquecerPueblos(pagActual).then(enriquecidos => {
            setPueblos(prev => {
                const copia = [...prev];
                enriquecidos.forEach((e, i) => { copia[inicio + i] = e; });
                return copia;
            });
        });
    }, [pagina]);

    if (!abierto) return null;

    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const seleccionarSugerencia = (lugar) => {
        setForm(prev => ({
            ...prev,
            nombre: lugar.nombre,
            ubicacion: lugar.direccion || lugar.nombre,
            lat: lugar.lat, lng: lugar.lng,
        }));
    };

    const handleUbicacion = (d) => setForm(prev => ({ ...prev, ubicacion: d.nombre, lat: d.lat, lng: d.lng }));

    const puedeGuardar = form.nombre.trim() && form.motivo && form.ubicacion;
    const tiempo = form.tiempoCantidad ? `${form.tiempoCantidad} ${form.tiempoUnidad === 'horas' ? 'horas' : 'min'}` : '';

    const handleGuardar = () => {
        if (!puedeGuardar) return;
        onAgregar({
            nombre: form.nombre.trim(),
            motivo: form.motivo === 'otro' ? form.motivoOtro.trim() : form.motivo,
            tiempoEstimado: tiempo,
            actividad: form.actividad,
            lat: form.lat, lng: form.lng, ubicacion: form.ubicacion,
            fechaProgramada: form.fechaProgramada || null,
            horaProgramada: form.horaProgramada || null,
            notasItinerario: form.notasItinerario.trim(),
        });
        setForm({ ...INICIAL });
        onCerrar();
    };

    const handleCancelar = () => { setForm({ ...INICIAL }); onCerrar(); };

    return (
        <div className="mp-overlay" onMouseDown={(e) => {
            if (e.target === e.currentTarget) handleCancelar();
        }}>
            <div className="mp-modal" onMouseDown={e => e.stopPropagation()}>
                <h3 className="mp-titulo">
                    {esEdicion ? '✏️ Editar Parada' : '📍 Agregar Parada'}
                </h3>

                <label className="mp-campo">
                    <span className="mp-label">Nombre de la Parada *</span>
                    <input className="mp-input" type="text" value={form.nombre}
                        onChange={e => set('nombre', e.target.value)}
                        placeholder="Ej: Restaurante El Mirador" />
                </label>

                <MotivoYDuracion form={form} set={set} MOTIVOS={MOTIVOS} />

                {form.motivo === 'otro' && (
                    <label className="mp-campo">
                        <span className="mp-label">Especifique el motivo *</span>
                        <input className="mp-input" type="text" value={form.motivoOtro}
                            onChange={e => set('motivoOtro', e.target.value)}
                            placeholder="Describa el motivo…" />
                    </label>
                )}

                {/* ── Municipios en ruta (Hospedaje) ────────────── */}
                <SugerenciasMunicipios
                    form={form} setForm={setForm}
                    buscandoPueblos={buscandoPueblos} pueblos={pueblos}
                    pagina={pagina} setPagina={setPagina}
                    POR_PAGINA={POR_PAGINA} MOTIVOS_CON_BUSQUEDA={MOTIVOS_CON_BUSQUEDA}
                />

                <div className="mp-campo">
                    <InputDireccion label="Ubicación / Dirección *" icono="•"
                        valor={form.ubicacion} placeholder="Buscar dirección…"
                        onChange={handleUbicacion} />
                </div>

                {/* Mini-mapa de confirmación cuando hay coordenadas */}
                {form.lat && form.lng && (
                    <MiniMapaParada
                        lat={form.lat}
                        lng={form.lng}
                        nombre={form.nombre || form.ubicacion}
                    />
                )}

                {/* ── Programación de Itinerario ───────────── */}
                <ProgramacionItinerario form={form} set={set} />

                <label className="mp-campo">
                    <span className="mp-label">Actividad Específica (Opcional)</span>
                    <textarea className="mp-textarea" value={form.actividad} rows="3"
                        onChange={e => set('actividad', e.target.value)}
                        placeholder="Describa qué harán los estudiantes aquí…" />
                </label>

                <div className="mp-acciones">
                    <button type="button" className="mp-btn mp-btn--cancelar" onClick={handleCancelar}>
                        Cancelar
                    </button>
                    <button type="button"
                        className={`mp-btn mp-btn--agregar ${!puedeGuardar ? 'mp-btn--disabled' : ''}`}
                        onClick={handleGuardar} disabled={!puedeGuardar}>
                        {esEdicion ? 'Guardar Cambios' : 'Agregar Parada'}
                    </button>
                </div>
            </div>
        </div>
    );
}
