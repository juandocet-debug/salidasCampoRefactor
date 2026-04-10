from dataclasses import dataclass

@dataclass(frozen=True)
class PuntoParadaLatitud:
    value: float

    def __post_init__(self):
        try:
            val = float(self.value if self.value is not None else 0.0)
            if val < -90.0 or val > 90.0:
                raise ValueError()
            object.__setattr__(self, 'value', val)
        except ValueError:
            raise ValueError("La latitud debe estar en el rango [-90, 90].")

    def __str__(self) -> str:
        return str(self.value)
