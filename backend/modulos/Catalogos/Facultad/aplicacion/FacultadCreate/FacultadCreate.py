from ...dominio.Facultad import Facultad
from ...dominio.FacultadId import FacultadId
from ...dominio.FacultadNombre import FacultadNombre
from ...dominio.FacultadEstado import FacultadEstado
from ...dominio.FacultadRepository import FacultadRepository

class FacultadCreate:
    def __init__(self, repository: FacultadRepository):
        self.repository = repository

    def run(
        self,
        nombre: str,
        activa: bool
    ) -> None:
        facultad = Facultad(
            id=FacultadId(None),
            nombre=FacultadNombre(nombre),
            activa=FacultadEstado(activa)
        )

        self.repository.save(facultad)
