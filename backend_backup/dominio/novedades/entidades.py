# dominio/novedades/entidades.py
# ⚠️  Python puro — cero Django.

from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Optional


class TipoNovedad(str, Enum):
    MECANICA  = 'mecanica'
    ACCIDENTE = 'accidente'
    CLIMA     = 'clima'
    VIAL      = 'vial'
    SALUD     = 'salud'
    OTRO      = 'otro'


class Urgencia(str, Enum):
    BAJA    = 'baja'
    MEDIA   = 'media'
    ALTA    = 'alta'
    CRITICA = 'critica'


class EstadoNovedad(str, Enum):
    ABIERTA  = 'abierta'
    RESUELTA = 'resuelta'


@dataclass
class Novedad:
    """
    Incidente reportado por el conductor durante la ejecución de una salida.
    Regla de negocio: solo puede resolverse si está ABIERTA.
    """
    id:           Optional[int]      = None
    salida_id:    Optional[int]      = None
    tipo:         Optional[TipoNovedad]  = None
    urgencia:     Optional[Urgencia]     = None
    descripcion:  str                = ''
    estado:       EstadoNovedad      = EstadoNovedad.ABIERTA

    # GPS (capturado automáticamente en el dispositivo del conductor)
    latitud:  Optional[float] = None
    longitud: Optional[float] = None

    reportado_por_id: Optional[int]      = None
    registrado_en:    Optional[datetime] = None
    resuelto_en:      Optional[datetime] = None

    # ── Comportamiento de negocio ─────────────────────────────────────────

    def resolver(self, ahora: datetime) -> None:
        """Marca la novedad como resuelta. Solo desde estado ABIERTA."""
        if self.estado != EstadoNovedad.ABIERTA:
            raise ValueError(f'La novedad ya está {self.estado} — no se puede resolver.')
        self.estado     = EstadoNovedad.RESUELTA
        self.resuelto_en = ahora

    @property
    def es_critica(self) -> bool:
        return self.urgencia == Urgencia.CRITICA

    @property
    def tiene_ubicacion(self) -> bool:
        return self.latitud is not None and self.longitud is not None
