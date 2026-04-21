from ...dominio.FacultadId import FacultadId
from ...dominio.FacultadRepository import FacultadRepository

class FacultadDelete:
    def __init__(self, repository: FacultadRepository, programa_repository=None):
        self.repository = repository
        self.programa_repository = programa_repository

    def run(self, id_val: int) -> None:
        facultad_id = FacultadId(value=id_val)
        facultad = self.repository.get_by_id(facultad_id)

        if not facultad:
            raise ValueError(f"Facultad con ID {id_val} no encontrada")

        # Regla de negocio: no se puede eliminar una facultad con programas asociados
        if self.programa_repository:
            programas = self.programa_repository.get_by_facultad_id(id_val)
            if programas:
                nombres = ', '.join(p.nombre.value for p in programas)
                raise ValueError(
                    f"No se puede eliminar la facultad porque tiene {len(programas)} "
                    f"programa(s) asociado(s): {nombres}. "
                    f"Elimine o reasigne los programas primero."
                )

        self.repository.delete(facultad_id)
