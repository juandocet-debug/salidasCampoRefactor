from ...dominio.ParadaRepository import ParadaRepository
from ...dominio.ParadaId import ParadaId

class ParadaDelete:
    def __init__(self, repository: ParadaRepository):
        self.repository = repository

    def run(self, id: int) -> None:
        parada_id = ParadaId(id)
        if not self.repository.get_by_id(parada_id):
             raise ValueError(f"La Parada con ID {id} no existe")
        self.repository.delete(parada_id)
