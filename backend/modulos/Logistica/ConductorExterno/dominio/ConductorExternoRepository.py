import abc
from typing import List, Optional
from .ConductorExterno import ConductorExterno


class ConductorExternoRepository(abc.ABC):

    @abc.abstractmethod
    def save(self, conductor: ConductorExterno) -> ConductorExterno:
        pass

    @abc.abstractmethod
    def get_all_by_empresa(self, empresa_id: int) -> List[ConductorExterno]:
        pass

    @abc.abstractmethod
    def get_by_id(self, conductor_id: int) -> Optional[ConductorExterno]:
        pass

    @abc.abstractmethod
    def update(self, conductor: 'ConductorExterno') -> 'ConductorExterno':
        pass

    @abc.abstractmethod
    def delete(self, conductor_id: int) -> None:
        pass
