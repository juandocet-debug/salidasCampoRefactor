# aplicaciones/nucleo/servicios/recalcular.py
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# SERVICIO: Recalcular costo estimado de TODAS las salidas existentes.
# Se ejecuta automÃ¡ticamente cuando el Admin actualiza los parÃ¡metros del
# sistema (precio del galÃ³n, rendimiento, costo noche, hora extra).
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import logging
from .costo import calcular_costo_salida

from aplicaciones.parametros.modelos import ParametrosSistema
from aplicaciones.salidas.modelos import Salida

logger = logging.getLogger(__name__)


def recalcular_costos_salidas():
    """
    Recalcula el costo estimado de todas las salidas que tengan distancia > 0.
    Usa los parÃ¡metros actuales del sistema y el rendimiento segÃºn tipo de vehÃ­culo.
    Retorna la cantidad de salidas actualizadas.
    """
    params = ParametrosSistema.obtener()
    salidas = Salida.objects.filter(distancia_total_km__gt=0)
    actualizadas = 0

    for salida in salidas:
        # Usar rendimiento especÃ­fico del tipo de vehÃ­culo de cada salida
        rendimiento = params.rendimiento_para_tipo(
            salida.tipo_vehiculo_calculo or 'bus'
        )
        resultado = calcular_costo_salida(
            distancia_km=salida.distancia_total_km,
            duracion_dias=salida.duracion_dias,
            horas_totales=salida.horas_viaje,
            precio_galon=params.precio_galon,
            rendimiento=rendimiento,
            costo_noche=params.costo_noche,
            costo_hora_extra=params.costo_hora_extra,
            costo_hora_extra_2=params.costo_hora_extra_2,
            max_horas_viaje=params.max_horas_viaje,
            horas_buffer=params.horas_buffer,
            hora_inicio=salida.hora_inicio,
            hora_fin=salida.hora_fin,
        )
        if salida.costo_estimado != resultado.total:
            salida.costo_estimado = resultado.total
            salida.save(update_fields=['costo_estimado'])
            actualizadas += 1

    logger.info(
        'RecÃ¡lculo de costos: %d salidas actualizadas (params: galÃ³n=$%s)',
        actualizadas, params.precio_galon,
    )
    return actualizadas

