from dataclasses import dataclass

@dataclass(frozen=True)
class VentanaNombre:
    value: str

    def __post_init__(self):
        if not self.value or not str(self.value).strip():
            raise ValueError("El nombre de la ventana no puede estar vacío.")
        if len(str(self.value)) > 100:
            raise ValueError("El nombre de la ventana no puede exceder los 100 caracteres.")
