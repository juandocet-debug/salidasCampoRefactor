# aplicaciones/novedades/modelos.py
# ─────────────────────────────────────────────────────────────────────────────
# MODELO DE NOVEDADES DEL VIAJE
# Incidentes reportados por el conductor durante la ejecución de la salida.
# ─────────────────────────────────────────────────────────────────────────────

from django.db import models
from aplicaciones.usuarios.modelos import Usuario
from aplicaciones.salidas.modelos import Salida
from aplicaciones.nucleo.constantes import TiposNovedad, Urgencias


class Novedad(models.Model):
    """
    Incidente o novedad reportada durante la ejecución de una salida.
    El conductor la registra desde su cliente móvil/web con ubicación GPS.
    """

    ESTADO_ABIERTA  = 'abierta'
    ESTADO_RESUELTA = 'resuelta'
    ESTADOS = [
        (ESTADO_ABIERTA,  'Abierta'),
        (ESTADO_RESUELTA, 'Resuelta'),
    ]

    salida        = models.ForeignKey(
        Salida,
        on_delete=models.CASCADE,
        related_name='novedades',
        verbose_name='Salida'
    )
    tipo          = models.CharField(
        max_length=15,
        choices=TiposNovedad.OPCIONES,
        verbose_name='Tipo de novedad'
    )
    urgencia      = models.CharField(
        max_length=10,
        choices=Urgencias.OPCIONES,
        verbose_name='Urgencia'
    )
    descripcion   = models.TextField(verbose_name='Descripción del incidente')
    estado        = models.CharField(
        max_length=10,
        choices=ESTADOS,
        default=ESTADO_ABIERTA,
        verbose_name='Estado'
    )

    # Ubicación GPS al momento del reporte
    latitud       = models.FloatField(null=True, blank=True, verbose_name='Latitud')
    longitud      = models.FloatField(null=True, blank=True, verbose_name='Longitud')

    reportado_por  = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        related_name='novedades_reportadas',
        verbose_name='Reportado por'
    )
    registrado_en  = models.DateTimeField(auto_now_add=True, verbose_name='Registrado en')
    resuelto_en    = models.DateTimeField(null=True, blank=True, verbose_name='Resuelto en')

    class Meta:
        verbose_name        = 'Novedad del Viaje'
        verbose_name_plural = 'Novedades del Viaje'
        ordering            = ['-registrado_en']

    def __str__(self):
        return f'[{self.urgencia.upper()}] {self.get_tipo_display()} — {self.salida.codigo}'

    def resolver(self, usuario):
        """Marca la novedad como resuelta."""
        from django.utils import timezone
        self.estado      = self.ESTADO_RESUELTA
        self.resuelto_en = timezone.now()
        self.save(update_fields=['estado', 'resuelto_en'])
