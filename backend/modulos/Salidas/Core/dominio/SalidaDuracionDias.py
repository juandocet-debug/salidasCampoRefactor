from dataclasses import dataclass

@dataclass(frozen=True)
class SalidaDuracionDias:
    value: float

    def __post_init__(self):
        try:
            object.__setattr__(self, 'value', float(self.value if self.value is not None else 1.0))
        except (ValueError, TypeError):
            raise ValueError("La duración debe ser un número decimal.")
        if self.value < 0:
            raise ValueError("La duración no puede ser negativa.")

    def __str__(self) -> str:
        return str(self.value)
