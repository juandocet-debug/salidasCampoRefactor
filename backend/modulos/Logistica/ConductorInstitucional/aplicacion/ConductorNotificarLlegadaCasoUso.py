from ..dominio.IConductorAppRepository import IConductorAppRepository

class ConductorNotificarLlegadaCasoUso:
    def __init__(self, repository: IConductorAppRepository):
        self.repository = repository

    def run(self, conductor_id: str, salida_id: int) -> None:
        if not salida_id:
            raise ValueError("El ID de la salida es obligatorio.")
            
        self.repository.notificar_llegada_punto(conductor_id, salida_id)
