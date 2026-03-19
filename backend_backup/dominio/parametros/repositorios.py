# dominio/parametros/repositorios.py
from abc import ABC, abstractmethod
from typing import List, Optional, Any

class IParametrosRepositorio(ABC):
    @abstractmethod
    def obtener(self) -> Any:
        pass

    @abstractmethod
    def guardar(self, datos: dict, actualizado_por: Any) -> Any:
        pass


class IFacultadRepositorio(ABC):
    @abstractmethod
    def listar_todas(self) -> list:
        pass

    @abstractmethod
    def listar_activas(self) -> list:
        pass

    @abstractmethod
    def obtener_por_id(self, pk: int) -> Any:
        pass

    @abstractmethod
    def crear(self, datos: dict) -> Any:
        pass

    @abstractmethod
    def guardar(self, facultad: Any) -> Any:
        pass

    @abstractmethod
    def eliminar(self, pk: int) -> None:
        pass

    @abstractmethod
    def sincronizar_programas(self, facultad_id: int, activa: bool) -> None:
        pass


class IProgramaRepositorio(ABC):
    @abstractmethod
    def listar(self, facultad_id: Optional[int] = None) -> list:
        pass

    @abstractmethod
    def listar_activos(self) -> list:
        pass

    @abstractmethod
    def obtener_por_id(self, pk: int) -> Any:
        pass

    @abstractmethod
    def crear(self, datos: dict) -> Any:
        pass

    @abstractmethod
    def guardar(self, programa: Any) -> Any:
        pass

    @abstractmethod
    def eliminar(self, pk: int) -> None:
        pass


class IVentanaRepositorio(ABC):
    @abstractmethod
    def listar_todas(self) -> list:
        pass

    @abstractmethod
    def listar_activas(self) -> list:
        pass

    @abstractmethod
    def obtener_por_id(self, pk: int) -> Any:
        pass

    @abstractmethod
    def crear(self, datos: dict) -> Any:
        pass

    @abstractmethod
    def guardar(self, ventana: Any) -> Any:
        pass

    @abstractmethod
    def eliminar(self, pk: int) -> None:
        pass
