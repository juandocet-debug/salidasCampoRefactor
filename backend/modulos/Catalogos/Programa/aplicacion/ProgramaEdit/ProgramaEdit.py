from typing import Optional
from ...dominio.Programa import Programa
from ...dominio.ProgramaId import ProgramaId
from ...dominio.ProgramaNombre import ProgramaNombre
from ...dominio.ProgramaEstado import ProgramaEstado
from ...dominio.ProgramaFacultadId import ProgramaFacultadId
from ...dominio.ProgramaRepository import ProgramaRepository

class ProgramaEdit:
    def __init__(self, repository: ProgramaRepository):
        self.repository = repository

    def run(self, id_val: int, nombre: Optional[str] = None, facultad_id: Optional[int] = None, activo: Optional[bool] = None) -> None:
        programa_id = ProgramaId(value=id_val)
        programa = self.repository.get_by_id(programa_id)
        
        if not programa:
            raise ValueError(f"Programa con ID {id_val} no encontrado")

        if nombre is not None:
            programa.nombre = ProgramaNombre(value=nombre)
        if activo is not None:
            programa.activo = ProgramaEstado(value=activo)
        if facultad_id is not None:
            programa.facultad_id = ProgramaFacultadId(value=facultad_id)
            
        self.repository.save(programa)
