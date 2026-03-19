# aplicaciones/nucleo/servicios/costo.py
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# FÃ“RMULA DE COSTO ESTIMADO DE SALIDA â€” FunciÃ³n pura Python.
#
# Modelo matemÃ¡tico completo:
#   CostoTotal = CostoGasolina + CostoConductor
#
# CostoConductor = ViÃ¡ticos + HorasExtraMaÃ±ana + HorasExtraTarde + HorasExtraNoche
#
# Jornada ordinaria: 8:00am - 5:00pm (9h)
# HE MaÃ±ana:  5am-8am  â†’ $11,000/h (misma tarifa HE1)
# HE Tarde:   5pm-6pm  â†’ $11,000/h (HE1)
# HE Noche:   6pm-8pm  â†’ $15,000/h (HE2)
# LÃ­mite absoluto: 8pm (20:00)
# Horas buffer: se suman al tiempo de ruta (paradas, imprevistos)
#
# Esta funciÃ³n NO toca la base de datos ni Django.
# Es pura: mismo input â†’ mismo output, sin efectos secundarios.
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

from dataclasses import dataclass
from datetime import time


@dataclass
class ResultadoCosto:
    """Desglose completo del costo estimado de una salida."""
    total:                    int
    combustible:              int
    viaticos_conductor:       int
    horas_extra_total:        int
    he_manana_costo:          int
    he_tarde_costo:           int
    he_noche_costo:           int
    viaticos_cantidad:        float
    he_manana_cantidad:       float
    he_tarde_cantidad:        float
    he_noche_cantidad:        float
    horas_ordinarias:         float
    horas_extra_total_cantidad: float
    hora_fin_estimada:        float  # hora decimal estimada de fin
    # Alias legacy para compatibilidad
    hospedaje:                int = 0
    horas_extra:              int = 0
    noches:                   float = 0
    horas_extra_cantidad:     float = 0
    horas_extra_1_costo:      int = 0
    horas_extra_2_costo:      int = 0
    horas_extra_1_cantidad:   float = 0
    horas_extra_2_cantidad:   float = 0


