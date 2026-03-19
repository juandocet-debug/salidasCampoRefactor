# aplicaciones/salidas/modelos/aprobacion.py
# ─────────────────────────────────────────────────────────────────────────────
# MODELOS DEL FLUJO DE APROBACIÓN
# Revisión del Coordinador Académico → Decisión del Consejo de Facultad.
# ─────────────────────────────────────────────────────────────────────────────

from django.db import models

from aplicaciones.usuarios.modelos import Usuario
from aplicaciones.nucleo.constantes import (
    Roles,
    ConceptoRevision,
    DecisionConsejo as OpcionesDecision,
)
from .salida import Salida


# ─── REVISIÓN DEL COORDINADOR ACADÉMICO ──────────────────────────────────────

class Revision(models.Model):
    """
    Concepto del Coordinador Académico sobre una salida.
    Se crea cuando el coordinador revisa una salida enviada.
    """

    salida      = models.ForeignKey(Salida, on_delete=models.CASCADE, related_name='revisiones')
    coordinador = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        related_name='revisiones_emitidas',
        limit_choices_to={'rol': Roles.COORDINADOR_ACADEMICO},
        verbose_name='Coordinador',
    )
    concepto = models.CharField(
        max_length=30,
        choices=ConceptoRevision.OPCIONES,
        blank=True,
        verbose_name='Concepto',
    )
    observaciones = models.TextField(blank=True, verbose_name='Observaciones generales')
    created_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Revisión de Coordinador'
        ordering     = ['-created_at']

    def __str__(self):
        return f'Revisión {self.concepto} — {self.salida.codigo}'


class CriterioRevision(models.Model):
    """Criterio individual dentro de una revisión del coordinador."""

    revision    = models.ForeignKey(Revision, on_delete=models.CASCADE, related_name='criterios')
    criterio    = models.CharField(max_length=200, verbose_name='Criterio')
    cumple      = models.BooleanField(default=False, verbose_name='¿Cumple?')
    observacion = models.TextField(blank=True, verbose_name='Observación')

    class Meta:
        verbose_name = 'Criterio de Revisión'

    def __str__(self):
        estado = '✅' if self.cumple else '❌'
        return f'{estado} {self.criterio[:60]}'


# ─── DECISIÓN DEL CONSEJO DE FACULTAD ────────────────────────────────────────

class DecisionConsejo(models.Model):
    """
    Decisión del Consejo de Facultad sobre una salida.
    Se registra después de la revisión del coordinador académico.
    """

    salida = models.ForeignKey(Salida, on_delete=models.CASCADE, related_name='decisiones')
    decision = models.CharField(
        max_length=25,
        choices=OpcionesDecision.OPCIONES,
        verbose_name='Decisión',
    )
    tiempo_ajuste_dias = models.PositiveSmallIntegerField(
        default=0,
        verbose_name='Días para ajuste',
        help_text='Solo aplica si la decisión es solicitar_cambios',
    )
    observaciones = models.TextField(blank=True, verbose_name='Observaciones')
    decidido_por  = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        related_name='decisiones_emitidas',
        limit_choices_to={'rol': Roles.CONSEJO},
        verbose_name='Decidido por',
    )
    decided_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Decisión del Consejo'
        ordering     = ['-decided_at']

    def __str__(self):
        return f'Decisión {self.decision} — {self.salida.codigo}'
