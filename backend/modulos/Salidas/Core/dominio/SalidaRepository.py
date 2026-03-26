import abc
from typing import List, Optional
from modulos.Salidas.Core.dominio.Salida import Salida

class SalidaRepository(abc.ABC):
    @abc.abstractmethod
    def save(self, salida: Salida) -> Salida:
        pass

    @abc.abstractmethod
    def get_by_id(self, id_salida: int) -> Optional[Salida]:
        pass

    @abc.abstractmethod
    def get_all(self) -> List[Salida]:
        pass

    @abc.abstractmethod
    def delete(self, id_salida: int) -> None:
        pass
