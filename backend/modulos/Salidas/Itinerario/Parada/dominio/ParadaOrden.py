from dataclasses import dataclass

@dataclass(frozen=True)
class ParadaOrden:
    value: int

    def __post_init__(self):
        if self.value <= 0:
            raise ValueError("El orden de la parada debe ser mayor a 0")
