from dataclasses import dataclass

@dataclass(frozen=True)
class SalidaNumEstudiantes:
    value: int

    def __post_init__(self):
        if not isinstance(self.value, int):
            try:
                object.__setattr__(self, 'value', int(self.value))
            except (ValueError, TypeError):
                raise ValueError("El número de estudiantes debe ser un entero.")
        if self.value < 0:
            raise ValueError("El número de estudiantes no puede ser negativo.")

    def __str__(self) -> str:
        return str(self.value)
