from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class UsuarioFoto:
    value: Optional[str]

    def __post_init__(self):
        # Validaciones de dominio para foto podrían involucrar comprobar urls o extensiones si se mandan como cadena
        pass
