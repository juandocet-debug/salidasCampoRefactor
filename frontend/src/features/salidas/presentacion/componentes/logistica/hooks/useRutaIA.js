// src/modulos/profesor/componentes/logistica/useRutaIA.js
// ─────────────────────────────────────────────────────────────────────────────
// Hook: Consulta tiempos reales de ruta a la IA (backend Groq/Llama).
// Se activa en cuanto hay nombres de origen/destino, EN PARALELO con OSRM.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
import { clienteHttp } from '@/shared/api/clienteHttp';

const API_TIEMPO = '/api/salidas/itinerario/ia/tiempo-ruta/';

/**
 * @param {object[]} puntos      - Array de puntos de la ruta (con .nombre)
 * @param {number}   distanciaKm - Ya no bloquea; referencia para no sobreescribir distancia OSRM
 * @param {Function} setRutaInfo - Setter del estado rutaInfo correspondiente
 * @param {string}   tag         - Etiqueta para logs ('IDA' | 'RETORNO')
 */
export function useRutaIA(puntos, distanciaKm, setRutaInfo, tag) {
    const ultimaConsultaRef = useRef('');
    const oriNombre = puntos[0]?.nombre || '';
    const dstNombre = puntos[puntos.length - 1]?.nombre || '';

    useEffect(() => {
        // Disparar en cuanto haya nombres, SIN esperar distancia de OSRM
        if (!oriNombre || !dstNombre) return;

        const key = `${oriNombre}_${dstNombre}`;
        if (ultimaConsultaRef.current === key) return;
        ultimaConsultaRef.current = key;

        setRutaInfo(prev => ({ ...prev, _pendienteGemini: true, _geminiError: false }));

        clienteHttp.post(API_TIEMPO, { origen: oriNombre, destino: dstNombre })
            .then(res => {
                const data = res.data;
                if (data.ok) {
                    const mins = data.datos?.minutos ?? 0;
                    const km   = data.datos?.distancia_km ?? 0;
                    console.log(`[IA] ${tag} tiempo: ${mins} min / ${km} km`);
                    setRutaInfo(prev => ({
                        ...prev,
                        duracion_min: mins,
                        // Usar distancia IA si:
                        // 1) No hay distancia aún (=0), O
                        // 2) La IA da >15% más que el valor actual → el actual era Haversine (línea recta)
                        ...(km > 0 && (prev.distancia_km === 0 || km > prev.distancia_km * 1.15)
                            ? { distancia_km: km }
                            : {}),
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
    // Disparar solo cuando cambian los NOMBRES (en paralelo con OSRM, no después)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oriNombre, dstNombre]);
}