def calcular_costo_salida(
    distancia_km: float,
    duracion_dias: float,
    horas_totales: float,
    precio_galon: float,
    rendimiento: float,
    costo_noche: float,
    costo_hora_extra: float,
    costo_hora_extra_2: float = 15000,
    max_horas_viaje: float = 10,
    horas_buffer: float = 1,
    hora_inicio: time = None,
    hora_fin: time = None,
) -> ResultadoCosto:
    """
    Calcula el costo estimado de una salida de campo.

    Args:
        distancia_km:       DT â€” distancia total del recorrido en km
        duracion_dias:      D  â€” duraciÃ³n de la salida en dÃ­as
        horas_totales:      Ht â€” horas totales del viaje (DT / velocidad_promedio)
        precio_galon:       Pg â€” COP por galÃ³n de combustible
        rendimiento:        R  â€” km por galÃ³n del vehÃ­culo
        costo_noche:        Vu â€” valor viÃ¡tico completo del conductor por dÃ­a
        costo_hora_extra:   HE1 â€” COP hora extra (5am-8am y 5pm-6pm)
        costo_hora_extra_2: HE2 â€” COP hora extra (6pm-8pm)
        max_horas_viaje:    MÃ¡x horas de conducciÃ³n por dÃ­a (default 10)
        horas_buffer:       Horas extra sobre el recorrido calculado
        hora_inicio:        Hora de salida del profesor
        hora_fin:           Hora de llegada (si se conoce)

    Returns:
        ResultadoCosto con total y desglose por componente.
    """
    # â”€â”€ 1. Costo de Gasolina â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    combustible = (distancia_km / rendimiento) * precio_galon if rendimiento > 0 else 0

    # â”€â”€ 2. ViÃ¡ticos del conductor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    viaticos_cantidad = max(0.5, duracion_dias - 0.5)
    viaticos_conductor = viaticos_cantidad * costo_noche

    # â”€â”€ 3. Horas efectivas (ruta + buffer) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    horas_efectivas = horas_totales + horas_buffer
    horas_maximas = max_horas_viaje * duracion_dias
    horas_efectivas = min(horas_efectivas, horas_maximas)

    # â”€â”€ 4. Calcular horas extra segÃºn hora de inicio â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    he_manana = 0.0
    he_tarde = 0.0
    he_noche = 0.0
    horas_ordinarias_usadas = 0.0
    hora_fin_estimada = 17.0  # default

    if duracion_dias == 1:
        # â”€â”€ Viaje de 1 dÃ­a: cÃ¡lculo preciso con hora_inicio â”€â”€â”€â”€â”€â”€
        h_inicio = 8.0  # default 8am
        if hora_inicio is not None:
            h_inicio = hora_inicio.hour + hora_inicio.minute / 60.0
        elif hora_fin is not None:
            # Si solo tenemos hora_fin, estimar hora_inicio
            h_inicio = max(5.0, (hora_fin.hour + hora_fin.minute / 60.0) - horas_efectivas)

        # Hora de fin estimada
        hora_fin_estimada = min(h_inicio + horas_efectivas, 20.0)  # tope 8pm

        # HE MaÃ±ana: horas antes de las 8am
        if h_inicio < 8.0:
            he_manana = min(8.0 - h_inicio, horas_efectivas)

        # Horas restantes despuÃ©s de la maÃ±ana
        restante = horas_efectivas - he_manana

        # Horas ordinarias: 8am-5pm = 9h mÃ¡x
        horas_ordinarias_usadas = min(restante, 9.0)
        restante -= horas_ordinarias_usadas

        # HE Tarde: 5pm-6pm = mÃ¡x 1h
        he_tarde = min(restante, 1.0)
        restante -= he_tarde

        # HE Noche: 6pm-8pm = mÃ¡x 2h
        he_noche = min(restante, 2.0)

    else:
        # â”€â”€ Viaje de mÃºltiples dÃ­as â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        h_inicio = 8.0
        if hora_inicio is not None:
            h_inicio = hora_inicio.hour + hora_inicio.minute / 60.0

        # DÃ­a 1: posible HE maÃ±ana
        if h_inicio < 8.0:
            he_manana = min(8.0 - h_inicio, horas_efectivas)

        # Horas ordinarias totales disponibles
        horas_ordinarias_totales = 9.0 * duracion_dias
        restante = horas_efectivas - he_manana
        horas_ordinarias_usadas = min(restante, horas_ordinarias_totales)
        restante -= horas_ordinarias_usadas

        # HE Tarde: 5pm-6pm â†’ mÃ¡x 1h por dÃ­a
        he_tarde = min(restante, 1.0 * duracion_dias)
        restante -= he_tarde

        # HE Noche: 6pm-8pm â†’ mÃ¡x 2h por dÃ­a
        he_noche = min(restante, 2.0 * duracion_dias)

        hora_fin_estimada = 17.0  # estimado para multi-dÃ­a

    # â”€â”€ 5. Costos de horas extra â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    # HE maÃ±ana y HE tarde â†’ misma tarifa (costo_hora_extra / HE1)
    costo_he_manana = he_manana * costo_hora_extra
    costo_he_tarde = he_tarde * costo_hora_extra
    # HE noche â†’ tarifa nocturna (costo_hora_extra_2 / HE2)
    costo_he_noche = he_noche * costo_hora_extra_2

    horas_extra_total_cantidad = he_manana + he_tarde + he_noche
    horas_extra_total_costo = costo_he_manana + costo_he_tarde + costo_he_noche

    # â”€â”€ 6. Costo total â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    costo_conductor = viaticos_conductor + horas_extra_total_costo
    total = combustible + costo_conductor

    # HE1 legacy = maÃ±ana + tarde (misma tarifa)
    he1_total = he_manana + he_tarde
    he2_total = he_noche

    return ResultadoCosto(
        total=round(total),
        combustible=round(combustible),
        viaticos_conductor=round(viaticos_conductor),
        horas_extra_total=round(horas_extra_total_costo),
        he_manana_costo=round(costo_he_manana),
        he_tarde_costo=round(costo_he_tarde),
        he_noche_costo=round(costo_he_noche),
        viaticos_cantidad=viaticos_cantidad,
        he_manana_cantidad=he_manana,
        he_tarde_cantidad=he_tarde,
        he_noche_cantidad=he_noche,
        horas_ordinarias=horas_ordinarias_usadas,
        horas_extra_total_cantidad=horas_extra_total_cantidad,
        hora_fin_estimada=hora_fin_estimada,
        # Alias legacy
        hospedaje=round(viaticos_conductor),
        horas_extra=round(horas_extra_total_costo),
        noches=viaticos_cantidad,
        horas_extra_cantidad=horas_extra_total_cantidad,
        horas_extra_1_costo=round(costo_he_manana + costo_he_tarde),
        horas_extra_2_costo=round(costo_he_noche),
        horas_extra_1_cantidad=he1_total,
        horas_extra_2_cantidad=he2_total,
    )

