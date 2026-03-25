from django.db import models
from modulos.Catalogos.Facultad.infraestructura.models import FacultadModel

class ProgramaModel(models.Model):
    nombre = models.CharField(max_length=150, unique=True, null=True, blank=True)
    facultad = models.ForeignKey(
        FacultadModel,
        on_delete=models.SET_NULL,  # Borrar facultad no borra programa
        null=True,
        blank=True,
        related_name='programas'
    )
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'programas'
        app_label = 'programa_infra'
