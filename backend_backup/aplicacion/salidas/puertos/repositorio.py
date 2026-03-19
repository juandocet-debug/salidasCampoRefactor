# aplicacion/salidas/puertos/repositorio.py
# ─────────────────────────────────────────────────────────────────────────────
# PUERTO DE SALIDA — ISalidaRepositorio
#
# Esta es la interfaz (contrato) que define CÓMO la capa de aplicación
# necesita acceder a la persistencia. NO sabe si hay Django, PostgreSQL,
# MongoDB, o un dict en memoria — eso lo decide la infraestructura.
#
# ⚠️  CERO imports de Django aquí.
# ─────────────────────────────────────────────────────────────────────────────

from abc import ABC, abstractmethod
from typing import Optional

from dominio.salidas.entidades import Salida
from dominio.salidas.valor_objetos import EstadoSalida


class ISalidaRepositorio(ABC):
    """
    Contrato que debe cumplir cualquier implementación de persistencia
    para el slice de Salidas.

    La infraestructura lo implementará con Django ORM.
    Los tests lo implementarán con un dict en memoria (FakeSalidaRepositorio).
    """

    @abstractmethod
    def guardar(self, salida: Salida) -> Salida:
        """Persiste una salida (INSERT o UPDATE). Retorna la entidad con ID asignado."""
        ...

    @abstractmethod
    def obtener_por_id(self, salida_id: int) -> Salida:
        """
        Retorna la Salida con ese ID.
        Lanza SalidaNoEncontrada si no existe.
        """
        ...

    @abstractmethod
    def obtener_por_codigo(self, codigo: str) -> Salida:
        """
        Retorna la Salida con ese código (ej: 'SAL-2026-001').
        Lanza SalidaNoEncontrada si no existe.
        """
        ...

    @abstractmethod
    def listar_por_profesor(self, profesor_id: int) -> list[Salida]:
        """Retorna todas las salidas de un profesor, ordenadas por fecha desc."""
        ...

    @abstractmethod
    def listar_por_estado(self, estado: EstadoSalida) -> list[Salida]:
        """Retorna todas las salidas en un estado dado (útil para dashboards de roles)."""
        ...

    @abstractmethod
    def listar_activas(self) -> list[Salida]:
        """Retorna todas las salidas que no están cerradas, canceladas o rechazadas."""
        ...
