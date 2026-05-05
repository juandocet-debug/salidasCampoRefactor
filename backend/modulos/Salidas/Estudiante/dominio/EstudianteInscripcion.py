"""
EstudianteInscripcion — Entidad principal del módulo Estudiante.
Representa el acto formal de un estudiante inscribirse en una salida de campo.
Contiene: quién se inscribió (usuario_id), en qué salida (salida_id),
su foto de ficha, firma digital y el estado actual de autorización.
"""
from dataclasses import dataclass
from .EstudianteInscripcionId import EstudianteInscripcionId
from .EstudianteEstado import EstudianteEstado

@dataclass
class EstudianteInscripcion:
    id:           EstudianteInscripcionId
    salida_id:    int       # ID de la salida a la que se inscribe
    usuario_id:   int       # ID del usuario (estudiante) que se inscribe
    foto_ficha:   str | None   # URL/path de la foto de identificación
    firma_digital: str | None  # URL/path de la imagen de la firma
    estado:       EstudianteEstado
    fecha_inscripcion: str | None = None
