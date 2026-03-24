# CAPA: Dominio
# QUÉ HACE: Contratos de repositorios de parámetros y catálogos
# NO DEBE CONTENER: Django, ORM

from abc import ABC, abstractmethod
from typing import List
from dominio.parametros.entidad import ParametrosSistema, Facultad, Programa, Ventana


class IParametrosRepositorio(ABC):

    @abstractmethod
    def obtener(self) -> ParametrosSistema:
        pass

    @abstractmethod
    def actualizar(self, parametros: ParametrosSistema) -> ParametrosSistema:
        pass


class IFacultadRepositorio(ABC):
    @abstractmethod
    def listar_activas(self) -> List[Facultad]:
        pass
    @abstractmethod
    def guardar(self, facultad: Facultad) -> Facultad:
        pass
    @abstractmethod
    def eliminar(self, id: int) -> None:
        pass


class IProgramaRepositorio(ABC):
    @abstractmethod
    def listar_activos(self) -> List[Programa]:
        pass
    @abstractmethod
    def guardar(self, programa: Programa) -> Programa:
        pass
    @abstractmethod
    def eliminar(self, id: int) -> None:
        pass


class IVentanaRepositorio(ABC):
    @abstractmethod
    def listar_activas(self) -> List[Ventana]:
        pass
