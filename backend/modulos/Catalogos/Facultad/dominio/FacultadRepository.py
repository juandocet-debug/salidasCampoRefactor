from abc import ABC, abstractmethod
from typing import List, Optional
from .Facultad import Facultad
from .FacultadId import FacultadId

class FacultadRepository(ABC):
    @abstractmethod
    def save(self, facultad: Facultad) -> None:
        pass
    
    @abstractmethod
    def get_all(self) -> List[Facultad]:
        pass

    @abstractmethod
    def get_by_id(self, id: FacultadId) -> Optional[Facultad]:
        pass

    @abstractmethod
    def delete(self, id: FacultadId) -> None:
        pass
