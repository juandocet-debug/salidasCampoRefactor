# aplicacion/transporte/puertos.py  (~55 líneas)
# ⚠️  Cero Django.

from abc import ABC, abstractmethod
from dominio.transporte.entidades import Vehiculo, Asignacion


class IVehiculoRepositorio(ABC):
    @abstractmethod
    def guardar(self, vehiculo: Vehiculo) -> Vehiculo: ...
    @abstractmethod
    def obtener(self, vehiculo_id: int) -> Vehiculo: ...
    @abstractmethod
    def listar_disponibles(self) -> list[Vehiculo]: ...
    @abstractmethod
    def listar_todos(self) -> list[Vehiculo]: ...


class IAsignacionRepositorio(ABC):
    @abstractmethod
    def guardar(self, asignacion: Asignacion) -> Asignacion: ...
    @abstractmethod
    def obtener(self, asignacion_id: int) -> Asignacion: ...
    @abstractmethod
    def listar_por_salida(self, salida_id: int) -> list[Asignacion]: ...
