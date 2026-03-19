# aplicacion/novedades/casos_uso.py
# ─────────────────────────────────────────────────────────────────────────────
# CASOS DE USO: Novedades del viaje
# Cubre HU-COND-004 (registrar) + HU-CSAL-005 (monitorear + resolver)
# ─────────────────────────────────────────────────────────────────────────────

from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional

from dominio.novedades.entidades import Novedad, TipoNovedad, Urgencia


# ── Puerto de Salida ──────────────────────────────────────────────────────────

class INovedadRepositorio(ABC):
    @abstractmethod
    def guardar(self, novedad: Novedad) -> Novedad: ...
    @abstractmethod
    def obtener(self, novedad_id: int) -> Novedad: ...
    @abstractmethod
    def listar_por_salida(self, salida_id: int) -> list[Novedad]: ...


# ── Caso de Uso 1: Conductor registra una novedad ─────────────────────────────

@dataclass
class RegistrarNovedadComando:
    salida_id:        int
    reportado_por_id: int
    tipo:             TipoNovedad
    urgencia:         Urgencia
    descripcion:      str
    latitud:          Optional[float] = None
    longitud:         Optional[float] = None


class RegistrarNovedadCasoUso:
    """
    El conductor registra un incidente durante la ejecución de la salida.
    La novedad nace en estado ABIERTA y se escala si es CRÍTICA.
    """
    def __init__(self, repositorio: INovedadRepositorio):
        self._repo = repositorio

    def ejecutar(self, cmd: RegistrarNovedadComando) -> Novedad:
        nueva = Novedad(
            salida_id=        cmd.salida_id,
            reportado_por_id= cmd.reportado_por_id,
            tipo=             cmd.tipo,
            urgencia=         cmd.urgencia,
            descripcion=      cmd.descripcion,
            latitud=          cmd.latitud,
            longitud=         cmd.longitud,
            registrado_en=    datetime.now(tz=timezone.utc),
        )
        return self._repo.guardar(nueva)


# ── Caso de Uso 2: Coordinador resuelve una novedad ───────────────────────────

class ResolverNovedadCasoUso:
    """El Coordinador de Salidas marca una novedad como RESUELTA."""
    def __init__(self, repositorio: INovedadRepositorio):
        self._repo = repositorio

    def ejecutar(self, novedad_id: int) -> Novedad:
        novedad = self._repo.obtener(novedad_id)
        novedad.resolver(datetime.now(tz=timezone.utc))  # Valida estado en la entidad
        return self._repo.guardar(novedad)


# ── Caso de Uso 3: Listar novedades de una salida ────────────────────────────

class ListarNovedadesCasoUso:
    def __init__(self, repositorio: INovedadRepositorio):
        self._repo = repositorio

    def ejecutar(self, salida_id: int) -> dict:
        todas    = self._repo.listar_por_salida(salida_id)
        criticas = [n for n in todas if n.es_critica]
        abiertas = [n for n in todas if n.estado.value == 'abierta']
        return {
            'novedades': todas,
            'total':     len(todas),
            'criticas':  len(criticas),
            'abiertas':  len(abiertas),
        }
