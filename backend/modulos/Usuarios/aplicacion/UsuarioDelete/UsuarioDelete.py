from ...dominio.UsuarioId import UsuarioId
from ...dominio.UsuarioRepository import UsuarioRepository

class UsuarioDelete:
    def __init__(self, repository: UsuarioRepository):
        self.repository = repository

    def run(self, id_val: int) -> None:
        usuario_id = UsuarioId(value=id_val)
        usuario = self.repository.get_by_id(usuario_id)
        
        if not usuario:
            raise ValueError(f"Usuario con ID {id_val} no encontrado")

        self.repository.delete(usuario_id)
