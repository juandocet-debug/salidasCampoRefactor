from dataclasses import dataclass

@dataclass(frozen=True)
class FacultadNombre:
    value: str

    def __post_init__(self):
        if not self.value or not str(self.value).strip():
            raise ValueError("El nombre de la facultad no puede estar vacío.")
        if len(self.value) > 100:
            raise ValueError("El nombre de la facultad no puede exceder los 100 caracteres.")
