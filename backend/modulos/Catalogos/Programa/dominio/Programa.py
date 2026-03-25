from dataclasses import dataclass
from typing import Optional
from .ProgramaId import ProgramaId
from .ProgramaNombre import ProgramaNombre
from .ProgramaEstado import ProgramaEstado
from .ProgramaFacultadId import ProgramaFacultadId

@dataclass
class Programa:
    id: ProgramaId
    nombre: ProgramaNombre
    activo: ProgramaEstado
    facultad_id: ProgramaFacultadId
    facultad_nombre: Optional[str] = None
