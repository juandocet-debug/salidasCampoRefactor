# aplicaciones/salidas/modelos/logistica.py
# ─────────────────────────────────────────────────────────────────────────────
# MODELOS DE LOGÍSTICA
# Itinerario (puntos de ruta con coordenadas, motivo, hospedaje) y criterios.
# ─────────────────────────────────────────────────────────────────────────────

from django.db import models

from .salida import Salida


class PuntoRuta(models.Model):
    """Punto del itinerario: origen, parada intermedia, hospedaje o destino."""

    TIPO_ORIGEN  = 'origen'
    TIPO_PARADA  = 'parada'
    TIPO_DESTINO = 'destino'

    TIPOS = [
        (TIPO_ORIGEN,  'Origen'),
        (TIPO_PARADA,  'Parada'),
        (TIPO_DESTINO, 'Destino'),
    ]

    MOTIVO_ALMUERZO     = 'almuerzo'
    MOTIVO_REFRIGERIO   = 'refrigerio'
    MOTIVO_BANO         = 'bano'
    MOTIVO_ACADEMICA    = 'actividad_academica'
    MOTIVO_PASAJERO     = 'recoger_pasajero'
    MOTIVO_HOSPEDAJE    = 'hospedaje'
    MOTIVO_DESCANSO     = 'descanso_nocturno'
    MOTIVO_OTRO         = 'otro'

    MOTIVOS = [
        (MOTIVO_ALMUERZO,   'Almuerzo'),
        (MOTIVO_REFRIGERIO, 'Refrigerio'),
        (MOTIVO_BANO,       'Baño'),
        (MOTIVO_ACADEMICA,  'Actividad Académica'),
        (MOTIVO_PASAJERO,   'Recoger Pasajero'),
        (MOTIVO_HOSPEDAJE,  'Hospedaje / Pernoctar'),
        (MOTIVO_DESCANSO,   'Descanso Nocturno'),
        (MOTIVO_OTRO,       'Otro'),
    ]

    salida        = models.ForeignKey(Salida, on_delete=models.CASCADE, related_name='puntos_ruta')
    orden         = models.PositiveSmallIntegerField(default=0, verbose_name='Orden')
    nombre        = models.CharField(max_length=200, verbose_name='Nombre del punto')
    tipo          = models.CharField(max_length=10, choices=TIPOS, default=TIPO_PARADA, verbose_name='Tipo')

    # Coordenadas GPS
    latitud       = models.FloatField(null=True, blank=True, verbose_name='Latitud')
    longitud      = models.FloatField(null=True, blank=True, verbose_name='Longitud')
    direccion     = models.CharField(max_length=300, blank=True, verbose_name='Dirección completa')

    # Detalles de la parada
    motivo         = models.CharField(max_length=30, choices=MOTIVOS, blank=True, verbose_name='Motivo')
    tiempo_estimado = models.CharField(max_length=50, blank=True, verbose_name='Tiempo estimado')
    actividad      = models.TextField(blank=True, verbose_name='Actividad')
    hora_estimada  = models.TimeField(null=True, blank=True, verbose_name='Hora estimada')

    # Programación en el itinerario
    fecha_programada = models.DateField(null=True, blank=True, verbose_name='Fecha programada')
    hora_programada  = models.TimeField(null=True, blank=True, verbose_name='Hora programada')
    notas_itinerario = models.CharField(max_length=300, blank=True, verbose_name='Notas del itinerario')

    # Hospedaje
    es_hospedaje   = models.BooleanField(default=False, verbose_name='¿Es parada de hospedaje?')

    # Dirección del viaje
    es_retorno     = models.BooleanField(default=False, verbose_name='¿Es parada del retorno?')

    # Personalización UI (Kanban)
    icono = models.CharField(max_length=50, blank=True, null=True, verbose_name='Icono / Ilustración')
    color = models.CharField(max_length=20, blank=True, null=True, verbose_name='Color Tema')

    class Meta:
        verbose_name = 'Punto de Ruta'
        ordering     = ['orden']

    def __str__(self):
        return f'[{self.get_tipo_display()}] {self.nombre} — {self.salida.codigo}'

    def save(self, *args, **kwargs):
        # Auto-marcar es_hospedaje según motivo
        if self.motivo in (self.MOTIVO_HOSPEDAJE, self.MOTIVO_DESCANSO):
            self.es_hospedaje = True
        super().save(*args, **kwargs)


class CriterioEvaluacion(models.Model):
    """Criterio de evaluación pedagógica de la salida."""

    salida      = models.ForeignKey(
        Salida,
        on_delete=models.CASCADE,
        related_name='criterios_evaluacion',
    )
    descripcion = models.TextField(verbose_name='Descripción')
    porcentaje  = models.FloatField(default=0, verbose_name='Porcentaje (%)')
    tipo        = models.CharField(max_length=100, blank=True, verbose_name='Tipo de criterio')

    class Meta:
        verbose_name = 'Criterio de Evaluación'

    def __str__(self):
        return f'{self.descripcion[:60]} ({self.porcentaje}%)'
