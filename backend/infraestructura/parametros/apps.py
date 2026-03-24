from django.apps import AppConfig


class ParametrosInfraConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'infraestructura.parametros'
    verbose_name = 'Parámetros'

    def ready(self):
        import infraestructura.parametros.modelo  # noqa
