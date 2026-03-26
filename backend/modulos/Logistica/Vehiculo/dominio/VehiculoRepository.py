import abc
from typing import List, Optional
from .Vehiculo import Vehiculo
from .VehiculoId import VehiculoId

class VehiculoRepository(abc.ABC):

    @abc.abstractmethod
    def save(self, vehiculo: Vehiculo) -> Vehiculo:
        pass

    @abc.abstractmethod
    def get_all(self, filtros: dict = None) -> List[Vehiculo]:
        pass

    @abc.abstractmethod
    def get_by_id(self, vehiculo_id: VehiculoId) -> Optional[Vehiculo]:
        pass

    @abc.abstractmethod
    def delete(self, vehiculo_id: VehiculoId) -> None:
        pass
