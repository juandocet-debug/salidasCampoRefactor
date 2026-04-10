from django.db import models
from django.utils import timezone

class RevisionPedagogicaModel(models.Model):
    salida_id = models.IntegerField(unique=True) # Relación con Salida (1 a 1 por revisión)
    coordinador_id = models.IntegerField()
    
    # 1. Pertinencia con Plan de Estudios
    pertinencia_estado = models.CharField(max_length=20, default='PENDIENTE')
    pertinencia_obs = models.TextField(blank=True, null=True)
    
    # 2. Coherencia de Objetivos
    objetivos_estado = models.CharField(max_length=20, default='PENDIENTE')
    objetivos_obs = models.TextField(blank=True, null=True)
    
    # 3. Metodología Adecuada
    metodologia_estado = models.CharField(max_length=20, default='PENDIENTE')
    metodologia_obs = models.TextField(blank=True, null=True)
    
    # 4. Viabilidad del Itinerario
    viabilidad_estado = models.CharField(max_length=20, default='PENDIENTE')
    viabilidad_obs = models.TextField(blank=True, null=True)
    
    # Final
    concepto_final = models.CharField(max_length=50, default='PENDIENTE')
    fecha_revision = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'salidas_coordinacion_revision'
        verbose_name = 'Revisión Pedagógica'
        verbose_name_plural = 'Revisiones Pedagógicas'

    def __str__(self):
        return f"Revisión {self.id} - Salida {self.salida_id} ({self.concepto_final})"
