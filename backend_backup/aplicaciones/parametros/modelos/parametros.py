# aplicaciones/parametros/modelos/parametros.py
# Parámetros globales del sistema (singleton): precios y límites operativos.
from django.db import models
from aplicaciones.usuarios.modelos import Usuario


class ParametrosSistema(models.Model):
    """Parámetros globales para el cálculo de costo estimado. Solo un registro."""

    precio_galon          = models.FloatField(default=16500, verbose_name='Precio del galón (COP)')
    rendimiento           = models.FloatField(default=8,      verbose_name='Rendimiento genérico (km/galón)')
    rendimiento_bus       = models.FloatField(default=5,      verbose_name='Bus (km/gal)')
    rendimiento_buseta    = models.FloatField(default=8,      verbose_name='Buseta (km/gal)')
    rendimiento_camioneta = models.FloatField(default=12,     verbose_name='Camioneta (km/gal)')
    costo_noche           = models.FloatField(default=222000, verbose_name='Costo por noche (COP)')
    costo_hora_extra      = models.FloatField(default=11000,  verbose_name='Costo hora extra (COP)')
    costo_hora_extra_2    = models.FloatField(default=15000,  verbose_name='Costo hora extra nocturna (COP)')
    max_horas_viaje       = models.FloatField(default=10,     verbose_name='Máximo horas de viaje/día')
    horas_buffer          = models.FloatField(default=1,      verbose_name='Horas buffer sobre recorrido')

    actualizado_por = models.ForeignKey(
        Usuario, null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='parametros_actualizados',
        verbose_name='Actualizado por',
    )
    actualizado_en = models.DateTimeField(auto_now=True, verbose_name='Última actualización')

    class Meta:
        verbose_name        = 'Parámetros del Sistema'
        verbose_name_plural = 'Parámetros del Sistema'

    def __str__(self):
        return f'Parámetros — Pg:{self.precio_galon} | R:{self.rendimiento} | Noche:{self.costo_noche}'

    @classmethod
    def obtener(cls):
        params, _ = cls.objects.get_or_create(id=1)
        return params

    def rendimiento_para_tipo(self, tipo_vehiculo):
        mapa = {'bus': self.rendimiento_bus, 'buseta': self.rendimiento_buseta, 'camioneta': self.rendimiento_camioneta}
        return mapa.get(tipo_vehiculo, self.rendimiento)

    @staticmethod
    def tipo_vehiculo_sugerido(num_estudiantes):
        if num_estudiantes <= 12: return 'camioneta'
        if num_estudiantes <= 25: return 'buseta'
        return 'bus'
