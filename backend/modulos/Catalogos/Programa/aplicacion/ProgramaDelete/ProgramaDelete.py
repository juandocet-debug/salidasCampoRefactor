from ...dominio.ProgramaId import ProgramaId
from ...dominio.ProgramaRepository import ProgramaRepository

class ProgramaDelete:
    def __init__(self, repository: ProgramaRepository):
        self.repository = repository

    def run(self, id_val: int) -> None:
        programa_id = ProgramaId(value=id_val)
        programa = self.repository.get_by_id(programa_id)
        
        if not programa:
            raise ValueError(f"Programa con ID {id_val} no encontrado")

        self.repository.delete(programa_id)