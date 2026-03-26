// src/modulos/profesor/componentes/logistica/useRutaIA.js
// ─────────────────────────────────────────────────────────────────────────────
// Hook: Consulta tiempos reales de ruta a la IA (backend Groq/Llama).
// Se activa cuando cambian origen/destino y ya hay distancia calculada por OSRM.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
import { clienteHttp } from '@/shared/api/clienteHttp';

const API_TIEMPO = '/api/salidas/itinerario/ia/tiempo-ruta/';

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

        clienteHttp.post(API_TIEMPO, { origen: ori.nombre, destino: dst.nombre })
            .then(res => {
                const data = res.data;
                if (data.ok) {
                    const mins = data.datos?.minutos ?? 0;
                    console.log(`[IA] ${tag} tiempo: ${mins} min`);
                    setRutaInfo(prev => ({
                        ...prev,
                        duracion_min:     mins,
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
