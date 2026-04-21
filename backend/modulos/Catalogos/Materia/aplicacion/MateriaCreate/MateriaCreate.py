from ...dominio.Materia import Materia
from ...dominio.MateriaId import MateriaId
from ...dominio.MateriaNombre import MateriaNombre
from ...dominio.MateriaCodigo import MateriaCodigo
from ...dominio.MateriaEstado import MateriaEstado
from ...dominio.MateriaRepository import MateriaRepository

class MateriaCreate:
    def __init__(self, repository: MateriaRepository):
        self.repository = repository

    def run(self, nombre: str, codigo: str, programa_id: int, activa: bool = True) -> None:
        materia = Materia(
            id=MateriaId(value=None),
            nombre=MateriaNombre(value=nombre),
            codigo=MateriaCodigo(value=codigo.upper().strip()),
            activa=MateriaEstado(value=activa),
            programa_id=programa_id,
        )
        self.repository.save(materia)
