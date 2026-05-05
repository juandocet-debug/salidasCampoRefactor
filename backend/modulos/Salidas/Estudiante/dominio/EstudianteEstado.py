"""
EstudianteEstado — Value Object (Enum)
Representa los tres estados posibles de una inscripción.
Regla de negocio: solo estos tres valores son válidos.
"""
from dataclasses import dataclass

ESTADOS_VALIDOS = ('pendiente', 'autorizado', 'rechazado')

@dataclass(frozen=True)
class EstudianteEstado:
    value: str = 'pendiente'

    def __post_init__(self):
        if self.value not in ESTADOS_VALIDOS:
            raise ValueError(
                f"Estado inválido '{self.value}'. "
                f"Debe ser uno de: {ESTADOS_VALIDOS}"
            )

    def es_pendiente(self) -> bool:
        return self.value == 'pendiente'

    def es_autorizado(self) -> bool:
        return self.value == 'autorizado'

    def es_rechazado(self) -> bool:
        return self.value == 'rechazado'
