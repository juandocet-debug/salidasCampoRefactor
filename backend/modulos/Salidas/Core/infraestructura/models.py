from django.db import models

class SalidaModelo(models.Model):
    codigo = models.CharField(max_length=50, unique=True)
    nombre = models.CharField(max_length=200)
    asignatura = models.CharField(max_length=200, blank=True, null=True)
    semestre = models.CharField(max_length=20, blank=True, null=True)
    
    # Referencias de Identidad hacia Catalogos
    facultad_id = models.IntegerField(null=True, blank=True)
    programa_id = models.IntegerField(null=True, blank=True)
    
    num_estudiantes = models.IntegerField(default=0)
    justificacion = models.TextField(blank=True, null=True)
    estado = models.CharField(max_length=50, default='BORRADOR')
    
    # Stakeholder
    profesor_id = models.IntegerField(null=True, blank=True)
    
    # Contexto Temporal
    fecha_inicio = models.DateField(blank=True, null=True)
    fecha_fin = models.DateField(blank=True, null=True)
    hora_inicio = models.TimeField(blank=True, null=True)
    
    # Métricas Base
    distancia_total_km = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    duracion_dias = models.DecimalField(max_digits=5, decimal_places=1, default=1.0)
    horas_viaje = models.DecimalField(max_digits=5, decimal_places=1, default=0.0)
    costo_estimado = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)

    class Meta:
        db_table = 'salidas_core_salida'
        verbose_name = 'Salida Core'
        verbose_name_plural = 'Salidas Core'

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"

class SalidaVehiculoAsignado(models.Model):
    salida_id = models.IntegerField()
    vehiculo_id = models.UUIDField()
    
    class Meta:
        db_table = 'salidas_core_salida_vehiculo'
        unique_together = ('salida_id', 'vehiculo_id')
