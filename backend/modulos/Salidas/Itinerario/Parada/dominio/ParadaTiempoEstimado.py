from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class ParadaTiempoEstimado:
    value: Optional[str]
