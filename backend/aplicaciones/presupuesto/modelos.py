# aplicaciones/presupuesto/modelos.py
# ─────────────────────────────────────────────────────────────────────────────
# MODELOS DE PRESUPUESTO
# Controla el presupuesto asignado a cada salida y el registro de gastos.
# ─────────────────────────────────────────────────────────────────────────────

from django.db import models
from aplicaciones.usuarios.modelos import Usuario
from aplicaciones.salidas.modelos import Salida


class Presupuesto(models.Model):
    """
    Presupuesto asignado a una salida de campo.
    Relación 1:1 con Salida. El Coordinador de Salidas lo asigna.
    """

    salida          = models.OneToOneField(
        Salida,
        on_delete=models.CASCADE,
        related_name='presupuesto',
        verbose_name='Salida'
    )
    total_asignado  = models.FloatField(default=0, verbose_name='Total asignado (COP)')
    ejecutado       = models.FloatField(default=0, verbose_name='Total ejecutado (COP)')

    class Meta:
        verbose_name = 'Presupuesto'

    def __str__(self):
        return f'Presupuesto {self.salida.codigo} — ${self.total_asignado:,.0f}'

    @property
    def disponible(self):
        """Saldo disponible = total asignado - ejecutado."""
        return self.total_asignado - self.ejecutado

    @property
    def porcentaje_ejecutado(self):
        """Porcentaje del presupuesto ya ejecutado."""
        if self.total_asignado == 0:
            return 0
        return round((self.ejecutado / self.total_asignado) * 100, 1)


class Gasto(models.Model):
    """
    Registro de un gasto individual dentro del presupuesto de una salida.
    """

    CATEGORIA_COMBUSTIBLE = 'combustible'
    CATEGORIA_HOSPEDAJE   = 'hospedaje'
    CATEGORIA_ALIMENTACION= 'alimentacion'
    CATEGORIA_ENTRADA     = 'entrada'
    CATEGORIA_OTRO        = 'otro'
    CATEGORIAS = [
        (CATEGORIA_COMBUSTIBLE,  'Combustible'),
        (CATEGORIA_HOSPEDAJE,    'Hospedaje'),
        (CATEGORIA_ALIMENTACION, 'Alimentación'),
        (CATEGORIA_ENTRADA,      'Entradas'),
        (CATEGORIA_OTRO,         'Otro'),
    ]

    presupuesto    = models.ForeignKey(
        Presupuesto,
        on_delete=models.CASCADE,
        related_name='gastos',
        verbose_name='Presupuesto'
    )
    categoria      = models.CharField(max_length=20, choices=CATEGORIAS, verbose_name='Categoría')
    descripcion    = models.TextField(blank=True, verbose_name='Descripción')
    monto          = models.FloatField(verbose_name='Monto (COP)')
    fecha          = models.DateField(auto_now_add=True, verbose_name='Fecha')
    registrado_por = models.ForeignKey(
        Usuario,
        null=True,
        on_delete=models.SET_NULL,
        related_name='gastos_registrados',
        verbose_name='Registrado por'
    )
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Gasto'
        ordering     = ['-created_at']

    def __str__(self):
        return f'{self.get_categoria_display()} — ${self.monto:,.0f}'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Actualizar el total ejecutado del presupuesto automáticamente
        total_ejecutado = sum(g.monto for g in self.presupuesto.gastos.all())
        self.presupuesto.ejecutado = total_ejecutado
        self.presupuesto.save(update_fields=['ejecutado'])
