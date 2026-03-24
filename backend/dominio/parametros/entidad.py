# CAPA: Dominio
# QUÉ HACE: Entidad ParametrosSistema — singleton con valores de costo
# NO DEBE CONTENER: Django, ORM, lógica de vistas

from dataclasses import dataclass
from typing import Optional
from datetime import date


@dataclass
class ParametrosSistema:
    id:                    int   = 1
    precio_galon:          float = 0.0
    rendimiento_bus:       float = 0.0
    rendimiento_buseta:    float = 0.0
    rendimiento_camioneta: float = 0.0
    costo_noche:           float = 0.0
    costo_hora_extra:      float = 11000.0
    costo_hora_extra_2:    float = 15000.0
    max_horas_viaje:       float = 10.0
    horas_buffer:          float = 1.0


@dataclass
class Facultad:
    id:     Optional[int] = None
    nombre: str           = ''
    activa: bool          = True


@dataclass
class Programa:
    id:          Optional[int] = None
    nombre:      str           = ''
    facultad_id: Optional[int] = None
    activo:      bool          = True


@dataclass
class Ventana:
    id:             Optional[int]  = None
    nombre:         str            = ''
    fecha_apertura: Optional[date] = None
    fecha_cierre:   Optional[date] = None
    activa:         bool           = True
