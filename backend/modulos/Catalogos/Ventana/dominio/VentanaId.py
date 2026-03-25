from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class VentanaId:
    value: Optional[int]
