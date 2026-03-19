# aplicaciones/salidas/modelos/salida.py
# ─────────────────────────────────────────────────────────────────────────────
# MODELO PRINCIPAL: Salida de Campo
# Entidad raíz del sistema. Todos los demás módulos referencian a este.
# ─────────────────────────────────────────────────────────────────────────────

import logging
from datetime import date, timedelta
from uuid import uuid4

from django.db import models, IntegrityError, transaction

from aplicaciones.usuarios.modelos import Usuario
from aplicaciones.nucleo.constantes import EstadosSalida, Roles

logger = logging.getLogger(__name__)

MAX_REINTENTOS_CODIGO = 5


class Salida(models.Model):
    """Salida de campo — entidad principal del sistema."""

    codigo          = models.CharField(max_length=20, unique=True, verbose_name='Código')
    nombre          = models.CharField(max_length=200, verbose_name='Nombre de la salida')
    asignatura      = models.CharField(max_length=150, blank=True, verbose_name='Asignatura')
    semestre        = models.CharField(max_length=10,  blank=True, verbose_name='Semestre')
    facultad        = models.CharField(max_length=150, blank=True, verbose_name='Facultad')
    programa        = models.CharField(max_length=150, blank=True, verbose_name='Programa académico')
    num_estudiantes = models.PositiveIntegerField(default=0, verbose_name='N° estudiantes')
    resumen             = models.CharField(max_length=255, blank=True, verbose_name='Resumen (texto tarjeta)')
    justificacion       = models.TextField(blank=True, verbose_name='Justificación')
    relacion_syllabus   = models.TextField(blank=True, verbose_name='Relación con syllabus')
    productos_esperados = models.TextField(blank=True, verbose_name='Productos esperados')

    # ── Datos de cálculo de costo (persistidos para recálculo automático) ──
    costo_estimado      = models.FloatField(default=0, verbose_name='Costo estimado (COP)')
    distancia_total_km  = models.FloatField(default=0, verbose_name='Distancia total (km)')
    duracion_dias       = models.FloatField(default=1, verbose_name='Duración (días)')
    horas_viaje         = models.FloatField(default=9, verbose_name='Horas totales de viaje')
    tipo_vehiculo_calculo = models.CharField(
        max_length=15, blank=True, default='bus',
        verbose_name='Tipo de vehículo (para cálculo)',
        help_text='bus, buseta o camioneta — determina el rendimiento',
    )

    estado = models.CharField(
        max_length=25,
        choices=EstadosSalida.OPCIONES,
        default=EstadosSalida.BORRADOR,
        verbose_name='Estado',
    )
    tipo_transporte = models.CharField(max_length=20, blank=True, verbose_name='Tipo de transporte')

    # Salida grupal
    es_grupal = models.BooleanField(default=False, verbose_name='¿Salida grupal?')
    profesores_asociados = models.ManyToManyField(
        Usuario,
        blank=True,
        related_name='salidas_asociadas',
        limit_choices_to={'rol': Roles.PROFESOR},
        verbose_name='Profesores asociados',
    )

    # Elementos visuales (UI)
    icono = models.CharField(max_length=50, blank=True, default='IcoMap', verbose_name='Icono UI')
    color = models.CharField(max_length=50, blank=True, default='#4A8DAC', verbose_name='Color UI')

    fecha_inicio = models.DateField(null=True, blank=True, verbose_name='Fecha inicio')
    fecha_fin    = models.DateField(null=True, blank=True, verbose_name='Fecha fin')
    hora_inicio  = models.TimeField(null=True, blank=True, verbose_name='Hora inicio')
    hora_fin     = models.TimeField(null=True, blank=True, verbose_name='Hora fin')

    profesor = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        related_name='mis_salidas',
        limit_choices_to={'rol': Roles.PROFESOR},
        verbose_name='Profesor',
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = 'Salida de Campo'
        verbose_name_plural = 'Salidas de Campo'
        ordering            = ['-created_at']

    def __str__(self):
        return f'{self.codigo} — {self.nombre}'

    # ── Generación segura de código SAL ──────────────────────────────────

    @staticmethod
    def _siguiente_codigo() -> str:
        """
        Calcula el próximo código secuencial SAL-{año}-{NNN}.
        Usa select_for_update() para bloqueo a nivel de fila en PostgreSQL.
        En SQLite no tiene efecto, pero el retry en save() cubre ese caso.
        """
        año = date.today().year
        prefijo = f'SAL-{año}-'
        ultima = (
            Salida.objects
            .select_for_update()
            .filter(codigo__startswith=prefijo)
            .order_by('-codigo')
            .values_list('codigo', flat=True)
            .first()
        )
        if ultima:
            try:
                num = int(ultima.split('-')[-1]) + 1
            except ValueError:
                num = Salida.objects.filter(codigo__startswith=prefijo).count() + 1
        else:
            num = 1
        return f'{prefijo}{num:03d}'

    def save(self, *args, **kwargs):
        """
        Auto-genera el código SAL-año-NNN si no existe.
        Protegido contra race conditions con retry + transaction.
        """
        if self.codigo:
            # Código ya asignado manualmente → guardar directamente.
            super().save(*args, **kwargs)
            return

        for intento in range(1, MAX_REINTENTOS_CODIGO + 1):
            try:
                with transaction.atomic():
                    self.codigo = self._siguiente_codigo()
                    super().save(*args, **kwargs)
                return  # Éxito → salir del loop
            except IntegrityError:
                logger.warning(
                    'Colisión de código SAL en intento %d/%d — reintentando…',
                    intento, MAX_REINTENTOS_CODIGO,
                )
                self.pk = None  # Resetear PK para que Django haga INSERT nuevo
                self.codigo = ''  # Limpiar para recalcular

        # Fallback: si todos los reintentos fallan, usar UUID parcial.
        año = date.today().year
        self.codigo = f'SAL-{año}-{uuid4().hex[:6].upper()}'
        logger.error('Fallback UUID usado para código: %s', self.codigo)
        super().save(*args, **kwargs)
