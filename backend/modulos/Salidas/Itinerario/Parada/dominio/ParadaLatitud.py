from dataclasses import dataclass

@dataclass(frozen=True)
class ParadaLatitud:
    value: float

    def __post_init__(self):
        if self.value < -90 or self.value > 90:
            raise ValueError("Latitud inválida")
