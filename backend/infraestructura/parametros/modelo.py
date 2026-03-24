# CAPA: Infraestructura
# QUÉ HACE: Modelo ORM para ParametrosSistema (singleton)
# NO DEBE CONTENER: lógica de negocio

from django.db import models


class ParametrosModelo(models.Model):
    precio_galon          = models.FloatField(default=0.0)
    rendimiento_bus       = models.FloatField(default=0.0)
    rendimiento_buseta    = models.FloatField(default=0.0)
    rendimiento_camioneta = models.FloatField(default=0.0)
    costo_noche           = models.FloatField(default=0.0)
    costo_hora_extra      = models.FloatField(default=11000.0)
    costo_hora_extra_2    = models.FloatField(default=15000.0)
    max_horas_viaje       = models.FloatField(default=10.0)
    horas_buffer          = models.FloatField(default=1.0)

    class Meta:
        db_table = 'parametros_sistema'
        verbose_name = 'Parámetros del Sistema'

    def __str__(self):
        return f'Parámetros del Sistema (galon=${self.precio_galon})'


class FacultadModelo(models.Model):
    nombre = models.CharField(max_length=200)
    activa = models.BooleanField(default=True)

    class Meta:
        db_table = 'facultades'
        verbose_name = 'Facultad'

    def __str__(self):
        return self.nombre


class ProgramaModelo(models.Model):
    nombre   = models.CharField(max_length=200)
    facultad = models.ForeignKey(FacultadModelo, on_delete=models.CASCADE, related_name='programas')
    activo   = models.BooleanField(default=True)

    class Meta:
        db_table = 'programas'
        verbose_name = 'Programa'

    def __str__(self):
        return self.nombre


class VentanaModelo(models.Model):
    nombre          = models.CharField(max_length=200)
    fecha_apertura  = models.DateField()
    fecha_cierre    = models.DateField()
    activa          = models.BooleanField(default=True)

    class Meta:
        db_table = 'ventanas_programacion'
        verbose_name = 'Ventana de Programación'

    def __str__(self):
        return self.nombre
