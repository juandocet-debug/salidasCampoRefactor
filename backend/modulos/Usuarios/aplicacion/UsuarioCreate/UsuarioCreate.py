from ...dominio.Usuario import Usuario
from ...dominio.UsuarioId import UsuarioId
from ...dominio.UsuarioNombre import UsuarioNombre
from ...dominio.UsuarioApellido import UsuarioApellido
from ...dominio.UsuarioEmail import UsuarioEmail
from ...dominio.UsuarioPassword import UsuarioPassword
from ...dominio.UsuarioFoto import UsuarioFoto
from ...dominio.UsuarioRol import UsuarioRol
from ...dominio.UsuarioRepository import UsuarioRepository

class UsuarioCreate:
    def __init__(self, repository: UsuarioRepository):
        self.repository = repository

    def run(
        self,
        nombre: str,
        apellido: str,
        email: str,
        password: str,
        foto = None,
        rol: str = "estudiante"
    ) -> None:
        usuario = Usuario(
            id=UsuarioId(None),
            nombre=UsuarioNombre(nombre),
            apellido=UsuarioApellido(apellido),
            email=UsuarioEmail(email),
            password=UsuarioPassword(password),
            foto=UsuarioFoto(foto),
            rol=UsuarioRol(rol)
        )
        self.repository.save(usuario)
