from ...dominio.ProgramaId import ProgramaId
from ...dominio.ProgramaRepository import ProgramaRepository

class ProgramaDelete:
    def __init__(self, repository: ProgramaRepository, materia_repository=None):
        self.repository = repository
        self.materia_repository = materia_repository

    def run(self, id_val: int) -> None:
        programa_id = ProgramaId(value=id_val)
        programa = self.repository.get_by_id(programa_id)

        if not programa:
            raise ValueError(f"Programa con ID {id_val} no encontrado")

        # Regla de negocio: no se puede eliminar un programa con materias asociadas
        if self.materia_repository:
            materias = self.materia_repository.get_by_programa_id(id_val)
            if materias:
                nombres = ', '.join(m.nombre.value for m in materias)
                raise ValueError(
                    f"No se puede eliminar el programa porque tiene {len(materias)} "
                    f"materia(s) asociada(s): {nombres}. "
                    f"Elimine las materias primero."
                )

        self.repository.delete(programa_id)