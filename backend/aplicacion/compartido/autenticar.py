# CAPA: Aplicación
# QUÉ HACE: Caso de uso para autenticar a un usuario y obtener tokens
# NO DEBE CONTENER: Django, ORM

class AutenticarUsuarioCasoUso:
    def __init__(self, servicio_autenticacion):
        self.servicio = servicio_autenticacion

    def ejecutar(self, correo: str, contrasena: str) -> dict:
        return self.servicio.autenticar(correo, contrasena)
