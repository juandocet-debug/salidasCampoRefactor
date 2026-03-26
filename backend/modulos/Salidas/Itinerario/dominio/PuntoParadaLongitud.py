from dataclasses import dataclass

@dataclass(frozen=True)
class PuntoParadaLongitud:
    value: float

    def __post_init__(self):
        try:
            val = float(self.value)
            if val < -180.0 or val > 180.0:
                raise ValueError()
            object.__setattr__(self, 'value', val)
        except Exception:
            raise ValueError("La longitud debe estar en el rango [-180, 180].")

    def __str__(self) -> str:
        return str(self.value)
