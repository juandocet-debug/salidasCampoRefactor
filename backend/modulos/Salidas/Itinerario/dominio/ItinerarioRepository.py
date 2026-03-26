import abc
from typing import List, Optional
from modulos.Salidas.Itinerario.dominio.Itinerario import Itinerario
from modulos.Salidas.Itinerario.dominio.PuntoParada import PuntoParada

class ItinerarioRepository(abc.ABC):
    @abc.abstractmethod
    def save(self, itinerario: Itinerario) -> Itinerario:
        pass

    @abc.abstractmethod
    def get_by_id(self, id_itinerario: int) -> Optional[Itinerario]:
        pass

    @abc.abstractmethod
    def get_all(self) -> List[Itinerario]:
        pass

    @abc.abstractmethod
    def delete(self, id_itinerario: int) -> None:
        pass

    @abc.abstractmethod
    def save_punto_parada(self, punto: PuntoParada) -> PuntoParada:
        pass

    @abc.abstractmethod
    def get_puntos_by_itinerario(self, itinerario_id: int) -> List[PuntoParada]:
        pass
