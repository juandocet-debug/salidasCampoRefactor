# aplicaciones/parametros/modelos/programacion.py
# VentanaProgramacion: períodos en que los profesores pueden crear salidas.
from django.db import models


class VentanaProgramacion(models.Model):
    """Período en el que se pueden programar salidas de campo."""
    nombre         = models.CharField(max_length=100, verbose_name='Nombre')
    fecha_apertura = models.DateField(verbose_name='Fecha de apertura')
    fecha_cierre   = models.DateField(verbose_name='Fecha de cierre')
    activa         = models.BooleanField(default=True, verbose_name='¿Activa?')

    class Meta:
        verbose_name        = 'Ventana de Programación'
        verbose_name_plural = 'Ventanas de Programación'
        ordering            = ['-fecha_apertura']

    def __str__(self):
        return f'{self.nombre} ({self.fecha_apertura} → {self.fecha_cierre})'
