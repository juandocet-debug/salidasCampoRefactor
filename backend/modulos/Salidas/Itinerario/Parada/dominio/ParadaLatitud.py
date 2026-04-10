from dataclasses import dataclass

@dataclass(frozen=True)
class ParadaLatitud:
    value: float

    def __post_init__(self):
        object.__setattr__(self, 'value', float(self.value if self.value is not None else 0.0))
        if self.value < -90 or self.value > 90:
            raise ValueError("Latitud inválida")
