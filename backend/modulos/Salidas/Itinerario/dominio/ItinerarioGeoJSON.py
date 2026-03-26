from dataclasses import dataclass

@dataclass(frozen=True)
class ItinerarioGeoJSON:
    value: str

    def __post_init__(self):
        object.__setattr__(self, 'value', str(self.value).strip())

    def __str__(self) -> str:
        return self.value
