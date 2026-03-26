from modulos.Salidas.Core.dominio.SalidaRepository import SalidaRepository

class SalidaDelete:
    def __init__(self, repository: SalidaRepository):
        self.repository = repository

    def run(self, id_salida: int) -> None:
        self.repository.delete(id_salida)
