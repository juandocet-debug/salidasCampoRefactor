// src/modulos/profesor/componentes/logistica/usePuntosRuta.js
// ─────────────────────────────────────────────────────────────────────────────
// Hook orquestador: gestiona estado de puntos IDA + RETORNO y sus efectos.
// Delega en sub-módulos para mantener SRP:
//   · rutaUtils.js         — funciones puras (parseo, cálculo, normalización)
//   · useRutaIA.js         — consulta de tiempos reales a la IA (Groq/Llama)
//   · useAccionesRuta.js   — CRUD de paradas (agregar, quitar, mover)
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo, useEffect, useRef } from 'react';
import { MAX_HORAS_CONDUCTOR, calcularTiemposTramo } from '@/features/salidas/dominio/reglas';
import { geocodificar } from '@/features/salidas/aplicacion/servicios';
import { useRutaIA }       from '@/features/salidas/presentacion/componentes/logistica/hooks/useRutaIA';
import { useAccionesRuta } from '@/features/salidas/presentacion/componentes/logistica/hooks/useAccionesRuta';

// Re-exportar utilidades para que los consumidores existentes no rompan
export { parsearMinutos, fmtTiempo } from '@/features/salidas/dominio/reglas';

// ── Estado inicial ────────────────────────────────────────────────────────────
const estadoRutaVacio = () => ({ distancia_km: 0, duracion_min: 0 });

const puntosIniciales = (form) =>
    form._puntosRuta?.length >= 2
        ? form._puntosRuta
        : [{ nombre: form.punto_partida || '', lat: null, lng: null },
           { nombre: form.parada_max    || '', lat: null, lng: null }];

const puntosRetornoIniciales = (form) =>
    form._puntosRetorno?.length >= 2
        ? form._puntosRetorno
        : [{ nombre: '', lat: null, lng: null },
           { nombre: '', lat: null, lng: null }];

// ─────────────────────────────────────────────────────────────────────────────
export default function usePuntosRuta(form, setForm) {

    // ── Estado ────────────────────────────────────────────────────────────────
    const [puntosRuta,    setPuntosRuta]    = useState(() => puntosIniciales(form));
    const [puntosRetorno, setPuntosRetorno] = useState(() => puntosRetornoIniciales(form));
    const [rutaInfoIda,    setRutaInfoIda]    = useState(() =>
        form._rutaInfoIda?.distancia_km > 0 ? form._rutaInfoIda : estadoRutaVacio());
    const [rutaInfoRetorno, setRutaInfoRetorno] = useState(() =>
        form._rutaInfoRetorno?.distancia_km > 0 ? form._rutaInfoRetorno : estadoRutaVacio());

    // ── Sincronración tardía desde edición asíncrona ──────────────────────────
    const sincIda     = useRef(false);
    const sincRetorno = useRef(false);
    useEffect(() => {
        if (sincIda.current || !form._puntosRuta || form._puntosRuta.length < 2) return;
        setPuntosRuta(form._puntosRuta);
        sincIda.current = true;
    }, [form._puntosRuta]);
    useEffect(() => {
        if (sincRetorno.current || !form._puntosRetorno || form._puntosRetorno.length < 2) return;
        setPuntosRetorno(form._puntosRetorno);
        sincRetorno.current = true;
    }, [form._puntosRetorno]);

    // ── Geocodificar puntos IDA sin coordenadas (salidas viejas) ─────────────
    useEffect(() => {
        const sinCoords = puntosRuta.filter(p => p.nombre && !p.lat);
        if (!sinCoords.length) return;
        (async () => {
            const nuevos = [...puntosRuta];
            let cambio = false;
            for (let i = 0; i < nuevos.length; i++) {
                if (nuevos[i].nombre && !nuevos[i].lat) {
                    const coords = await geocodificar(nuevos[i].nombre);
                    if (coords) { nuevos[i] = { ...nuevos[i], ...coords }; cambio = true; }
                }
            }
            if (cambio) setPuntosRuta(nuevos);
        })();
    }, []); // Solo al montar

    // ── OSRM: distancia RETORNO (solo distancia, sin duración) ──────────────
    useEffect(() => {
        const ori = puntosRetorno[0];
        const dst = puntosRetorno[puntosRetorno.length - 1];
        if (!ori?.lat || !ori?.lng || !dst?.lat || !dst?.lng) {
            setRutaInfoRetorno(estadoRutaVacio());
            return;
        }
        const pts = puntosRetorno.filter(p => p.lat && p.lng);
        if (pts.length < 2) return;

        let activo = true;
        const coords = pts.map(p => `${p.lng},${p.lat}`).join(';');
        fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`)
            .then(r => r.json())
            .then(data => {
                if (!activo || data.code !== 'Ok' || !data.routes?.[0]) return;
                setRutaInfoRetorno({
                    distancia_km:    +(data.routes[0].distance / 1000).toFixed(1),
                    duracion_min:    0,
                    _pendienteGemini: true,
                });
            }).catch(() => {});
        return () => { activo = false; };
    }, [puntosRetorno]);

    // ── IA: tiempos reales (Groq/Llama 3) ────────────────────────────────────
    useRutaIA(puntosRuta,    rutaInfoIda.distancia_km,    setRutaInfoIda,    'IDA');
    useRutaIA(puntosRetorno, rutaInfoRetorno.distancia_km, setRutaInfoRetorno, 'RETORNO');

    // ── Tiempos calculados (conducción + paradas) ─────────────────────────────
    const tiempos        = useMemo(() => calcularTiemposTramo(puntosRuta,    rutaInfoIda.duracion_min),    [puntosRuta,    rutaInfoIda]);
    const tiemposRetorno = useMemo(() => calcularTiemposTramo(puntosRetorno, rutaInfoRetorno.duracion_min), [puntosRetorno, rutaInfoRetorno]);

    // ── Persistir en form padre ────────────────────────────────────────────────
    useEffect(() => {
        const requiere = tiempos.excede && !tiempos.tieneHospedaje;
        setForm(f => ({ ...f, _requiereHospedaje: requiere, _puntosRuta: puntosRuta }));
    }, [tiempos.excede, tiempos.tieneHospedaje, puntosRuta, setForm]);

    useEffect(() => {
        setForm(f => ({ ...f, _puntosRetorno: puntosRetorno }));
    }, [puntosRetorno, setForm]);

    useEffect(() => {
        if (rutaInfoIda.distancia_km > 0) setForm(f => ({ ...f, _rutaInfoIda: rutaInfoIda }));
    }, [rutaInfoIda, setForm]);

    useEffect(() => {
        if (rutaInfoRetorno.distancia_km > 0) setForm(f => ({ ...f, _rutaInfoRetorno: rutaInfoRetorno }));
    }, [rutaInfoRetorno, setForm]);

    // ── Acciones CRUD (delegadas) ─────────────────────────────────────────────
    const acciones = useAccionesRuta(setPuntosRuta, setPuntosRetorno, setForm, puntosRuta.length);

    return {
        puntosRuta, puntosRetorno,
        rutaInfoIda, setRutaInfoIda,
        rutaInfoRetorno, setRutaInfoRetorno,
        tiempos, tiemposRetorno,
        MAX_HORAS_CONDUCTOR,
        ...acciones,
    };
}
