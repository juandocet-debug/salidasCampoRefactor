from typing import Optional
from ...dominio.Facultad import Facultad
from ...dominio.FacultadId import FacultadId
from ...dominio.FacultadNombre import FacultadNombre
from ...dominio.FacultadEstado import FacultadEstado
from ...dominio.FacultadRepository import FacultadRepository

class FacultadEdit:
    def __init__(self, repository: FacultadRepository):
        self.repository = repository

    def run(self, id_val: int, nombre: Optional[str] = None, activa: Optional[bool] = None) -> None:
        facultad_id = FacultadId(value=id_val)
        facultad = self.repository.get_by_id(facultad_id)
        
        if not facultad:
            raise ValueError(f"Facultad con ID {id_val} no encontrada")

        if nombre is not None:
            facultad.nombre = FacultadNombre(value=nombre)
        if activa is not None:
            facultad.activa = FacultadEstado(value=activa)
            
        self.repository.save(facultad)
