from dataclasses import dataclass

@dataclass(frozen=True)
class PuntoParadaOrden:
    value: int

    def __post_init__(self):
        try:
            val = int(self.value if self.value is not None else 0)
            if val < 0:
                raise ValueError()
            object.__setattr__(self, 'value', val)
        except ValueError:
            raise ValueError("El Orden del PuntoParada debe ser un número entero positivo.")

    def __str__(self) -> str:
        return str(self.value)
