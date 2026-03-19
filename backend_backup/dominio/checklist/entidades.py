# dominio/checklist/entidades.py
# ⚠️  Python puro — cero Django.

from __future__ import annotations
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional


class CategoriaChecklist(str, Enum):
    MECANICA   = 'mecanica'
    SEGURIDAD  = 'seguridad'
    DOCUMENTOS = 'documentos'
    CONFORT    = 'confort'


class EstadoItem(str, Enum):
    OK       = 'ok'
    NO_OK    = 'no_ok'
    NA       = 'na'
    PENDIENTE = 'pendiente'


# Los 18 ítems predeterminados — la única fuente de verdad del checklist
ITEMS_PREDETERMINADOS: list[tuple[CategoriaChecklist, str]] = [
    (CategoriaChecklist.MECANICA,   'Nivel de aceite del motor'),
    (CategoriaChecklist.MECANICA,   'Nivel de agua del radiador'),
    (CategoriaChecklist.MECANICA,   'Presión de llantas (incluida la de repuesto)'),
    (CategoriaChecklist.MECANICA,   'Frenos (pedal y de mano)'),
    (CategoriaChecklist.MECANICA,   'Luces delanteras y traseras'),
    (CategoriaChecklist.MECANICA,   'Dirección sin vibraciones'),
    (CategoriaChecklist.SEGURIDAD,  'Extintor vigente y cargado'),
    (CategoriaChecklist.SEGURIDAD,  'Botiquín de primeros auxilios completo'),
    (CategoriaChecklist.SEGURIDAD,  'Triángulos de señalización'),
    (CategoriaChecklist.SEGURIDAD,  'Cinturones de seguridad en buen estado'),
    (CategoriaChecklist.SEGURIDAD,  'Puertas de emergencia operativas'),
    (CategoriaChecklist.DOCUMENTOS, 'Licencia de conducción vigente'),
    (CategoriaChecklist.DOCUMENTOS, 'SOAT vigente'),
    (CategoriaChecklist.DOCUMENTOS, 'Revisión técnico-mecánica vigente'),
    (CategoriaChecklist.DOCUMENTOS, 'Tarjeta de propiedad'),
    (CategoriaChecklist.CONFORT,    'Aire acondicionado funcionando'),
    (CategoriaChecklist.CONFORT,    'Limpieza general del vehículo'),
    (CategoriaChecklist.CONFORT,    'Asientos sin daños'),
]


@dataclass
class ItemChecklist:
    """Un ítem individual del checklist de inspección del vehículo."""
    id:           Optional[int]            = None
    asignacion_id: Optional[int]           = None
    categoria:    Optional[CategoriaChecklist] = None
    item:         str                      = ''
    estado:       EstadoItem              = EstadoItem.PENDIENTE
    observacion:  str                     = ''
    evidencia_url: str                    = ''

    def marcar(self, nuevo_estado: EstadoItem, observacion: str = '') -> None:
        """El conductor marca el ítem. Solo admite estados válidos del enum."""
        self.estado      = nuevo_estado
        self.observacion = observacion


@dataclass
class Checklist:
    """
    Agregado que representa la inspección completa del vehículo para una asignación.

    Regla crítica (RF-010.7): No se puede iniciar viaje sin 100% completado.
    'Completado' significa: ningún ítem en estado PENDIENTE.
    """
    asignacion_id: Optional[int]    = None
    items:         list[ItemChecklist] = field(default_factory=list)

    # ── Comportamiento ────────────────────────────────────────────────────

    def puede_iniciar_viaje(self) -> bool:
        """True si no hay ningún ítem PENDIENTE."""
        return all(i.estado != EstadoItem.PENDIENTE for i in self.items)

    def items_no_ok(self) -> list[ItemChecklist]:
        """Ítems marcados como NO OK (para resaltar en la UI)."""
        return [i for i in self.items if i.estado == EstadoItem.NO_OK]

    @property
    def progreso(self) -> dict:
        """Estadísticas para la barra de progreso de la UI."""
        total     = len(self.items)
        pendientes = sum(1 for i in self.items if i.estado == EstadoItem.PENDIENTE)
        completados = total - pendientes
        return {
            'total':       total,
            'completados': completados,
            'pendientes':  pendientes,
            'porcentaje':  round(completados / total * 100, 1) if total else 0,
        }

    @classmethod
    def nuevo_para_asignacion(cls, asignacion_id: int) -> 'Checklist':
        """
        Crea un Checklist con los 18 ítems predeterminados en estado PENDIENTE.
        Se llama al crear una nueva asignación de transporte.
        """
        items = [
            ItemChecklist(asignacion_id=asignacion_id, categoria=cat, item=desc)
            for cat, desc in ITEMS_PREDETERMINADOS
        ]
        return cls(asignacion_id=asignacion_id, items=items)
