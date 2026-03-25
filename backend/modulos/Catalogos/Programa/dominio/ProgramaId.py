from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class ProgramaId:
    value: Optional[int]
