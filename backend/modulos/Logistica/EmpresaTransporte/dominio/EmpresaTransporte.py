from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class EmpresaTransporte:
    id: int
    nit: str
    razon_social: str
    telefono: Optional[str]
    correo: Optional[str]
    contacto: Optional[str]
    activa: bool
