from dataclasses import dataclass

@dataclass(frozen=True)
class SalidaCodigo:
    value: str

    def __post_init__(self):
        if not self.value or not str(self.value).strip():
            raise ValueError("El código de la salida no puede estar vacío.")
        
        object.__setattr__(self, 'value', str(self.value).strip().upper())

    def __str__(self) -> str:
        return self.value
