from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class ParadaIcono:
    value: Optional[str]
