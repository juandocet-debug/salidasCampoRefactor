import abc
from typing import List, Optional
from .Parametro import Parametro
from .ParametroId import ParametroId

class ParametroRepository(abc.ABC):
    @abc.abstractmethod
    def save(self, parametro: Parametro) -> Parametro:
        pass

    @abc.abstractmethod
    def get_all(self, filtros: dict = None) -> List[Parametro]:
        pass

    @abc.abstractmethod
    def get_by_id(self, parametro_id: ParametroId) -> Optional[Parametro]:
        pass

    @abc.abstractmethod
    def delete(self, parametro_id: ParametroId) -> None:
        pass
