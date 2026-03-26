from django.db import models
import uuid

class VehiculoModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    placa = models.CharField(max_length=10, unique=True)
    tipo = models.CharField(max_length=50)
    marca = models.CharField(max_length=100)
    modelo = models.CharField(max_length=100)
    anio = models.IntegerField()
    color = models.CharField(max_length=50)
    numero_interno = models.CharField(max_length=50, blank=True, null=True)
    capacidad = models.IntegerField()
    rendimiento_kmgal = models.FloatField()
    tipo_combustible = models.CharField(max_length=50)
    propietario = models.CharField(max_length=50)
    estado_tecnico = models.CharField(max_length=50)
    notas = models.TextField(blank=True, null=True)
    foto_url = models.ImageField(upload_to='vehiculos/', blank=True, null=True)

    class Meta:
        db_table = 'logistica_vehiculo'
