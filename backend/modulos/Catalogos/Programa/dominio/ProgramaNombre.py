from dataclasses import dataclass

@dataclass(frozen=True)
class ProgramaNombre:
    value: str

    def __post_init__(self):
        if not self.value or not str(self.value).strip():
            raise ValueError("El nombre del programa no puede estar vacío")
        if len(str(self.value)) > 150:
            raise ValueError("El nombre del programa no puede exceder los 150 caracteres")
