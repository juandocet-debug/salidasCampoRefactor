from dataclasses import dataclass
import re

@dataclass(frozen=True)
class UsuarioEmail:
    value: str

    def __post_init__(self):
        if not self.value or not str(self.value).strip():
            raise ValueError("El email del usuario no puede estar vacío.")
        
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, self.value):
            raise ValueError(f"El formato del email '{self.value}' es inválido.")
