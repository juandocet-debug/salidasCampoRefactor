from dataclasses import dataclass

@dataclass(frozen=True)
class ParadaNombre:
    value: str

    def __post_init__(self):
        if not self.value or len(self.value.strip()) == 0:
            raise ValueError("El nombre de la parada no puede estar vacío")
