# CAPA: Dominio — Compartido
# QUÉ HACE: Fórmula pura de cálculo de costo de salida de campo
# NO DEBE CONTENER: Django, ORM, lógica de vistas

from dataclasses import dataclass


@dataclass
class ResultadoCosto:
    total:       float
    combustible: float
    viaticos:    float
    he_manana:   float
    he_tarde:    float
    he_noche:    float


def calcular_costo_salida(
    distancia_km:        float,
    duracion_dias:       float,
    horas_totales:       float,
    precio_galon:        float,
    rendimiento:         float,
    costo_noche:         float,
    costo_hora_extra:    float = 11000,
    costo_hora_extra_2:  float = 15000,
    max_horas_viaje:     float = 10,
    horas_buffer:        float = 1,
) -> ResultadoCosto:

    if duracion_dias <= 0:
        raise ValueError("duracion_dias debe ser mayor a 0")
    if rendimiento <= 0:
        raise ValueError("rendimiento debe ser mayor a 0")

    # 1. Combustible
    combustible = (distancia_km / rendimiento) * precio_galon

    # 2. Viáticos conductor
    viaticos = max(0.5, duracion_dias - 0.5) * costo_noche

    # 3. Horas efectivas
    horas_efectivas = min(
        horas_totales + horas_buffer,
        max_horas_viaje * duracion_dias
    )

    # 4. Bandas de horas extra por día
    he_manana = 0.0
    he_tarde  = 0.0
    he_noche  = 0.0

    horas_por_dia = horas_efectivas / duracion_dias

    # 5am-8am → HE Mañana (3h máx)
    if horas_por_dia > 9:
        he_manana = min(horas_por_dia - 9, 3) * duracion_dias

    # 5pm-6pm → HE Tarde (1h máx)
    if horas_por_dia > 12:
        he_tarde = min(horas_por_dia - 12, 1) * duracion_dias

    # 6pm-8pm → HE Noche (2h máx)
    if horas_por_dia > 13:
        he_noche = min(horas_por_dia - 13, 2) * duracion_dias

    # 6. Total
    total = (
        combustible
        + viaticos
        + (he_manana + he_tarde) * costo_hora_extra
        + he_noche * costo_hora_extra_2
    )

    return ResultadoCosto(
        total=round(total, 2),
        combustible=round(combustible, 2),
        viaticos=round(viaticos, 2),
        he_manana=round(he_manana, 2),
        he_tarde=round(he_tarde, 2),
        he_noche=round(he_noche, 2),
    )
