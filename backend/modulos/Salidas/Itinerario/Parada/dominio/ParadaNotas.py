from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class ParadaNotas:
    value: Optional[str]
