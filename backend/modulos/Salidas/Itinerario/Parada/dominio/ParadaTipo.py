from dataclasses import dataclass
from enum import Enum

class TipoParadaEnum(Enum):
    HOSPEDAJE = "hospedaje"
    ALIMENTACION = "alimentacion"
    TRABAJO_CAMPO = "trabajo_campo"
    MIXTO = "mixto"
    RETORNO = "retorno"
    VIAJE = "viaje"

@dataclass(frozen=True)
class ParadaTipo:
    value: str

    def __post_init__(self):
        valid_types = [t.value for t in TipoParadaEnum]
        if self.value not in valid_types:
            # Tolerancia para compatibilidad, forzar un valor default
            object.__setattr__(self, 'value', TipoParadaEnum.TRABAJO_CAMPO.value)
