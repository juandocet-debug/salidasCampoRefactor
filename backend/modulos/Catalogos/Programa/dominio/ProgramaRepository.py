from abc import ABC, abstractmethod
from typing import List, Optional
from .Programa import Programa
from .ProgramaId import ProgramaId

class ProgramaRepository(ABC):
    @abstractmethod
    def save(self, programa: Programa) -> None:
        pass

    @abstractmethod
    def get_by_id(self, id: ProgramaId) -> Optional[Programa]:
        pass

    @abstractmethod
    def get_all(self) -> List[Programa]:
        pass

    @abstractmethod
    def delete(self, id: ProgramaId) -> None:
        pass
