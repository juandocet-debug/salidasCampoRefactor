from dataclasses import dataclass

@dataclass(frozen=True)
class MateriaCodigo:
    value: str

    def __post_init__(self):
        if not self.value or not str(self.value).strip():
            raise ValueError("El código de la materia no puede estar vacío.")
        if len(self.value) > 20:
            raise ValueError("El código de la materia no puede exceder los 20 caracteres.")
