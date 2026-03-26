from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class VehiculoId:
    value: str

    def __post_init__(self):
        if not self.value:
            raise ValueError("El ID del vehículo no puede estar vacío.")
