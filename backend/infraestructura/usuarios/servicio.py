from rest_framework_simplejwt.tokens import RefreshToken
from infraestructura.usuarios.models import Usuario

class AutenticacionServicioDjango:
    def autenticar(self, correo: str, contrasena: str) -> dict:
        """
        Devuelve un diccionario con el usuario y los tokens si las credenciales son válidas.
        Lanza Exception en caso de error.
        """
        usuario = Usuario.objects.get(email=correo)
        if not usuario.check_password(contrasena):
            raise Exception("Credenciales incorrectas")

        refresh = RefreshToken.for_user(usuario)

        return {
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            },
            'usuario': {
                'id': usuario.id,
                'email': usuario.email,
                'first_name': usuario.first_name,
                'last_name': usuario.last_name,
                'rol': usuario.rol,
            }
        }
