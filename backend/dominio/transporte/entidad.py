# CAPA: Dominio
# QUÉ HACE: Entidades Vehiculo y Asignacion
# NO DEBE CONTENER: Django, ORM, lógica de vistas

from __future__ import annotations
from dataclasses import dataclass, field
from typing import Optional
from dominio.transporte.valor_objetos import (
    TipoVehiculo, TipoCombustible, Propietario,
    EstadoVehiculo, TipoTransporte
)


@dataclass
class Vehiculo:
    id:                Optional[int]   = None
    placa:             str             = ''
    tipo:              TipoVehiculo    = TipoVehiculo.BUS
    marca:             str             = ''
    modelo:            str             = ''
    anio:              int             = 0
    color:             str             = ''
    numero_interno:    str             = ''
    capacidad:         int             = 0
    rendimiento_kmgal: float           = 8.0
    tipo_combustible:  TipoCombustible = TipoCombustible.DIESEL
    propietario:       Propietario     = Propietario.INSTITUCIONAL
    estado_tecnico:    EstadoVehiculo  = EstadoVehiculo.DISPONIBLE
    foto_url:          str             = ''
    notas:             str             = ''
    created_at:        Optional[object] = field(default=None, repr=False)
    updated_at:        Optional[object] = field(default=None, repr=False)

    @property
    def esta_disponible(self) -> bool:
        return self.estado_tecnico == EstadoVehiculo.DISPONIBLE


@dataclass
class Asignacion:
    id:              Optional[int]    = None
    salida_id:       Optional[int]    = None
    vehiculo_id:     Optional[int]    = None
    conductor_id:    Optional[int]    = None
    tipo_transporte: TipoTransporte   = TipoTransporte.PROPIO
    empresa_externa: str              = ''
    confirmado_en:   Optional[object] = field(default=None, repr=False)
    created_at:      Optional[object] = field(default=None, repr=False)
