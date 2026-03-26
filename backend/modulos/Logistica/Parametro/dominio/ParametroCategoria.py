from dataclasses import dataclass

@dataclass(frozen=True)
class ParametroCategoria:
    value: str

    def __post_init__(self):
        if not self.value or not self.value.strip():
            raise ValueError("La categoría no puede estar vacía.")
        if len(self.value) > 50:
            raise ValueError("La categoría no puede exceder los 50 caracteres.")
