from abc import ABC, abstractmethod
from typing import List, Optional
from .Materia import Materia
from .MateriaId import MateriaId

class MateriaRepository(ABC):
    @abstractmethod
    def save(self, materia: Materia) -> None:
        pass

    @abstractmethod
    def get_by_id(self, id: MateriaId) -> Optional[Materia]:
        pass

    @abstractmethod
    def get_all(self) -> List[Materia]:
        pass

    @abstractmethod
    def get_by_programa_id(self, programa_id: int) -> List[Materia]:
        """Retorna todas las materias vinculadas a un programa."""
        pass

    @abstractmethod
    def delete(self, id: MateriaId) -> None:
        pass
