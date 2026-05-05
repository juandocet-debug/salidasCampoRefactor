"""
EstudianteInscripcionId — Value Object
Representa el identificador único de una inscripción.
Igual al patrón de SalidaId, UsuarioId, etc.
"""
from dataclasses import dataclass

@dataclass(frozen=True)
class EstudianteInscripcionId:
    value: int | None = None
