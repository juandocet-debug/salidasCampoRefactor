from dataclasses import dataclass

@dataclass(frozen=True)
class MateriaNombre:
    value: str

    def __post_init__(self):
        if not self.value or not str(self.value).strip():
            raise ValueError("El nombre de la materia no puede estar vacío.")
        if len(self.value) > 150:
            raise ValueError("El nombre de la materia no puede exceder los 150 caracteres.")
