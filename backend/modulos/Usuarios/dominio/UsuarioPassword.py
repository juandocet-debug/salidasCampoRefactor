from dataclasses import dataclass

@dataclass(frozen=True)
class UsuarioPassword:
    value: str

    def __post_init__(self):
        if not self.value or not str(self.value).strip():
            raise ValueError("La contraseña no puede estar vacía.")
        if len(self.value) < 6:
            raise ValueError("La contraseña debe tener al menos 6 caracteres.")
