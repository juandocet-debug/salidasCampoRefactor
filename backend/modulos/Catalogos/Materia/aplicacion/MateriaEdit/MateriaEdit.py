from typing import Optional
from ...dominio.MateriaId import MateriaId
from ...dominio.MateriaNombre import MateriaNombre
from ...dominio.MateriaCodigo import MateriaCodigo
from ...dominio.MateriaEstado import MateriaEstado
from ...dominio.MateriaRepository import MateriaRepository

class MateriaEdit:
    def __init__(self, repository: MateriaRepository):
        self.repository = repository

    def run(self, id_val: int, nombre: Optional[str] = None,
            codigo: Optional[str] = None, activa: Optional[bool] = None,
            programa_id: Optional[int] = None) -> None:

        materia_id = MateriaId(value=id_val)
        materia = self.repository.get_by_id(materia_id)

        if not materia:
            raise ValueError(f"Materia con ID {id_val} no encontrada")

        # Solo actualiza los campos enviados (PATCH semántico)
        if nombre is not None:
            materia.nombre = MateriaNombre(value=nombre)
        if codigo is not None:
            materia.codigo = MateriaCodigo(value=codigo.upper().strip())
        if activa is not None:
            materia.activa = MateriaEstado(value=activa)
        if programa_id is not None:
            materia.programa_id = programa_id

        self.repository.save(materia)
