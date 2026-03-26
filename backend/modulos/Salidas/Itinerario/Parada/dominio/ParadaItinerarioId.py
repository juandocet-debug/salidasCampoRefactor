from dataclasses import dataclass

@dataclass(frozen=True)
class ParadaItinerarioId:
    value: int

    def __post_init__(self):
        if self.value <= 0:
            raise ValueError("El ID del itinerario debe ser mayor a 0")
