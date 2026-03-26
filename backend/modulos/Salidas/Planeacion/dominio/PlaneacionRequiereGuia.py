from dataclasses import dataclass

@dataclass(frozen=True)
class PlaneacionRequiereGuia:
    value: bool

    def __post_init__(self):
        object.__setattr__(self, 'value', bool(self.value))

    def __str__(self) -> str:
        return str(self.value)
