import abc
from typing import List, Optional
from .Ventana import Ventana
from .VentanaId import VentanaId

class VentanaRepository(abc.ABC):
    @abc.abstractmethod
    def save(self, ventana: Ventana) -> None:
        pass

    @abc.abstractmethod
    def get_all(self) -> List[Ventana]:
        pass

    @abc.abstractmethod
    def get_by_id(self, id: VentanaId) -> Optional[Ventana]:
        pass

    @abc.abstractmethod
    def delete(self, id: VentanaId) -> None:
        pass
