# dominio/transporte/entidades.py  (~130 líneas)
# ⚠️  Python puro — cero Django.

from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from .valor_objetos import (
    TipoVehiculo, EstadoVehiculo, Propietario,
    TipoCombustible, TipoTransporte,
)


# ── Excepción de dominio ──────────────────────────────────────────────────────

class VehiculoNoDisponible(Exception):
    def __init__(self, placa: str):
        super().__init__(f'El vehículo {placa!r} no está disponible.')


class CapacidadInsuficiente(Exception):
    """Se intentó asignar un vehículo con menos asientos que estudiantes."""
    def __init__(self, capacidad: int, requeridos: int):
        super().__init__(
            f'Capacidad del vehículo ({capacidad}) insuficiente para {requeridos} estudiantes.'
        )


# ── Entidad: Vehiculo ─────────────────────────────────────────────────────────

@dataclass
class Vehiculo:
    """
    Vehículo disponible en la flota institucional o externa.
    Reglas:
    - Solo puede asignarse si estado == DISPONIBLE.
    - Su rendimiento (km/gal) afecta el cálculo de costo de combustible.
    """
    id:               Optional[int]        = None
    placa:            str                  = ''
    tipo:             Optional[TipoVehiculo]     = None
    marca:            str                  = ''
    modelo:           str                  = ''
    anio:             Optional[int]        = None
    capacidad:        int                  = 0
    rendimiento_kmgal: float              = 8.0
    tipo_combustible: TipoCombustible     = TipoCombustible.DIESEL
    propietario:      Propietario         = Propietario.INSTITUCIONAL
    estado_tecnico:   EstadoVehiculo      = EstadoVehiculo.DISPONIBLE
    foto_url:         str                  = ''
    notas:            str                  = ''

    # ── Comportamiento ────────────────────────────────────────────────────

    def validar_disponibilidad(self) -> None:
        if self.estado_tecnico != EstadoVehiculo.DISPONIBLE:
            raise VehiculoNoDisponible(self.placa)

    def validar_capacidad(self, num_estudiantes: int) -> None:
        if self.capacidad < num_estudiantes:
            raise CapacidadInsuficiente(self.capacidad, num_estudiantes)

    @property
    def etiqueta(self) -> str:
        partes = [self.placa, self.marca, self.modelo]
        return ' '.join(p for p in partes if p)


# ── Entidad: Asignacion ───────────────────────────────────────────────────────

@dataclass
class Asignacion:
    """
    Asignación de un vehículo y conductor a una salida de campo.
    Una salida puede tener múltiples asignaciones (varios vehículos).
    """
    id:              Optional[int]        = None
    salida_id:       Optional[int]        = None
    vehiculo_id:     Optional[int]        = None
    conductor_id:    Optional[int]        = None
    tipo_transporte: TipoTransporte       = TipoTransporte.PROPIO
    empresa_externa: str                  = ''
    confirmado_en:   Optional[datetime]   = None

    def confirmar(self, ahora: datetime) -> None:
        self.confirmado_en = ahora

    @property
    def es_externo(self) -> bool:
        return self.tipo_transporte == TipoTransporte.EXTERNO
