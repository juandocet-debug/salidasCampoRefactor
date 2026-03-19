# aplicacion/checklist/casos_uso.py
# ─────────────────────────────────────────────────────────────────────────────
# CASOS DE USO: Checklist del vehículo
# Cubre HU-COND-003 (completar inspección pre-viaje)
# ─────────────────────────────────────────────────────────────────────────────

from abc import ABC, abstractmethod
from dataclasses import dataclass

from dominio.checklist.entidades import Checklist, ItemChecklist, EstadoItem


# ── Puerto de Salida ──────────────────────────────────────────────────────────

class IChecklistRepositorio(ABC):
    @abstractmethod
    def guardar_item(self, item: ItemChecklist) -> ItemChecklist: ...
    @abstractmethod
    def obtener_checklist(self, asignacion_id: int) -> Checklist: ...
    @abstractmethod
    def crear_checklist_inicial(self, asignacion_id: int) -> Checklist: ...


# ── Caso de Uso 1: Conductor marca un ítem ────────────────────────────────────

@dataclass
class MarcarItemComando:
    asignacion_id: int
    item_id:       int
    nuevo_estado:  EstadoItem
    observacion:   str = ''


class MarcarItemCasoUso:
    """El conductor marca un ítem: OK / NO OK / N/A."""
    def __init__(self, repositorio: IChecklistRepositorio):
        self._repo = repositorio

    def ejecutar(self, cmd: MarcarItemComando) -> Checklist:
        checklist = self._repo.obtener_checklist(cmd.asignacion_id)

        # Busca el ítem dentro del agregado y lo marca
        for item in checklist.items:
            if item.id == cmd.item_id:
                item.marcar(cmd.nuevo_estado, cmd.observacion)
                self._repo.guardar_item(item)
                break

        return checklist


# ── Caso de Uso 2: Consultar progreso del checklist ──────────────────────────

class ConsultarChecklistCasoUso:
    """
    Retorna el checklist completo con estadísticas de progreso.
    La UI usa esto para la barra de progreso y el botón "Iniciar Viaje".
    """
    def __init__(self, repositorio: IChecklistRepositorio):
        self._repo = repositorio

    def ejecutar(self, asignacion_id: int) -> dict:
        checklist = self._repo.obtener_checklist(asignacion_id)
        return {
            'puede_iniciar':  checklist.puede_iniciar_viaje(),   # RF-010.7
            'progreso':       checklist.progreso,
            'items_no_ok':    checklist.items_no_ok(),
            'items':          checklist.items,
        }
