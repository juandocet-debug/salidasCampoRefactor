from modulos.Salidas.Planeacion.dominio.PlaneacionRepository import PlaneacionRepository

class PlaneacionDelete:
    def __init__(self, repository: PlaneacionRepository):
        self.repository = repository

    def run(self, id_planeacion: int) -> None:
        self.repository.delete(id_planeacion)
