from dataclasses import dataclass
from typing import Optional
from .MateriaId import MateriaId
from .MateriaNombre import MateriaNombre
from .MateriaCodigo import MateriaCodigo
from .MateriaEstado import MateriaEstado

@dataclass
class Materia:
    id: MateriaId
    nombre: MateriaNombre
    codigo: MateriaCodigo
    activa: MateriaEstado
    programa_id: int
    programa_nombre: Optional[str] = None
