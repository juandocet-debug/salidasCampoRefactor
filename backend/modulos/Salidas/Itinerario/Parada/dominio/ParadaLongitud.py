from dataclasses import dataclass

@dataclass(frozen=True)
class ParadaLongitud:
    value: float

    def __post_init__(self):
        if self.value < -180 or self.value > 180:
            raise ValueError("Longitud inválida")
