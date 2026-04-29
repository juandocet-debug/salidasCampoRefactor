import abc
from typing import List, Optional
from .EmpresaTransporte import EmpresaTransporte


class EmpresaTransporteRepository(abc.ABC):

    @abc.abstractmethod
    def save(self, empresa: EmpresaTransporte) -> EmpresaTransporte:
        pass

    @abc.abstractmethod
    def get_all(self) -> List[EmpresaTransporte]:
        pass

    @abc.abstractmethod
    def get_by_id(self, empresa_id: int) -> Optional[EmpresaTransporte]:
        pass

    @abc.abstractmethod
    def update(self, empresa: 'EmpresaTransporte') -> 'EmpresaTransporte':
        pass

    @abc.abstractmethod
    def delete(self, empresa_id: int) -> None:
        pass
