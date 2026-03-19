// src/modulos/profesor/componentes/mapa/PantallaParada.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Pantalla completa COMPACTA para paradas del itinerario.
// 3 columnas: Info+Motivo | Programación+Notas | Preview+Ubicación
// TODO cabe en una sola pantalla sin scroll.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useMemo } from 'react';
import InputDireccion from './InputDireccion';
import { buscarPueblosEnRuta, enriquecerPueblos } from '../logistica/buscarPueblos';
import './PantallaParada.css';

// ── Imports de UI (Iconos Constantes y Funciones Puras) ───────────
import { 
    IcoFlecha, IcoInfo, IcoCal, IcoMuni, IcoNota, IcoUbi 
} from './PantallaParadaIconos';

import { 
    MOTIVOS, MOTIVOS_CON_BUSQUEDA, MESES, INICIAL, PORTADAS_PARADA, COLORES_PARADA,
    parsearTiempoGuardado, generarRangoFechas, fmtPill, fmtISO, fmtHumano, fmtHora 
} from './PantallaParadaHelpers';

import { 
    BloqueApariencia, BloqueInformacion, BloqueProgramacion, BloqueNotas 
} from './PantallaParadaComponentesForm';

import {
    PanelContextoLateral, ModalDetalleLugar
} from './PantallaParadaContexto';



export default function PantallaParada({
    abierto, onCerrar, onAgregar, paradaEditar,
    puntosRuta = [], rutaInfo = {}, routeCoords = null,
    fechaInicioSalida = '', fechaFinSalida = '',
}) {
    const [form, setForm] = useState({ ...INICIAL });
    const [pueblos, setPueblos] = useState([]);
    const [buscandoPueblos, setBuscandoPueblos] = useState(false);
    const [pagina, setPagina] = useState(0);
    const [lugarViendo, setLugarViendo] = useState(null);
    const POR_PAGINA = 5;
    const esEdicion = Boolean(paradaEditar);

    const fechasViaje = useMemo(
        () => generarRangoFechas(fechaInicioSalida, fechaFinSalida),
        [fechaInicioSalida, fechaFinSalida]
    );

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
                icono: paradaEditar.icono || '',
                color: paradaEditar.color || '',
            });
        } else if (abierto) { setForm({ ...INICIAL }); }
        setPueblos([]); setPagina(0);
    }, [abierto, paradaEditar]);

    // Buscar municipios
    useEffect(() => {
        if (!abierto) { setPueblos([]); return; }
        const ori = puntosRuta[0], dst = puntosRuta[puntosRuta.length - 1];
        if (!ori?.nombre && !ori?.lat) return;
        if (!dst?.nombre && !dst?.lat) return;
        setPagina(0); setBuscandoPueblos(true);
        buscarPueblosEnRuta(puntosRuta, routeCoords)
            .then(async (lista) => {
                setPueblos(lista);
                const enr = await enriquecerPueblos(lista.slice(0, POR_PAGINA));
                setPueblos(prev => { const c = [...prev]; enr.forEach((e,i) => { c[i] = e; }); return c; });
            })
            .catch(() => setPueblos([]))
            .finally(() => setBuscandoPueblos(false));
    }, [abierto, puntosRuta[0]?.nombre, puntosRuta[0]?.lat,
        puntosRuta[puntosRuta.length-1]?.nombre, puntosRuta[puntosRuta.length-1]?.lat]);

    useEffect(() => {
        if (!pueblos.length || buscandoPueblos) return;
        const ini = pagina * POR_PAGINA;
        const pag = pueblos.slice(ini, ini + POR_PAGINA);
        if (pag.every(p => p._enriquecido)) return;
        enriquecerPueblos(pag).then(enr => {
            setPueblos(prev => { const c = [...prev]; enr.forEach((e,i) => { c[ini+i] = e; }); return c; });
        });
    }, [pagina]);

    if (!abierto) return null;

    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
    const handleUbi = (d) => setForm(prev => ({ ...prev, ubicacion: d.nombre, lat: d.lat, lng: d.lng }));
    const ok = form.nombre.trim() && form.motivo && form.ubicacion;
    const tiempo = form.tiempoCantidad ? `${form.tiempoCantidad} ${form.tiempoUnidad === 'horas' ? 'horas' : 'min'}` : '';

    const guardar = () => {
        if (!ok) return;
        onAgregar({
            nombre: form.nombre.trim(),
            motivo: form.motivo === 'otro' ? form.motivoOtro.trim() : form.motivo,
            tiempoEstimado: tiempo, actividad: form.actividad,
            lat: form.lat, lng: form.lng, ubicacion: form.ubicacion,
            fechaProgramada: form.fechaProgramada || null,
            horaProgramada: form.horaProgramada || null,
            notasItinerario: form.notasItinerario.trim(),
            icono: form.icono,
            color: form.color,
        });
        setForm({ ...INICIAL }); onCerrar();
    };

    const cancelar = () => { setForm({ ...INICIAL }); onCerrar(); };
    const motivoLabel = MOTIVOS.find(m => m.value === form.motivo)?.label || form.motivoOtro || '';
    const tieneSug = true; // Mostrar siempre las sugerencias

    return (
        <div className="pp-overlay">
            {/* ── Header ──────────────────────── */}
            <div className="pp-header">
                <button type="button" className="pp-btn-volver" onClick={cancelar}>
                    <IcoFlecha /> Volver
                </button>
                <div className="pp-header-info">
                    <h2 className="pp-header-titulo">
                        {esEdicion ? 'Editar Parada' : 'Nueva Parada'}
                    </h2>
                    <p className="pp-header-sub">Configura los detalles para el itinerario</p>
                </div>
                <button type="button" className="pp-btn-guardar" onClick={guardar} disabled={!ok}>
                    {esEdicion ? 'Guardar Cambios' : 'Agregar al Itinerario'}
                </button>
            </div>

            {/* ── Body: 2 áreas principales (Premium UX) ────────── */}
            <div className="pp-body pp-body--premium">
                
                {/* ── Lado Izquierdo: Formulario de Configuración ──────── */}
                <div className="pp-form-area">
                    <div className="pp-form-grid">
                        
                        <BloqueApariencia form={form} set={set} />
                        <BloqueInformacion form={form} set={set} handleUbi={handleUbi} />
                        <BloqueProgramacion 
                            form={form} set={set} 
                            fechasViaje={fechasViaje} 
                            fechaInicioSalida={fechaInicioSalida} 
                            fechaFinSalida={fechaFinSalida} 
                        />
                        <BloqueNotas form={form} set={set} />
                    </div>
                </div>

                {/* ── Lado Derecho: Contexto y Vista Previa (Panel Lateral Inmersivo) ──────── */}
                <PanelContextoLateral
                    form={form} setForm={setForm}
                    rutaInfo={rutaInfo} tieneSug={tieneSug}
                    buscandoPueblos={buscandoPueblos} pueblos={pueblos} POR_PAGINA={POR_PAGINA}
                    pagina={pagina} setPagina={setPagina}
                    lugarViendo={lugarViendo} setLugarViendo={setLugarViendo}
                    puntosRuta={puntosRuta}
                    routeCoords={routeCoords}
                />
            </div>

            {/* Modal de Detalle de Lugar (Sugerencia) */}
            <ModalDetalleLugar
                lugarViendo={lugarViendo} setLugarViendo={setLugarViendo}
                form={form} setForm={setForm}
            />
        </div>
    );
}
