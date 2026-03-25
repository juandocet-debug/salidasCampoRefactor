from django.db import models

class FacultadModel(models.Model):
    nombre = models.CharField(max_length=100, unique=True, null=True, blank=True)
    activa = models.BooleanField(default=True)

    class Meta:
        db_table = 'facultades'
        app_label = 'facultad_infra'
