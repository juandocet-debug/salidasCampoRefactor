# CAPA: Infraestructura
# QUÉ HACE: Define el modelo ORM (Django) para la entidad Salida
# NO DEBE CONTENER: lógica de negocio, reglas de estado, cálculos de costo, validaciones de permisos

from django.db import models


class SalidaModelo(models.Model):
    codigo          = models.CharField(max_length=20, unique=True)
    nombre          = models.CharField(max_length=200)
    asignatura      = models.CharField(max_length=200)
    semestre        = models.CharField(max_length=20)
    facultad        = models.CharField(max_length=200)
    programa        = models.CharField(max_length=200)
    num_estudiantes = models.PositiveIntegerField(default=0)
    justificacion   = models.TextField(blank=True)

    estado          = models.CharField(max_length=30, default='borrador')
    profesor_id     = models.PositiveIntegerField()

    fecha_inicio    = models.DateField(null=True, blank=True)
    fecha_fin       = models.DateField(null=True, blank=True)
    hora_inicio     = models.TimeField(null=True, blank=True)

    distancia_total_km = models.FloatField(default=0.0)
    duracion_dias      = models.FloatField(default=1.0)
    horas_viaje        = models.FloatField(default=9.0)
    costo_estimado     = models.FloatField(default=0.0)

    icono           = models.CharField(max_length=50, default='IcoMap')
    color           = models.CharField(max_length=10, default='#4A8DAC')

    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'salidas'
        verbose_name = 'Salida'
        verbose_name_plural = 'Salidas'

    def __str__(self):
        return f'{self.codigo} — {self.nombre} [{self.estado}]'

class PlaneacionModelo(models.Model):
    salida = models.OneToOneField(SalidaModelo, on_delete=models.CASCADE, related_name='planeacion_modelo')
    resumen = models.TextField(blank=True)
    relacion_syllabus = models.TextField(blank=True)
    objetivo_general = models.TextField(blank=True)
    estrategia_metodologica = models.TextField(blank=True)
    productos_esperados = models.TextField(blank=True)
    
class ObjetivoEspecificoModelo(models.Model):
    planeacion = models.ForeignKey(PlaneacionModelo, on_delete=models.CASCADE, related_name='objetivos')
    descripcion = models.TextField()

class CriterioEvaluacionModelo(models.Model):
    salida = models.ForeignKey(SalidaModelo, on_delete=models.CASCADE, related_name='criterios')
    descripcion = models.TextField()

class PuntoRutaModelo(models.Model):
    salida = models.ForeignKey(SalidaModelo, on_delete=models.CASCADE, related_name='puntos_ruta_modelo')
    nombre = models.CharField(max_length=200)
    latitud = models.FloatField(null=True, blank=True)
    longitud = models.FloatField(null=True, blank=True)
    motivo = models.CharField(max_length=100, blank=True)
    tiempo_estimado = models.CharField(max_length=50, blank=True)
    actividad = models.CharField(max_length=200, blank=True)
    es_hospedaje = models.BooleanField(default=False)
    fecha_programada = models.DateField(null=True, blank=True)
    hora_programada = models.TimeField(null=True, blank=True)
    notas_itinerario = models.TextField(blank=True)
    icono = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=20, blank=True)
    es_retorno = models.BooleanField(default=False)
