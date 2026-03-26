from dataclasses import dataclass

@dataclass(frozen=True)
class ParametroNombre:
    value: str

    def __post_init__(self):
        if not self.value or not self.value.strip():
            raise ValueError("El nombre del parámetro no puede estar vacío.")
        if len(self.value) > 100:
            raise ValueError("El nombre no puede exceder los 100 caracteres.")
