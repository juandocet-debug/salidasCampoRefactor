# CAPA: Dominio
# QUÉ HACE: Contratos de repositorios de transporte
# NO DEBE CONTENER: Django, ORM

from abc import ABC, abstractmethod
from typing import List, Optional
from dominio.transporte.entidad import Vehiculo, Asignacion


class IVehiculoRepositorio(ABC):

    @abstractmethod
    def listar(self) -> List[Vehiculo]:
        pass

    @abstractmethod
    def listar_disponibles(self) -> List[Vehiculo]:
        pass

    @abstractmethod
    def obtener_por_id(self, vehiculo_id: int) -> Optional[Vehiculo]:
        pass

    @abstractmethod
    def crear(self, vehiculo: Vehiculo) -> Vehiculo:
        pass

    @abstractmethod
    def actualizar(self, vehiculo: Vehiculo) -> Vehiculo:
        pass

    @abstractmethod
    def eliminar(self, vehiculo_id: int) -> None:
        pass


class IAsignacionRepositorio(ABC):

    @abstractmethod
    def obtener_por_salida(self, salida_id: int) -> Optional[Asignacion]:
        pass

    @abstractmethod
    def crear(self, asignacion: Asignacion) -> Asignacion:
        pass

    @abstractmethod
    def actualizar(self, asignacion: Asignacion) -> Asignacion:
        pass
