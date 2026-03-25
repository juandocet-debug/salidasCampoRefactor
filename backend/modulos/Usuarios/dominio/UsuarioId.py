from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class UsuarioId:
    value: Optional[int]
