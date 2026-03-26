from typing import List
from modulos.Salidas.Planeacion.dominio.PlaneacionRepository import PlaneacionRepository
from modulos.Salidas.Planeacion.dominio.Planeacion import Planeacion

class PlaneacionGetAll:
    def __init__(self, repository: PlaneacionRepository):
        self.repository = repository

    def run(self) -> List[Planeacion]:
        return self.repository.get_all()
