from abc import ABC, abstractmethod
from typing import Optional
from .RevisionPedagogica import RevisionPedagogica
from modulos.Salidas.Core.dominio.SalidaId import SalidaId

class RevisionPedagogicaRepository(ABC):
    @abstractmethod
    def guardar(self, revision: RevisionPedagogica) -> RevisionPedagogica:
        pass

    @abstractmethod
    def obtener_por_salida(self, salida_id: SalidaId) -> Optional[RevisionPedagogica]:
        pass
