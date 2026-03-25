from dataclasses import dataclass
from .FacultadId import FacultadId
from .FacultadNombre import FacultadNombre
from .FacultadEstado import FacultadEstado

@dataclass
class Facultad:
    id: FacultadId
    nombre: FacultadNombre
    activa: FacultadEstado
