from dataclasses import dataclass

@dataclass
class SalidaHoraFin:
    value: str

    def __post_init__(self):
        # Validate format if provided
        if self.value and not isinstance(self.value, str):
            self.value = str(self.value)
