# backend/modulos/Salidas/Consejo/dominio/DecisionConsejo.py
from dataclasses import dataclass
from datetime import datetime, date
from typing import Optional

@dataclass
class DecisionConsejo:
    """Entidad pura que representa la decisión/resolución emitida por el Consejo/Decanatura."""
    salida_id: int
    concejal_id: int
    concepto_financiero: str  # e.g., 'aprobado', 'rechazado', 'ajustes'
    observaciones: Optional[str] = None
    acta: Optional[str] = None
    fecha_acta: Optional[date] = None
    fecha_decision: Optional[datetime] = None

    def __post_init__(self):
        if self.fecha_decision is None:
            self.fecha_decision = datetime.now()

    def es_aprobada(self) -> bool:
        return self.concepto_financiero.lower() == 'aprobado'
