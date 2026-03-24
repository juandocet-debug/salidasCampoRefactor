// src/modulos/profesor/componentes/logistica/useAccionesRuta.js
// ─────────────────────────────────────────────────────────────────────────────
// Hook: Acciones CRUD sobre los arrays de puntosRuta y puntosRetorno.
// Agregar, quitar, mover paradas e insertar hospedaje.
// ─────────────────────────────────────────────────────────────────────────────
import { useCallback } from 'react';
import { crearDatosParada } from '@/features/salidas/dominio/reglas';

export function useAccionesRuta(setPuntosRuta, setPuntosRetorno, setForm, puntosRutaLength) {

    // ── IDA: actualizar origen/destino ────────────────────────────────────────
    const actualizarPunto = useCallback((indice, datos) => {
        if (indice === 0)                    setForm(f => ({ ...f, punto_partida: datos.nombre }));
        if (indice === puntosRutaLength - 1) setForm(f => ({ ...f, parada_max: datos.nombre }));
        setPuntosRuta(prev => {
            const nuevos = [...prev];
            nuevos[indice] = { ...nuevos[indice], ...datos };
            return nuevos;
        });
    }, [setForm, puntosRutaLength, setPuntosRuta]);

    // ── RETORNO: actualizar origen/destino ────────────────────────────────────
    const actualizarPuntoRetorno = useCallback((indice, datos) => {
        setPuntosRetorno(prev => {
            const nuevos = [...prev];
            nuevos[indice] = { ...nuevos[indice], ...datos };
            return nuevos;
        });
    }, [setPuntosRetorno]);

    // ── IDA: agregar / editar parada intermedia ───────────────────────────────
    const agregarParada = useCallback((data, indiceEdicion) => {
        const newData = crearDatosParada(data, false);
        setPuntosRuta(prev => {
            const c = [...prev];
            if (indiceEdicion != null) {
                c[indiceEdicion] = { ...c[indiceEdicion], ...newData };
            } else {
                c.splice(prev.length - 1, 0, newData);
            }
            return c;
        });
    }, [setPuntosRuta]);

    // ── IDA: quitar parada intermedia ─────────────────────────────────────────
    const quitarParada = useCallback((indice) => {
        setPuntosRuta(prev => prev.length <= 2 ? prev : prev.filter((_, i) => i !== indice));
    }, [setPuntosRuta]);

    // ── IDA: mover parada a otra fecha (Kanban drag & drop) ──────────────────
    const moverParada = useCallback((sourceIndex, targetDateKey) => {
        setPuntosRuta(prev => {
            const c          = [...prev];
            const itemToMove = { ...c[sourceIndex], fechaProgramada: targetDateKey === '9999-99-99' ? null : targetDateKey };
            c.splice(sourceIndex, 1);
            let insertAt = c.length - 1;
            for (let i = c.length - 2; i >= 1; i--) {
                const dateKey = c[i].fechaProgramada || '9999-99-99';
                if (dateKey === targetDateKey)                                            { insertAt = i + 1; break; }
                else if (targetDateKey !== '9999-99-99' && dateKey < targetDateKey)      { insertAt = i + 1; break; }
            }
            if (targetDateKey === '9999-99-99') insertAt = c.length - 1;
            c.splice(insertAt, 0, itemToMove);
            return c;
        });
    }, [setPuntosRuta]);

    // ── IDA: insertar hospedaje ───────────────────────────────────────────────
    const agregarHospedaje = useCallback((hotelData) => {
        setPuntosRuta(prev => { const c = [...prev]; c.splice(prev.length - 1, 0, hotelData); return c; });
    }, [setPuntosRuta]);

    // ── RETORNO: agregar / editar parada intermedia ───────────────────────────
    const agregarParadaRetorno = useCallback((data, indiceEdicion) => {
        const newData = crearDatosParada(data, true);
        setPuntosRetorno(prev => {
            const c = [...prev];
            if (indiceEdicion != null) {
                c[indiceEdicion] = { ...c[indiceEdicion], ...newData };
            } else {
                c.splice(prev.length - 1, 0, newData);
            }
            return c;
        });
    }, [setPuntosRetorno]);

    // ── RETORNO: quitar parada intermedia ─────────────────────────────────────
    const quitarParadaRetorno = useCallback((indice) => {
        setPuntosRetorno(prev => prev.length <= 2 ? prev : prev.filter((_, i) => i !== indice));
    }, [setPuntosRetorno]);

    // ── RETORNO: mover parada a otra fecha ────────────────────────────────────
    const moverParadaRetorno = useCallback((sourceIndex, targetDateKey) => {
        setPuntosRetorno(prev => {
            const c    = [...prev];
            const item = { ...c[sourceIndex], fechaProgramada: targetDateKey === '9999-99-99' ? null : targetDateKey };
            c.splice(sourceIndex, 1);
            c.push(item);
            return c;
        });
    }, [setPuntosRetorno]);

    return {
        actualizarPunto, actualizarPuntoRetorno,
        agregarParada, quitarParada, moverParada, agregarHospedaje,
        agregarParadaRetorno, quitarParadaRetorno, moverParadaRetorno,
    };
}
