from django.db import models

class ConductorInstitucionalModel(models.Model):
    nombre = models.CharField(max_length=150)
    cedula = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    tipo_licencia = models.CharField(max_length=10, blank=True, null=True)
    foto = models.ImageField(upload_to='conductores_institucionales/', blank=True, null=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'logistica_conductor_institucional'
        verbose_name = 'Conductor Institucional'
        verbose_name_plural = 'Conductores Institucionales'

    def __str__(self):
        return f"{self.nombre} (CC {self.cedula})"
