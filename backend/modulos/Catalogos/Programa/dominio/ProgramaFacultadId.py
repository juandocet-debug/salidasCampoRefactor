from dataclasses import dataclass

@dataclass(frozen=True)
class ProgramaFacultadId:
    value: int

    def __post_init__(self):
        if self.value is None or int(self.value) <= 0:
            raise ValueError("El ID de la facultad debe ser mayor a 0")
