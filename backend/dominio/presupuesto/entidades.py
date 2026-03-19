# dominio/presupuesto/entidades.py  (~110 líneas)
# ⚠️  Python puro — cero Django.

from __future__ import annotations
from dataclasses import dataclass, field
from datetime import date
from enum import Enum
from typing import Optional


class CategoriaGasto(str, Enum):
    COMBUSTIBLE  = 'combustible'
    HOSPEDAJE    = 'hospedaje'
    ALIMENTACION = 'alimentacion'
    ENTRADA      = 'entrada'
    OTRO         = 'otro'


class PresupuestoExcedido(Exception):
    """Se intentó registrar un gasto que supera el presupuesto disponible."""
    def __init__(self, disponible: float, monto: float):
        super().__init__(
            f'Saldo insuficiente. Disponible: ${disponible:,.0f} — Gasto: ${monto:,.0f}'
        )


@dataclass
class Gasto:
    """Registro de un gasto individual dentro del presupuesto de una salida."""
    id:              Optional[int]        = None
    presupuesto_id:  Optional[int]        = None
    categoria:       Optional[CategoriaGasto] = None
    descripcion:     str                  = ''
    monto:           float                = 0.0
    fecha:           Optional[date]       = None
    registrado_por_id: Optional[int]      = None


@dataclass
class Presupuesto:
    """
    Presupuesto asignado a una salida (relación 1:1).
    Regla de dominio: no se puede registrar un gasto que supere el disponible.
    """
    id:             Optional[int]   = None
    salida_id:      Optional[int]   = None
    total_asignado: float           = 0.0
    ejecutado:      float           = 0.0
    gastos:         list[Gasto]     = field(default_factory=list)

    # ── Comportamiento ────────────────────────────────────────────────────

    def registrar_gasto(self, gasto: Gasto) -> None:
        """
        Agrega un gasto al presupuesto.
        Valida que no se exceda el total asignado.
        """
        if gasto.monto > self.disponible:
            raise PresupuestoExcedido(self.disponible, gasto.monto)
        self.gastos.append(gasto)
        self.ejecutado += gasto.monto

    def recalcular_ejecutado(self) -> None:
        """Recalcula el total ejecutado desde la lista de gastos (para consistencia)."""
        self.ejecutado = sum(g.monto for g in self.gastos)

    # ── Propiedades derivadas ─────────────────────────────────────────────

    @property
    def disponible(self) -> float:
        return self.total_asignado - self.ejecutado

    @property
    def porcentaje_ejecutado(self) -> float:
        if self.total_asignado == 0:
            return 0.0
        return round((self.ejecutado / self.total_asignado) * 100, 1)

    @property
    def esta_en_alerta(self) -> bool:
        """True si ya se ejecutó más del 80% del presupuesto."""
        return self.porcentaje_ejecutado >= 80.0
