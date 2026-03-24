# CAPA: Infraestructura
# QUÉ HACE: Modelos ORM para Vehiculo y Asignacion
# NO DEBE CONTENER: lógica de negocio

from django.db import models


class VehiculoModelo(models.Model):
    placa             = models.CharField(max_length=10, unique=True)
    tipo              = models.CharField(max_length=20, default='bus')
    marca             = models.CharField(max_length=100)
    modelo            = models.CharField(max_length=100)
    anio              = models.PositiveIntegerField()
    color             = models.CharField(max_length=50)
    numero_interno    = models.CharField(max_length=20, blank=True)
    capacidad         = models.PositiveIntegerField()
    rendimiento_kmgal = models.FloatField(default=8.0)
    tipo_combustible  = models.CharField(max_length=20, default='diesel')
    propietario       = models.CharField(max_length=20, default='institucional')
    estado_tecnico    = models.CharField(max_length=20, default='disponible')
    foto_url          = models.ImageField(upload_to='vehiculos/', null=True, blank=True)
    notas             = models.TextField(blank=True)
    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vehiculos'
        verbose_name = 'Vehículo'

    def __str__(self):
        return f'{self.placa} — {self.tipo} ({self.marca})'


class AsignacionModelo(models.Model):
    salida_id       = models.PositiveIntegerField()
    vehiculo        = models.ForeignKey(
        VehiculoModelo, null=True, blank=True,
        on_delete=models.SET_NULL, related_name='asignaciones'
    )
    conductor_id    = models.PositiveIntegerField(null=True, blank=True)
    tipo_transporte = models.CharField(max_length=20, default='propio')
    empresa_externa = models.CharField(max_length=200, blank=True)
    confirmado_en   = models.DateTimeField(null=True, blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'asignaciones'
        verbose_name = 'Asignación'

    def __str__(self):
        return f'Asignacion salida {self.salida_id}'
