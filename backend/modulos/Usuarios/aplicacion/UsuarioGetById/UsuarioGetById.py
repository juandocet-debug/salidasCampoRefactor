from ...dominio.UsuarioId import UsuarioId
from ...dominio.UsuarioRepository import UsuarioRepository

class UsuarioGetById:
    def __init__(self, repository: UsuarioRepository):
        self.repository = repository

    def run(self, id_val: int) -> dict:
        usuario_id = UsuarioId(value=id_val)
        usuario = self.repository.get_by_id(usuario_id)
        
        if not usuario:
            raise ValueError(f"Usuario con ID {id_val} no encontrado")

        return {
            "id": usuario.id.value,
            "nombre": usuario.nombre.value,
            "apellido": usuario.apellido.value,
            "email": usuario.email.value,
            "foto": usuario.foto.value
        }
