from ...dominio.Programa import Programa
from ...dominio.ProgramaId import ProgramaId
from ...dominio.ProgramaNombre import ProgramaNombre
from ...dominio.ProgramaEstado import ProgramaEstado
from ...dominio.ProgramaFacultadId import ProgramaFacultadId
from ...dominio.ProgramaRepository import ProgramaRepository

class ProgramaCreate:
    def __init__(self, repository: ProgramaRepository):
        self.repository = repository

    def run(
        self,
        nombre: str,
        facultad_id: int,
        activo: bool = True
    ) -> None:
        programa = Programa(
            id=ProgramaId(None),
            nombre=ProgramaNombre(nombre),
            activo=ProgramaEstado(activo),
            facultad_id=ProgramaFacultadId(facultad_id)
        )

        self.repository.save(programa)
