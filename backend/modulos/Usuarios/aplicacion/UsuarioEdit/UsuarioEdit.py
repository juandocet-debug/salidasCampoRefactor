from ...dominio.UsuarioId import UsuarioId
from ...dominio.UsuarioNombre import UsuarioNombre
from ...dominio.UsuarioApellido import UsuarioApellido
from ...dominio.UsuarioEmail import UsuarioEmail
from ...dominio.UsuarioFoto import UsuarioFoto
from ...dominio.UsuarioRepository import UsuarioRepository
from typing import Optional

class UsuarioEdit:
    def __init__(self, repository: UsuarioRepository):
        self.repository = repository

    def run(
        self, 
        id_val: int, 
        nombre: Optional[str] = None, 
        apellido: Optional[str] = None, 
        email: Optional[str] = None,
        foto = None
    ) -> None:
        usuario_id = UsuarioId(value=id_val)
        usuario = self.repository.get_by_id(usuario_id)
        
        if not usuario:
            raise ValueError(f"Usuario con ID {id_val} no encontrado")

        if nombre is not None:
            usuario.nombre = UsuarioNombre(value=nombre)
        if apellido is not None:
            usuario.apellido = UsuarioApellido(value=apellido)
        if email is not None:
            usuario.email = UsuarioEmail(value=email)
        if foto is not None:
            usuario.foto = UsuarioFoto(value=foto)
            
        self.repository.save(usuario)
