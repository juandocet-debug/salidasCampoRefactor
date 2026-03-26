from dataclasses import dataclass

@dataclass(frozen=True)
class ProfesorId:
    value: int

    def __post_init__(self):
        if not isinstance(self.value, int):
            try:
                object.__setattr__(self, 'value', int(self.value))
            except (ValueError, TypeError):
                raise ValueError("El ID del Profesor debe ser un número entero.")
        
        if self.value <= 0:
            raise ValueError("El ID del Profesor debe ser mayor a cero.")

    def __str__(self) -> str:
        return str(self.value)
