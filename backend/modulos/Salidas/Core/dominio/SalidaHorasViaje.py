from dataclasses import dataclass

@dataclass(frozen=True)
class SalidaHorasViaje:
    value: float

    def __post_init__(self):
        try:
            object.__setattr__(self, 'value', float(self.value if self.value is not None else 0.0))
        except (ValueError, TypeError):
            raise ValueError("Las horas de viaje deben ser un número decimal.")
        if self.value < 0:
            raise ValueError("Las horas de viaje no pueden ser negativas.")

    def __str__(self) -> str:
        return str(self.value)
