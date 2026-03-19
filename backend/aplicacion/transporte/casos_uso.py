# aplicacion/transporte/casos_uso.py  (~130 líneas)
# ⚠️  Cero Django.

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional

from dominio.transporte.entidades import Asignacion
from dominio.transporte.valor_objetos import TipoTransporte
from .puertos import IVehiculoRepositorio, IAsignacionRepositorio


# ── CU 1: Listar vehículos disponibles ───────────────────────────────────────

class ListarVehiculosDisponiblesCasoUso:
    """
    El Coordinador de Salidas consulta qué vehículos puede asignar.
    Solo devuelve los que están en estado DISPONIBLE.
    """
    def __init__(self, repo: IVehiculoRepositorio):
        self._repo = repo

    def ejecutar(self) -> list:
        return self._repo.listar_disponibles()


# ── CU 2: Asignar vehículo a una salida ───────────────────────────────────────

@dataclass
class AsignarVehiculoComando:
    salida_id:       int
    vehiculo_id:     Optional[int]     # None si es empresa externa
    conductor_id:    Optional[int]
    tipo_transporte: TipoTransporte
    num_estudiantes: int               # Para validar la capacidad
    empresa_externa: str = ''


class AsignarVehiculoCasoUso:
    """
    CS asigna un vehículo (propio o empresa externa) a una salida aprobada.

    Validaciones de dominio:
    - Si es propio: el vehículo debe estar DISPONIBLE.
    - Si es propio: la capacidad debe ser >= num_estudiantes.
    """
    def __init__(
        self,
        repo_vehiculo: IVehiculoRepositorio,
        repo_asignacion: IAsignacionRepositorio,
    ):
        self._repo_v = repo_vehiculo
        self._repo_a = repo_asignacion

    def ejecutar(self, cmd: AsignarVehiculoComando) -> Asignacion:
        if cmd.tipo_transporte == TipoTransporte.PROPIO and cmd.vehiculo_id:
            vehiculo = self._repo_v.obtener(cmd.vehiculo_id)
            vehiculo.validar_disponibilidad()          # lanza VehiculoNoDisponible
            vehiculo.validar_capacidad(cmd.num_estudiantes)  # lanza CapacidadInsuficiente

        nueva = Asignacion(
            salida_id=       cmd.salida_id,
            vehiculo_id=     cmd.vehiculo_id,
            conductor_id=    cmd.conductor_id,
            tipo_transporte= cmd.tipo_transporte,
            empresa_externa= cmd.empresa_externa,
        )
        return self._repo_a.guardar(nueva)


# ── CU 3: Confirmar asignación ────────────────────────────────────────────────

class ConfirmarAsignacionCasoUso:
    """El conductor acepta la asignación antes de la salida."""
    def __init__(self, repo: IAsignacionRepositorio):
        self._repo = repo

    def ejecutar(self, asignacion_id: int) -> Asignacion:
        asignacion = self._repo.obtener(asignacion_id)
        asignacion.confirmar(datetime.now(tz=timezone.utc))
        return self._repo.guardar(asignacion)
