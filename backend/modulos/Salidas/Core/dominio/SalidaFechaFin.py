from dataclasses import dataclass
from typing import Optional
from datetime import date

@dataclass(frozen=True)
class SalidaFechaFin:
    value: Optional[date]

    def __str__(self) -> str:
        return str(self.value) if self.value else ""
