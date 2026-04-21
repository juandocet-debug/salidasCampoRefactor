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
    
    # UI Customization
    icono = models.CharField(max_length=50, default='IcoMountain')
    color = models.CharField(max_length=50, default='#16a34a')
    
    # Stakeholder
    profesor_id = models.IntegerField(null=True, blank=True)
    
    # Contexto Temporal
    fecha_inicio = models.DateField(blank=True, null=True)
    fecha_fin = models.DateField(blank=True, null=True)
    hora_inicio = models.TimeField(blank=True, null=True)
    hora_fin = models.TimeField(blank=True, null=True)
    
    # Métricas Base
    distancia_total_km = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    duracion_dias = models.DecimalField(max_digits=5, decimal_places=1, default=1.0)
    horas_viaje = models.DecimalField(max_digits=5, decimal_places=1, default=0.0)
    costo_estimado = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)

    # Paso 1 - Información adicional
    resumen = models.CharField(max_length=100, blank=True, null=True)
    relacion_syllabus = models.TextField(blank=True, null=True)

    # Paso 2 - Planeación
    objetivo_general = models.TextField(blank=True, null=True)
    objetivos_especificos = models.TextField(blank=True, null=True)
    estrategia_metodologica = models.TextField(blank=True, null=True)

    # Paso 3 - Logística
    punto_partida = models.CharField(max_length=300, blank=True, null=True)
    parada_max = models.CharField(max_length=300, blank=True, null=True)

    # Paso 4 - Evaluación
    criterios_evaluacion = models.TextField(blank=True, null=True)
    productos_esperados = models.TextField(blank=True, null=True)

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

# ==========================================
# MÓDULO LOGÍSTICA OPERATIVA (Coordinador)
# ==========================================

class AsignacionExternaLogistica(models.Model):
    salida_id = models.IntegerField(unique=True) 
    empresa = models.CharField(max_length=200)
    contacto = models.CharField(max_length=200, blank=True, null=True)
    costo_proyectado = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    
    class Meta:
        db_table = 'salidas_logistica_asignacion_externa'
        verbose_name = 'Asignación Externa'

class NovedadOperativa(models.Model):
    salida_id = models.IntegerField()
    nivel = models.CharField(max_length=50) # critica, alta, media, baja
    mensaje = models.TextField()
    fecha_reporte = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'salidas_logistica_novedades'
        verbose_name = 'Novedad Operativa'

class CierreOperativo(models.Model):
    salida_id = models.IntegerField(unique=True)
    km_final = models.IntegerField()
    checklist_limpieza = models.BooleanField(default=False)
    checklist_llantas = models.BooleanField(default=False)
    checklist_luces = models.BooleanField(default=False)
    observaciones = models.TextField(blank=True, null=True)
    fecha_cierre = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'salidas_logistica_cierres'
        verbose_name = 'Cierre Operativo'

