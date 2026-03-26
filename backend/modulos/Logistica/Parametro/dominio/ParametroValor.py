from dataclasses import dataclass

@dataclass(frozen=True)
class ParametroValor:
    value: str

    def __post_init__(self):
        if self.value is None:
            raise ValueError("El valor del parámetro no puede ser nulo.")
        if len(str(self.value)) > 255:
            raise ValueError("El valor no puede exceder los 255 caracteres.")
