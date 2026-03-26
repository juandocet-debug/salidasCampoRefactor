import abc
from typing import List, Optional
from modulos.Salidas.Planeacion.dominio.Planeacion import Planeacion

class PlaneacionRepository(abc.ABC):
    @abc.abstractmethod
    def save(self, planeacion: Planeacion) -> Planeacion:
        pass

    @abc.abstractmethod
    def get_by_id(self, id_planeacion: int) -> Optional[Planeacion]:
        pass

    @abc.abstractmethod
    def get_all(self) -> List[Planeacion]:
        pass

    @abc.abstractmethod
    def delete(self, id_planeacion: int) -> None:
        pass
