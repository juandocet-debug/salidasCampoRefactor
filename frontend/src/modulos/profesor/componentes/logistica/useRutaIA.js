// src/modulos/profesor/componentes/logistica/useRutaIA.js
// ─────────────────────────────────────────────────────────────────────────────
// Hook: Consulta tiempos reales de ruta a la IA (backend Groq/Llama).
// Se activa cuando cambian origen/destino y ya hay distancia calculada por OSRM.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';

const API_TIEMPO = 'http://localhost:8000/api/nucleo/tiempo-ruta/';

/**
 * @param {object[]} puntos      - Array de puntos de la ruta (con .nombre)
 * @param {number}   distanciaKm - Condición de activación: la IA solo se consulta si > 0
 * @param {Function} setRutaInfo - Setter del estado rutaInfo correspondiente
 * @param {string}   tag         - Etiqueta para logs ('IDA' | 'RETORNO')
 */
export function useRutaIA(puntos, distanciaKm, setRutaInfo, tag) {
    const ultimaConsultaRef = useRef('');

    useEffect(() => {
        const ori = puntos[0];
        const dst = puntos[puntos.length - 1];
        if (!ori?.nombre || !dst?.nombre || distanciaKm <= 0) return;

        const key = `${ori.nombre}_${dst.nombre}`;
        if (ultimaConsultaRef.current === key) return;
        ultimaConsultaRef.current = key;

        setRutaInfo(prev => ({ ...prev, duracion_min: 0, _pendienteGemini: true, _geminiError: false }));

        fetch(API_TIEMPO, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ origen: ori.nombre, destino: dst.nombre }),
        })
            .then(r => {
                if (!r.ok) throw new Error(`Server ${r.status}`);
                return r.json();
            })
            .then(data => {
                if (data.ok && data.datos?.minutos) {
                    console.log(`[IA] ${tag}: ${data.datos.horas}h — ${data.datos.nota || ''}`);
                    setRutaInfo(prev => ({
                        ...prev,
                        duracion_min:     data.datos.minutos,
                        _pendienteGemini: false,
                        _gemini:          true,
                    }));
                } else {
                    console.warn(`[IA] ${tag} falló:`, data.error);
                    setRutaInfo(prev => ({ ...prev, _pendienteGemini: false, _geminiError: true }));
                }
            })
            .catch(err => {
                console.warn(`[IA] ${tag} error:`, err);
                setRutaInfo(prev => ({ ...prev, _pendienteGemini: false, _geminiError: true }));
            });
    }, [puntos, distanciaKm]);
}
