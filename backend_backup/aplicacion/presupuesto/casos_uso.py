# aplicacion/presupuesto/casos_uso.py  (~140 líneas)
# ⚠️  Cero Django.

from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import date
from typing import Optional

from dominio.presupuesto.entidades import Presupuesto, Gasto, CategoriaGasto


# ── Puerto de Salida ──────────────────────────────────────────────────────────

class IPresupuestoRepositorio(ABC):
    @abstractmethod
    def guardar(self, presupuesto: Presupuesto) -> Presupuesto: ...
    @abstractmethod
    def obtener_por_salida(self, salida_id: int) -> Presupuesto: ...
    @abstractmethod
    def guardar_gasto(self, gasto: Gasto) -> Gasto: ...


# ── CU 1: Asignar presupuesto a una salida ───────────────────────────────────

@dataclass
class AsignarPresupuestoComando:
    salida_id:      int
    total_asignado: float


class AsignarPresupuestoCasoUso:
    """
    El Coordinador de Salidas fija el monto total para una salida aprobada.
    Si ya existe presupuesto lo actualiza; si no, creo uno nuevo.
    """
    def __init__(self, repo: IPresupuestoRepositorio):
        self._repo = repo

    def ejecutar(self, cmd: AsignarPresupuestoComando) -> Presupuesto:
        try:
            presupuesto = self._repo.obtener_por_salida(cmd.salida_id)
            presupuesto.total_asignado = cmd.total_asignado
        except Exception:
            presupuesto = Presupuesto(
                salida_id=      cmd.salida_id,
                total_asignado= cmd.total_asignado,
            )
        return self._repo.guardar(presupuesto)


# ── CU 2: Registrar gasto ────────────────────────────────────────────────────

@dataclass
class RegistrarGastoComando:
    salida_id:        int
    categoria:        CategoriaGasto
    descripcion:      str
    monto:            float
    registrado_por_id: int
    fecha:            Optional[date] = None


class RegistrarGastoCasoUso:
    """
    El Coordinador o Conductor registra un gasto real durante la salida.

    Regla de dominio (en Presupuesto.registrar_gasto):
    - No se puede registrar un gasto que supere el saldo disponible.
    """
    def __init__(self, repo: IPresupuestoRepositorio):
        self._repo = repo

    def ejecutar(self, cmd: RegistrarGastoComando) -> Presupuesto:
        presupuesto = self._repo.obtener_por_salida(cmd.salida_id)
        nuevo_gasto = Gasto(
            presupuesto_id=   presupuesto.id,
            categoria=        cmd.categoria,
            descripcion=      cmd.descripcion,
            monto=            cmd.monto,
            fecha=            cmd.fecha or date.today(),
            registrado_por_id=cmd.registrado_por_id,
        )
        presupuesto.registrar_gasto(nuevo_gasto)  # Valida excedente → lanza PresupuestoExcedido
        gasto_guardado    = self._repo.guardar_gasto(nuevo_gasto)
        nuevo_gasto.id    = gasto_guardado.id
        return self._repo.guardar(presupuesto)


# ── CU 3: Consultar resumen del presupuesto ───────────────────────────────────

class ConsultarPresupuestoCasoUso:
    """
    Vista de resumen financiero de una salida:
    saldo disponible, % ejecutado, alerta de sobre-ejecución.
    """
    def __init__(self, repo: IPresupuestoRepositorio):
        self._repo = repo

    def ejecutar(self, salida_id: int) -> dict:
        p = self._repo.obtener_por_salida(salida_id)
        return {
            'total_asignado':    p.total_asignado,
            'ejecutado':         p.ejecutado,
            'disponible':        p.disponible,
            'porcentaje':        p.porcentaje_ejecutado,
            'en_alerta':         p.esta_en_alerta,
            'num_gastos':        len(p.gastos),
        }
