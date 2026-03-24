# CAPA: Infraestructura
# QUÉ HACE: Registra la app de transporte en Django
# NO DEBE CONTENER: lógica de negocio

from django.apps import AppConfig


class TransporteInfraConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'infraestructura.transporte'
    verbose_name = 'Transporte'

    def ready(self):
        import infraestructura.transporte.modelo  # noqa
