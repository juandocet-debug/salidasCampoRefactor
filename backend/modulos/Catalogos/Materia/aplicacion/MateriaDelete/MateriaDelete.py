from ...dominio.MateriaId import MateriaId
from ...dominio.MateriaRepository import MateriaRepository

class MateriaDelete:
    def __init__(self, repository: MateriaRepository):
        self.repository = repository

    def run(self, id_val: int) -> None:
        materia_id = MateriaId(value=id_val)
        materia = self.repository.get_by_id(materia_id)

        if not materia:
            raise ValueError(f"Materia con ID {id_val} no encontrada")

        self.repository.delete(materia_id)
