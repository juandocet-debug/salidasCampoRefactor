from dataclasses import dataclass

@dataclass(frozen=True)
class ParadaOrden:
    value: int

    def __post_init__(self):
        object.__setattr__(self, 'value', int(self.value if self.value is not None else 1))
        if self.value <= 0:
            raise ValueError("El orden de la parada debe ser mayor a 0")
