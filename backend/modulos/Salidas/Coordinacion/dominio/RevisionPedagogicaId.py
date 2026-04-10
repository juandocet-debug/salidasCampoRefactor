from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class RevisionPedagogicaId:
    value: Optional[int]
