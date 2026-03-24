from django.apps import AppConfig


class UsuariosInfraConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'infraestructura.usuarios'
    label = 'usuarios'
    verbose_name = 'Usuarios'


