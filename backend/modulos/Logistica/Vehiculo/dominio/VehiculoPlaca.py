from dataclasses import dataclass

@dataclass(frozen=True)
class VehiculoPlaca:
    value: str

    def __post_init__(self):
        if not self.value or len(self.value) > 10:
            raise ValueError("La placa debe ser válida y menor a 10 caracteres.")
