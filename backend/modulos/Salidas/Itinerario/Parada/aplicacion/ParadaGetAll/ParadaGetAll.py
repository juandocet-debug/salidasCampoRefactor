from typing import List
from ...dominio.ParadaRepository import ParadaRepository
from ...dominio.Parada import Parada

class ParadaGetAll:
    def __init__(self, repository: ParadaRepository):
        self.repository = repository

    def run(self, itinerario_id: int) -> List[Parada]:
        """Obtiene todas las paradas de un itinerario específico."""
        return self.repository.get_by_itinerario(itinerario_id)
