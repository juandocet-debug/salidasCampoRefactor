from dataclasses import dataclass
from .UsuarioId import UsuarioId
from .UsuarioNombre import UsuarioNombre
from .UsuarioApellido import UsuarioApellido
from .UsuarioEmail import UsuarioEmail
from .UsuarioPassword import UsuarioPassword
from .UsuarioFoto import UsuarioFoto
from .UsuarioRol import UsuarioRol

@dataclass
class Usuario:
    id: UsuarioId
    nombre: UsuarioNombre
    apellido: UsuarioApellido
    email: UsuarioEmail
    password: UsuarioPassword
    foto: UsuarioFoto
    rol: UsuarioRol
