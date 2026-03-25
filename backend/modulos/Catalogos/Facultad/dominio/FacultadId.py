from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class FacultadId:
    value: Optional[int]
