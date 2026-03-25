from dataclasses import dataclass

@dataclass(frozen=True)
class UsuarioNombre:
    value: str

    def __post_init__(self):
        if not self.value or not str(self.value).strip():
            raise ValueError("El nombre del usuario no puede estar vacío.")
        if len(self.value) > 100:
            raise ValueError("El nombre del usuario no puede exceder 100 caracteres.")
        if any(char.isdigit() for char in self.value):
            raise ValueError("El nombre del usuario no puede contener números.")
