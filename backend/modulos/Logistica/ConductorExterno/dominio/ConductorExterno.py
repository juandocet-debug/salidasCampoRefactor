from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class ConductorExterno:
    id: int
    empresa_id: int
    nombre: str
    cedula: str
    telefono: Optional[str]
    licencia: Optional[str]
    email: Optional[str] = None
    foto: Optional[str] = None
    activo: bool = True
