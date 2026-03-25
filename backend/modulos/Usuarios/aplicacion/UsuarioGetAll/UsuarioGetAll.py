from ...dominio.UsuarioRepository import UsuarioRepository
from typing import List

class UsuarioGetAll:
    def __init__(self, repository: UsuarioRepository):
        self.repository = repository

    def run(self) -> List[dict]:
        usuarios = self.repository.get_all()
        return [
            {
                "id": u.id.value,
                "nombre": u.nombre.value,
                "apellido": u.apellido.value,
                "email": u.email.value,
                "foto": u.foto.value
            }
            for u in usuarios
        ]
