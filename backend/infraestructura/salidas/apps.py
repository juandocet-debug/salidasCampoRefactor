from django.apps import AppConfig


class SalidasInfraConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'infraestructura.salidas'
    verbose_name = 'Infraestructura Salidas'

    def ready(self):
        import infraestructura.salidas.modelo  # noqa
