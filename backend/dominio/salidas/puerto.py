# CAPA: Dominio
# QUÉ HACE: Define el contrato (interfaz) que cualquier repositorio de Salidas debe cumplir
# NO DEBE CONTENER: imports de Django, ORM, implementaciones concretas

from abc import ABC, abstractmethod
from typing import List, Optional

from dominio.salidas.entidad import Salida


class ISalidaRepositorio(ABC):

    @abstractmethod
    def listar_por_profesor(self, profesor_id: int) -> List[Salida]:
        pass

    @abstractmethod
    def obtener_por_id(self, salida_id: int) -> Optional[Salida]:
        pass

    @abstractmethod
    def crear(self, salida: Salida) -> Salida:
        pass

    @abstractmethod
    def actualizar(self, salida: Salida) -> Salida:
        pass

    @abstractmethod
    def eliminar(self, salida_id: int) -> None:
        pass

    @abstractmethod
    def guardar(self, salida: Salida) -> Salida:
        pass

    @abstractmethod
    def listar_activas(self) -> List[Salida]:
        pass
