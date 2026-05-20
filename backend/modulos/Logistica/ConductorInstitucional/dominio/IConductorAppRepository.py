from abc import ABC, abstractmethod

class IConductorAppRepository(ABC):
    @abstractmethod
    def login(self, cedula: str, telefono: str) -> dict:
        pass

    @abstractmethod
    def get_mis_viajes(self, conductor_id: str) -> list:
        pass

    @abstractmethod
    def comentar_parada_itinerario(self, conductor_id: str, parada_id: int, comentario: str) -> None:
        pass

    @abstractmethod
    def reportar_novedad(self, conductor_id: str, salida_id: int, nivel: str, mensaje: str, foto: str = None) -> None:
        pass

    @abstractmethod
    def notificar_llegada_punto(self, conductor_id: str, salida_id: int) -> None:
        pass
