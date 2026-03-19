# aplicaciones/salidas/modelos/planeacion.py
# ─────────────────────────────────────────────────────────────────────────────
# MODELOS DE PLANEACIÓN PEDAGÓGICA
# Relacionados 1:1 con Salida. Cubren objetivos, competencias y metodología.
# ─────────────────────────────────────────────────────────────────────────────

from django.db import models

from .salida import Salida


class PlaneacionPedagogica(models.Model):
    """Planeación pedagógica de una salida — relación 1:1 con Salida."""

    salida      = models.OneToOneField(Salida, on_delete=models.CASCADE, related_name='planeacion')
    obj_general = models.TextField(blank=True, verbose_name='Objetivo general')
    metodologia = models.TextField(blank=True, verbose_name='Metodología')

    class Meta:
        verbose_name = 'Planeación Pedagógica'

    def __str__(self):
        return f'Planeación de {self.salida.codigo}'


class ObjetivoEspecifico(models.Model):
    """Objetivo específico de la planeación pedagógica."""

    planeacion  = models.ForeignKey(
        PlaneacionPedagogica,
        on_delete=models.CASCADE,
        related_name='objetivos',
    )
    descripcion = models.TextField(verbose_name='Descripción')
    orden       = models.PositiveSmallIntegerField(default=0, verbose_name='Orden')

    class Meta:
        verbose_name = 'Objetivo Específico'
        ordering     = ['orden']

    def __str__(self):
        return f'Obj. {self.orden}: {self.descripcion[:60]}'


class Competencia(models.Model):
    """Competencia a desarrollar en la salida."""

    planeacion  = models.ForeignKey(
        PlaneacionPedagogica,
        on_delete=models.CASCADE,
        related_name='competencias',
    )
    descripcion = models.TextField(verbose_name='Descripción')

    class Meta:
        verbose_name = 'Competencia'

    def __str__(self):
        return self.descripcion[:80]
