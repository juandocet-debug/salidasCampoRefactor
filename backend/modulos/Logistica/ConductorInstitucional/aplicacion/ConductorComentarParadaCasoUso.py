from ..dominio.IConductorAppRepository import IConductorAppRepository

class ConductorComentarParadaCasoUso:
    def __init__(self, repository: IConductorAppRepository):
        self.repository = repository

    def run(self, conductor_id: str, parada_id: int, comentario: str) -> None:
        if not parada_id:
            raise ValueError("El ID de la parada es obligatorio.")
        if not comentario or not comentario.strip():
            raise ValueError("El comentario no puede estar vacío.")
        self.repository.comentar_parada_itinerario(conductor_id, parada_id, comentario)
