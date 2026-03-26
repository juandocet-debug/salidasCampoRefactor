from dataclasses import dataclass

@dataclass(frozen=True)
class SalidaNombre:
    value: str

    def __post_init__(self):
        if self.value is None:
            raise ValueError("El nombre de la salida no puede ser nulo.")
        object.__setattr__(self, 'value', str(self.value).strip())

    def __str__(self) -> str:
        return self.value
