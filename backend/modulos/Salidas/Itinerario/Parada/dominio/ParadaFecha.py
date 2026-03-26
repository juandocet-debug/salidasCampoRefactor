from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class ParadaFecha:
    value: Optional[str]
