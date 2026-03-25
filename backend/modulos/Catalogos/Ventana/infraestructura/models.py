from django.db import models

class VentanaModel(models.Model):
    nombre = models.CharField(max_length=100, unique=True, null=True, blank=True)
    fecha_apertura = models.DateField(null=True, blank=True)
    fecha_cierre = models.DateField(null=True, blank=True)
    activa = models.BooleanField(default=True)

    class Meta:
        db_table = 'ventanas'
        app_label = 'ventana_infra'
