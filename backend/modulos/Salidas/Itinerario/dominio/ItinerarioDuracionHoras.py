from dataclasses import dataclass
from decimal import Decimal

@dataclass(frozen=True)
class ItinerarioDuracionHoras:
    value: Decimal

    def __post_init__(self):
        try:
            val = Decimal(self.value)
            if val < 0:
                raise ValueError()
            object.__setattr__(self, 'value', val)
        except Exception:
            raise ValueError("La duracion en Horas debe ser un numero positivo Decimal.")

    def __str__(self) -> str:
        return str(self.value)
