from modulos.Salidas.Core.dominio.SalidaRepository import SalidaRepository
from typing import List
from modulos.Salidas.Core.dominio.Salida import Salida

class SalidaGetAll:
    def __init__(self, repository: SalidaRepository):
        self.repository = repository

    def run(self) -> List[Salida]:
        return self.repository.get_all()
