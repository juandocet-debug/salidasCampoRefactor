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

    // ── Sincronizar cambios de texto en Paso1 → puntosRuta ───────────────────
    // Cuando el usuario escribe el destino en el campo de texto (fuera del mapa),
    // actualizar también el array puntosRuta para que el payload de guardado sea correcto.
    useEffect(() => {
        if (!form.punto_partida) return;
        setPuntosRuta(prev => {
            if (!prev.length || prev[0]?.nombre === form.punto_partida) return prev;
            const nuevos = [...prev];
            nuevos[0] = { ...nuevos[0], nombre: form.punto_partida, lat: null, lng: null };
            return nuevos;
        });
    }, [form.punto_partida]);

    useEffect(() => {
        if (!form.parada_max) return;
        setPuntosRuta(prev => {
            const last = prev.length - 1;
            if (last < 1 || prev[last]?.nombre === form.parada_max) return prev;
            const nuevos = [...prev];
            nuevos[last] = { ...nuevos[last], nombre: form.parada_max, lat: null, lng: null };
            return nuevos;
        });
    }, [form.parada_max]);


    // ── Geocodificar puntos IDA sin coordenadas ──────────────────────────────
    useEffect(() => {
        const sinCoords = puntosRuta.filter(p => p.nombre && !p.lat);
        if (!sinCoords.length) return;
        let activo = true;
        (async () => {
            const nuevos = [...puntosRuta];
            let cambio = false;
            for (let i = 0; i < nuevos.length; i++) {
                if (nuevos[i].nombre && !nuevos[i].lat) {
                    const coords = await geocodificar(nuevos[i].nombre);
                    if (activo && coords) { nuevos[i] = { ...nuevos[i], ...coords }; cambio = true; }
                }
            }
            if (activo && cambio) setPuntosRuta(nuevos);
        })();
        return () => { activo = false; };
    }, [puntosRuta]); // Se ejecuta cuando cambia puntosRuta (incluye nuevos destinos sin coords)

    // ── Distancia RETORNO preliminar (cuando el mapa no está en ese tab) ────────
    const lastPtsHashRef = useRef('');

    useEffect(() => {
        const ori = puntosRetorno[0];
        const dst = puntosRetorno[puntosRetorno.length - 1];
        if (!ori?.lat || !ori?.lng || !dst?.lat || !dst?.lng) {
            setRutaInfoRetorno(estadoRutaVacio());
            return;
        }
        const pts = puntosRetorno.filter(p => p.lat && p.lng);
        if (pts.length < 2) return;

        // Detectar si los puntos cambiaron geográficamente para saber si debemos resetear el kilometraje
        const currentHash = pts.map(p => `${p.lat},${p.lng}`).join('|');
        const ptsChanged = currentHash !== lastPtsHashRef.current;
        lastPtsHashRef.current = currentHash;

        const oriIda = puntosRuta[0];
        const dstIda = puntosRuta[puntosRuta.length - 1];

        // Helper rápido de Haversine para comparar
        const getDistKm = (a, b) => {
            if (!a?.lat || !b?.lat) return 9999;
            const dLat = (b.lat - a.lat) * Math.PI / 180;
            const dLng = (b.lng - a.lng) * Math.PI / 180;
            const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
            return 6371 * 2 * Math.asin(Math.sqrt(s));
        };

        const esEspejo = pts.length === 2 && 
                         getDistKm(ori, dstIda) < 5.0 && 
                         getDistKm(dst, oriIda) < 5.0;

        if (esEspejo && rutaInfoIda.distancia_km > 0) {
            setRutaInfoRetorno(prev => prev.distancia_km === rutaInfoIda.distancia_km && !ptsChanged
                ? prev 
                : { ...prev, distancia_km: rutaInfoIda.distancia_km, _pendienteGemini: true }
            );
            return;
        }

        const R = 6371;
        let km = 0;
        for (let i = 0; i < pts.length - 1; i++) {
            const a = pts[i], b = pts[i + 1];
            const dLat = (b.lat - a.lat) * Math.PI / 180;
            const dLng = (b.lng - a.lng) * Math.PI / 180;
            const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
            km += R * 2 * Math.asin(Math.sqrt(s));
        }
        
        setRutaInfoRetorno(prev => {
            // Proteger la distancia calculada por OSRM (que es mayor a la recta Haversine)
            // SOLO si los puntos no han cambiado. Si cambiaron (ej: digitó Cali), pisar con la nueva ruta.
            if (!ptsChanged && prev.distancia_km > 0 && Math.abs(prev.distancia_km - km) > 1) return prev;
            return { ...prev, distancia_km: +km.toFixed(1), duracion_min: 0, _pendienteGemini: true };
        });
    }, [puntosRetorno, rutaInfoIda.distancia_km, puntosRuta]);

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
