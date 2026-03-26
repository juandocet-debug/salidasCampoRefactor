from abc import ABC, abstractmethod
from typing import List, Optional
from .Parada import Parada
from .ParadaId import ParadaId

class ParadaRepository(ABC):
    @abstractmethod
    def save(self, parada: Parada) -> Parada:
        pass

    @abstractmethod
    def get_by_id(self, id: ParadaId) -> Optional[Parada]:
        pass

    @abstractmethod
    def get_by_itinerario(self, itinerario_id: int) -> List[Parada]:
        pass

    @abstractmethod
    def delete(self, id: ParadaId) -> None:
        pass
