from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class ParadaId:
    value: Optional[int]
