"""
DirectorioEstudianteEntidad — Entidad del dominio (no es el modelo Django).
Representa un estudiante cargado desde el CSV institucional.
Tiene sus credenciales (correo + password_hash) y su perfil académico.
"""
from dataclasses import dataclass

@dataclass
class DirectorioEstudianteEntidad:
    id:             int | None
    correo:         str        # Correo institucional (login)
    password_hash:  str        # Hash de la contraseña cargada del CSV
    nombre:         str
    apellido:       str
    facultad:       str
    programa:       str
    activo:         bool = True
    carga_id:       int | None = None  # ID de la CargaDirectorio que lo creó
