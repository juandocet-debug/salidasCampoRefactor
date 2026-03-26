from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class ParametroDescripcion:
    value: Optional[str]

    def __post_init__(self):
        pass # La descripción puede ser nula.
