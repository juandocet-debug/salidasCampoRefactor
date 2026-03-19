# aplicaciones/parametros/modelos/academico.py
# Catálogos académicos: Facultad y Programa.
from django.db import models


class Facultad(models.Model):
    """Facultad de la universidad — catálogo configurable por admin."""
    nombre = models.CharField(max_length=150, unique=True, verbose_name='Nombre')
    activa = models.BooleanField(default=True, verbose_name='¿Activa?')

    class Meta:
        verbose_name        = 'Facultad'
        verbose_name_plural = 'Facultades'
        ordering            = ['nombre']

    def __str__(self):
        return self.nombre


class Programa(models.Model):
    """Programa académico — pertenece a una Facultad."""
    facultad = models.ForeignKey(Facultad, on_delete=models.CASCADE, related_name='programas', verbose_name='Facultad')
    nombre   = models.CharField(max_length=200, verbose_name='Nombre')
    activo   = models.BooleanField(default=True, verbose_name='¿Activo?')

    class Meta:
        verbose_name        = 'Programa Académico'
        verbose_name_plural = 'Programas Académicos'
        ordering            = ['facultad__nombre', 'nombre']

    def __str__(self):
        return f'{self.nombre} ({self.facultad.nombre})'
