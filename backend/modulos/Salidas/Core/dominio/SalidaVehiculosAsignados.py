from dataclasses import dataclass
from typing import List

@dataclass(frozen=True)
class SalidaVehiculosAsignados:
    value: List[str]

    def __post_init__(self):
        if self.value is None:
            object.__setattr__(self, 'value', [])
        if not isinstance(self.value, list):
            raise ValueError("Vehículos Asignados debe ser una lista de IDs")
