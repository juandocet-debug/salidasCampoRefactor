from dataclasses import dataclass

@dataclass(frozen=True)
class PuntoParadaNombre:
    value: str

    def __post_init__(self):
        val = str(self.value).strip() if self.value is not None else ''
        if not val:
            val = 'Sin nombre'
        object.__setattr__(self, 'value', val)

    def __str__(self) -> str:
        return self.value
