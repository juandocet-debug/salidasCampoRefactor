from dataclasses import dataclass
from typing import Optional
from datetime import time

@dataclass(frozen=True)
class SalidaHoraInicio:
    value: Optional[time]

    def __str__(self) -> str:
        return str(self.value) if self.value else ""
