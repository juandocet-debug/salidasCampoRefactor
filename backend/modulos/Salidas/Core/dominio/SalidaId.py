from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class SalidaId:
    value: Optional[int]

    def __post_init__(self):
        if self.value is not None:
            if not isinstance(self.value, int):
                try:
                    object.__setattr__(self, 'value', int(self.value))
                except (ValueError, TypeError):
                    raise ValueError("El identificador de la Salida debe ser un número entero.")
            
            if self.value <= 0:
                raise ValueError("El identificador de la Salida debe ser mayor a cero.")

    def __str__(self) -> str:
        return str(self.value) if self.value is not None else "None"
