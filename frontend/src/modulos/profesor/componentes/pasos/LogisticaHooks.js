// src/modulos/profesor/componentes/pasos/LogisticaHooks.js
// ──────────────────────────────────────────────────────────────────────────────
// Hooks derivados del Paso3Logistica. Cada uno encapsula un efecto secundario
// independiente para mantener Paso3Logistica.jsx enfocado en el layout.
// ──────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { tipoVehiculoSugerido } from '../mapa/WidgetCosto';

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
 * Sugiere automáticamente el tipo de vehículo cuando no se ha seleccionado uno
 * y cambia el número de estudiantes.
 */
export function useAutoTipoVehiculo({ form, setForm }) {
    React.useEffect(() => {
        if (!form.tipo_vehiculo_calculo || form.tipo_vehiculo_calculo === '') {
            const sugerido = tipoVehiculoSugerido(form.num_estudiantes);
            setForm(f => ({ ...f, tipo_vehiculo_calculo: sugerido }));
        }
    }, [form.num_estudiantes]);
}
