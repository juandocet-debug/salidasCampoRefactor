from dataclasses import dataclass

@dataclass(frozen=True)
class PuntoParadaNombre:
    value: str

    def __post_init__(self):
        val = str(self.value).strip()
        if not val:
            raise ValueError("El nombre del punto de parada no puede estar vacío.")
        object.__setattr__(self, 'value', val)

    def __str__(self) -> str:
        return self.value
