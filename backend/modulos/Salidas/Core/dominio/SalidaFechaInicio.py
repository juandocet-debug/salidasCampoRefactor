from dataclasses import dataclass
from typing import Optional
from datetime import date

@dataclass(frozen=True)
class SalidaFechaInicio:
    value: Optional[date]

    def __str__(self) -> str:
        return str(self.value) if self.value else ""
