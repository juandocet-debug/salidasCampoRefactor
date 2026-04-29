from django.db import models
from modulos.Logistica.EmpresaTransporte.infraestructura.models import EmpresaTransporteModel


class ConductorExternoModel(models.Model):
    empresa  = models.ForeignKey(
        EmpresaTransporteModel,
        on_delete=models.CASCADE,
        related_name='conductores'
    )
    nombre   = models.CharField(max_length=100)
    cedula   = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    licencia = models.CharField(max_length=30, blank=True, null=True)
    activo   = models.BooleanField(default=True)

    class Meta:
        db_table = 'logistica_conductor_externo'
        verbose_name = 'Conductor Externo'
        verbose_name_plural = 'Conductores Externos'

    def __str__(self):
        return f"{self.nombre} (CC {self.cedula})"
