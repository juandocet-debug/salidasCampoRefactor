from dataclasses import dataclass

@dataclass(frozen=True)
class FechaCierre:
    value: str

    def __post_init__(self):
        if not self.value or not str(self.value).strip():
            raise ValueError("La fecha de cierre no puede estar vacía.")
