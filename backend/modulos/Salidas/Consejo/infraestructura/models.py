from django.db import models
from django.utils import timezone

class DecisionConsejoModel(models.Model):
    salida_id = models.IntegerField(unique=True)  # Relación lógica abstracta con Core
    concejal_id = models.IntegerField()
    concepto_financiero = models.CharField(max_length=50)  # 'aprobado', 'rechazado', 'ajustes'
    observaciones = models.TextField(blank=True, null=True)
    acta = models.CharField(max_length=50, blank=True, null=True)
    fecha_acta = models.DateField(blank=True, null=True)
    fecha_decision = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'salidas_consejo_decision'
        verbose_name = 'Decisión de Consejo'
        verbose_name_plural = 'Decisiones de Consejo'

    def __str__(self):
        return f"Decisión {self.id} - Salida {self.salida_id} ({self.concepto_financiero})"
