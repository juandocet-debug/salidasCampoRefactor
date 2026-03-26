from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class ParadaActividad:
    value: Optional[str]
