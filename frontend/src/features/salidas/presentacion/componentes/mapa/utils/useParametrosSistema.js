// src/modulos/profesor/componentes/mapa/useParametrosSistema.js
// ─────────────────────────────────────────────────────────────────────────────
// Hook singleton: carga parámetros del sistema desde el backend (con cache).
// Reutilizable en cualquier componente que necesite parámetros de costo.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { clienteHttp } from '@/shared/api/clienteHttp';

export const FALLBACK_PARAMS = {
    precio_galon:          16500,
    rendimiento:           8,
    rendimiento_bus:       5,
    rendimiento_buseta:    8,
    rendimiento_camioneta: 12,
    costo_noche:           222000,
    costo_hora_extra:      11000,
    costo_hora_extra_2:    15000,
    max_horas_viaje:       10,
    horas_buffer:          1,
};

// Cache en módulo — se comparte entre todas las instancias del hook
let _cache = null;

export function useParametrosSistema() {
    const [params, setParams] = useState(_cache || FALLBACK_PARAMS);

    useEffect(() => {
        if (_cache) return;
        clienteHttp.get('/api/admin/parametros/')
            .then(r => r.data)
            .then(d => {
                if (d.ok && d.datos) {
                    const p = {
                        precio_galon:          d.datos.precio_galon,
                        rendimiento:           d.datos.rendimiento,
                        rendimiento_bus:       d.datos.rendimiento_bus       || FALLBACK_PARAMS.rendimiento_bus,
                        rendimiento_buseta:    d.datos.rendimiento_buseta    || FALLBACK_PARAMS.rendimiento_buseta,
                        rendimiento_camioneta: d.datos.rendimiento_camioneta || FALLBACK_PARAMS.rendimiento_camioneta,
                        costo_noche:           d.datos.costo_noche,
                        costo_hora_extra:      d.datos.costo_hora_extra,
                        costo_hora_extra_2:    d.datos.costo_hora_extra_2    || FALLBACK_PARAMS.costo_hora_extra_2,
                        max_horas_viaje:       d.datos.max_horas_viaje       || FALLBACK_PARAMS.max_horas_viaje,
                        horas_buffer:          d.datos.horas_buffer          ?? FALLBACK_PARAMS.horas_buffer,
                    };
                    _cache = p;
                    setParams(p);
                }
            })
            .catch(() => { /* silencioso — usa fallback */ });
    }, []);

    return params;
}
