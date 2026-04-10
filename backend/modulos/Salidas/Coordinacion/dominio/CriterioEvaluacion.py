from dataclasses import dataclass
from enum import Enum
from typing import Optional

class EstadoCriterio(Enum):
    CUMPLE = "CUMPLE"
    PARCIAL = "PARCIAL"
    NO_CUMPLE = "NO_CUMPLE"
    PENDIENTE = "PENDIENTE"

@dataclass(frozen=True)
class CriterioEvaluacion:
    estado: EstadoCriterio
    observacion: Optional[str] = None
