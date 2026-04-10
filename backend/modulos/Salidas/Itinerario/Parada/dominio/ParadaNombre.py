from dataclasses import dataclass

@dataclass(frozen=True)
class ParadaNombre:
    value: str

    def __post_init__(self):
        # Si viene None o vacío de la BD, usar un nombre por defecto
        if not self.value or len(str(self.value).strip()) == 0:
            object.__setattr__(self, 'value', 'Sin nombre')
        else:
            object.__setattr__(self, 'value', str(self.value).strip())
