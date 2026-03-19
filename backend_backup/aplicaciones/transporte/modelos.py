# aplicaciones/transporte/modelos.py
# ─────────────────────────────────────────────────────────────────────────────
# MODELOS DE TRANSPORTE
# Vehículos disponibles y su asignación a cada salida de campo.
# ─────────────────────────────────────────────────────────────────────────────

from django.db import models
from aplicaciones.usuarios.modelos import Usuario
from aplicaciones.salidas.modelos import Salida
from aplicaciones.nucleo.constantes import Roles


class Vehiculo(models.Model):
    """Vehículo disponible para salidas de campo."""

    TIPO_BUS      = 'bus'
    TIPO_BUSETA   = 'buseta'
    TIPO_MICROBUS = 'microbus'
    TIPO_CAMIONETA= 'camioneta'
    TIPO_FURGON   = 'furgon'
    TIPOS = [
        (TIPO_BUS,       'Bus'),
        (TIPO_BUSETA,    'Buseta'),
        (TIPO_MICROBUS,  'Microbús'),
        (TIPO_CAMIONETA, 'Camioneta / Van'),
        (TIPO_FURGON,    'Furgón'),
    ]

    ESTADO_DISPONIBLE   = 'disponible'
    ESTADO_EN_SERVICIO  = 'en_servicio'
    ESTADO_MANTENIMIENTO= 'mantenimiento'
    ESTADOS = [
        (ESTADO_DISPONIBLE,    'Disponible'),
        (ESTADO_EN_SERVICIO,   'En Servicio'),
        (ESTADO_MANTENIMIENTO, 'En Mantenimiento'),
    ]

    PROPIETARIO_INSTITUCIONAL = 'institucional'
    PROPIETARIO_EXTERNO       = 'externo'
    PROPIETARIOS = [
        (PROPIETARIO_INSTITUCIONAL, 'Institucional (UPN)'),
        (PROPIETARIO_EXTERNO,       'Flota Externa'),
    ]

    COMBUSTIBLE_DIESEL   = 'diesel'
    COMBUSTIBLE_GASOLINA = 'gasolina'
    COMBUSTIBLE_GAS      = 'gas'
    COMBUSTIBLES = [
        (COMBUSTIBLE_DIESEL,   'Diésel'),
        (COMBUSTIBLE_GASOLINA, 'Gasolina'),
        (COMBUSTIBLE_GAS,      'Gas Natural'),
    ]

    placa          = models.CharField(max_length=10, unique=True, verbose_name='Placa')
    tipo           = models.CharField(max_length=15, choices=TIPOS, verbose_name='Tipo')
    marca          = models.CharField(max_length=60, blank=True, default='', verbose_name='Marca')
    modelo         = models.CharField(max_length=80, blank=True, default='', verbose_name='Modelo')
    anio           = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name='Año')
    color          = models.CharField(max_length=30, blank=True, default='', verbose_name='Color')
    numero_interno = models.CharField(max_length=20, blank=True, default='', verbose_name='N° Interno')
    capacidad      = models.PositiveSmallIntegerField(verbose_name='Capacidad (personas)')
    rendimiento_kmgal = models.FloatField(
        default=8, verbose_name='Rendimiento (km/galón)',
        help_text='Kilómetros por galón de combustible',
    )
    tipo_combustible = models.CharField(
        max_length=10, choices=COMBUSTIBLES, default=COMBUSTIBLE_DIESEL,
        verbose_name='Tipo de combustible',
    )
    propietario    = models.CharField(
        max_length=15, choices=PROPIETARIOS, default=PROPIETARIO_INSTITUCIONAL,
        verbose_name='Propietario',
    )
    estado_tecnico = models.CharField(
        max_length=20, choices=ESTADOS, default=ESTADO_DISPONIBLE,
        verbose_name='Estado técnico',
    )
    foto           = models.ImageField(upload_to='vehiculos/', blank=True, null=True, verbose_name='Foto')
    foto_url       = models.URLField(blank=True, verbose_name='URL de foto externa')
    notas          = models.TextField(blank=True, default='', verbose_name='Notas')
    creado_en      = models.DateTimeField(auto_now_add=True, verbose_name='Creado en')
    actualizado_en = models.DateTimeField(auto_now=True, verbose_name='Actualizado en')

    class Meta:
        verbose_name        = 'Vehículo'
        verbose_name_plural = 'Vehículos'
        ordering            = ['placa']

    def __str__(self):
        label = f'{self.placa} — {self.get_tipo_display()}'
        if self.marca:
            label += f' {self.marca}'
        if self.modelo:
            label += f' {self.modelo}'
        return f'{label} ({self.capacidad} pax)'


class Asignacion(models.Model):
    """
    Asignación de vehículo y conductor a una salida de campo.
    Una salida puede tener múltiples vehículos (varios registros).
    """

    TIPO_PROPIO   = 'propio'
    TIPO_EXTERNO  = 'externo'
    TIPOS_TRANSPORTE = [
        (TIPO_PROPIO,  'Vehículo propio (UPN)'),
        (TIPO_EXTERNO, 'Empresa externa'),
    ]

    salida           = models.ForeignKey(
        Salida,
        on_delete=models.CASCADE,
        related_name='asignaciones',
        verbose_name='Salida'
    )
    vehiculo         = models.ForeignKey(
        Vehiculo,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='asignaciones',
        verbose_name='Vehículo'
    )
    conductor        = models.ForeignKey(
        Usuario,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='asignaciones_conductor',
        limit_choices_to={'rol': Roles.CONDUCTOR},
        verbose_name='Conductor'
    )
    tipo_transporte  = models.CharField(
        max_length=10,
        choices=TIPOS_TRANSPORTE,
        default=TIPO_PROPIO,
        verbose_name='Tipo de transporte'
    )
    empresa_externa  = models.CharField(max_length=150, blank=True, verbose_name='Empresa externa')
    confirmado_en    = models.DateTimeField(null=True, blank=True, verbose_name='Confirmado en')

    class Meta:
        verbose_name        = 'Asignación de Transporte'
        verbose_name_plural = 'Asignaciones de Transporte'

    def __str__(self):
        vehiculo = self.vehiculo.placa if self.vehiculo else self.empresa_externa
        return f'Asignación [{vehiculo}] → {self.salida.codigo}'
