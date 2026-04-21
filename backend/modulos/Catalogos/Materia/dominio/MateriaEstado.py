from dataclasses import dataclass

@dataclass(frozen=True)
class MateriaEstado:
    value: bool

    def __post_init__(self):
        if not isinstance(self.value, bool):
            raise ValueError("El estado de la materia debe ser un valor booleano.")
