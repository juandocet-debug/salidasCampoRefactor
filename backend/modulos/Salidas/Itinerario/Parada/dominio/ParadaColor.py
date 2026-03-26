from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class ParadaColor:
    value: Optional[str]
