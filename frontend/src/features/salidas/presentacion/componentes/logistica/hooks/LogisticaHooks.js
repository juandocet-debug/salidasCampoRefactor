// src/modulos/profesor/componentes/pasos/LogisticaHooks.js
// ──────────────────────────────────────────────────────────────────────────────
// Hooks derivados del Paso3Logistica. Cada uno encapsula un efecto secundario
// independiente para mantener Paso3Logistica.jsx enfocado en el layout.
// ──────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { useFlotaDisponible } from './useFlotaDisponible';

/**
 * Auto-calcula hora_fin basándose en hora_inicio + duración total de la ruta
 * (ida + retorno), tanto si viene de OSRM como de la IA (Gemini).
 */
export function useAutoHoraFin({ form, setForm, tiempos, tiemposRetorno, rutaInfoIda, rutaInfoRetorno }) {
    React.useEffect(() => {
        if (!form.hora_inicio) return;

        const minIda     = tiempos?.totalMin     > 0 ? tiempos.totalMin     : (rutaInfoIda.duracion_min     || 0);
        const minRetorno = tiemposRetorno?.totalMin > 0 ? tiemposRetorno.totalMin : (rutaInfoRetorno.duracion_min || 0);
        const totalMin   = minIda + minRetorno;
        if (totalMin === 0) return;

        const [h, m]    = form.hora_inicio.split(':').map(Number);
        const salidaMin = h * 60 + m;
        const regresoMin = salidaMin + Math.round(totalMin);
        const hReg  = Math.floor(regresoMin / 60) % 24;
        const mReg  = regresoMin % 60;
        const horaFin = `${String(hReg).padStart(2, '0')}:${String(mReg).padStart(2, '0')}`;

        if (form.hora_fin !== horaFin) {
            setForm(f => ({ ...f, hora_fin: horaFin }));
        }
    }, [
        form.hora_inicio,
        tiempos?.totalMin, tiemposRetorno?.totalMin,
        rutaInfoIda.duracion_min, rutaInfoRetorno.duracion_min,
    ]);
}

/**
 * Sincroniza distancia_total_km, duracion_dias y horas_viaje al form
 * para que el backend los persista.
 */
export function useSyncCostosForm({ form, setForm, rutaInfoIda, rutaInfoRetorno, calcularDias, calcularHorasTotales, tiempos, tiemposRetorno }) {
    React.useEffect(() => {
        const distanciaTotal = (rutaInfoIda.distancia_km || 0) + (rutaInfoRetorno.distancia_km || 0);
        const dias  = calcularDias();
        const horas = calcularHorasTotales();
        if (
            distanciaTotal > 0 && (
                form.distancia_total_km !== distanciaTotal ||
                form.duracion_dias      !== dias           ||
                form.horas_viaje        !== horas
            )
        ) {
            setForm(f => ({ ...f, distancia_total_km: distanciaTotal, duracion_dias: dias, horas_viaje: horas }));
        }
    }, [
        rutaInfoIda.distancia_km, rutaInfoRetorno.distancia_km,
        form.fecha_inicio, form.fecha_fin, form.hora_inicio, form.hora_fin,
        tiempos?.totalMin, tiemposRetorno?.totalMin,
    ]);
}

/**
 * Sugiere automáticamente la lista de vehículos cuando no se ha seleccionado ninguno
 * y la cantidad de estudiantes cambia.
 */
export function useAutoFlota({ form, setForm }) {
    const { vehiculos, cargando } = useFlotaDisponible();

    React.useEffect(() => {
        if (cargando || vehiculos.length === 0) return;
        
        // Si no hay vehículos asignados o el pax cambió mucho, auto sugerimos
        // Para simplificar: solo auto-asigna si está vacío
        const pax = parseInt(form.num_estudiantes) || 0;
        if ((!form.vehiculos_asignados || form.vehiculos_asignados.length === 0) && pax > 0) {
            
            // Ordenamos de mayor a menor capacidad para minimizar buses
            const flotaOrdenada = [...vehiculos].sort((a, b) => b.capacidad_pasajeros - a.capacidad_pasajeros);
            
            let capacidadAcumulada = 0;
            const asignados = [];

            for (const v of flotaOrdenada) {
                if (capacidadAcumulada >= pax) break;
                asignados.push(v.id);
                capacidadAcumulada += v.capacidad_pasajeros;
            }

            setForm(f => ({ ...f, vehiculos_asignados: asignados }));
        }
    }, [form.num_estudiantes, form.vehiculos_asignados, vehiculos, cargando, setForm]);
}
