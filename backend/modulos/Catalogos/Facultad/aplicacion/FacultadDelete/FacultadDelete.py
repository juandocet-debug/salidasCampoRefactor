from ...dominio.FacultadId import FacultadId
from ...dominio.FacultadRepository import FacultadRepository

class FacultadDelete:
    def __init__(self, repository: FacultadRepository):
        self.repository = repository

    def run(self, id_val: int) -> None:
        facultad_id = FacultadId(value=id_val)
        facultad = self.repository.get_by_id(facultad_id)
        
        if not facultad:
            raise ValueError(f"Facultad con ID {id_val} no encontrada")

        self.repository.delete(facultad_id)
