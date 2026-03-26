from dataclasses import dataclass

@dataclass(frozen=True)
class ParametroClave:
    value: str

    def __post_init__(self):
        if not self.value or not self.value.strip():
            raise ValueError("La clave del parámetro no puede estar vacía.")
        if len(self.value) > 50:
            raise ValueError("La clave no puede exceder los 50 caracteres.")
