from ...dominio.UsuarioRepository import UsuarioRepository
from ...dominio.UsuarioEmail import UsuarioEmail

class UsuarioLogin:
    def __init__(self, repository: UsuarioRepository):
        self.repository = repository

    def run(self, email: str, password_raw: str) -> dict:
        email_vo = UsuarioEmail(email)
        usuario = self.repository.get_by_email(email_vo)
        
        if not usuario:
            raise ValueError("Credenciales inválidas")
            
        if not self.repository.verify_password(usuario.id, password_raw):
            raise ValueError("Credenciales inválidas")
            
        return {
            "id": usuario.id.value,
            "nombre": usuario.nombre.value,
            "apellido": usuario.apellido.value,
            "email": usuario.email.value,
            "foto": usuario.foto.value
        }
