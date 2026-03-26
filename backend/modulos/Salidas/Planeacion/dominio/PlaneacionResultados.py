from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class PlaneacionResultados:
    value: Optional[str]

    def __post_init__(self):
        if self.value is not None:
            object.__setattr__(self, 'value', str(self.value).strip())

    def __str__(self) -> str:
        return self.value if self.value else ""
