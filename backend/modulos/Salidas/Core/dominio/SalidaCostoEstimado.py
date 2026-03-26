from dataclasses import dataclass

@dataclass(frozen=True)
class SalidaCostoEstimado:
    value: float

    def __post_init__(self):
        try:
            object.__setattr__(self, 'value', float(self.value))
        except (ValueError, TypeError):
            raise ValueError("El costo estimado debe ser un número decimal.")
        if self.value < 0:
            raise ValueError("El costo estimado no puede ser negativo.")

    def __str__(self) -> str:
        return str(self.value)
