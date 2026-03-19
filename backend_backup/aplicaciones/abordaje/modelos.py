# aplicaciones/abordaje/modelos.py
# ─────────────────────────────────────────────────────────────────────────────
# MODELOS DE ABORDAJE Y DOCUMENTOS
# Gestiona el código de verificación del estudiante y sus documentos.
# ─────────────────────────────────────────────────────────────────────────────

from django.db import models
from aplicaciones.usuarios.modelos import Usuario
from aplicaciones.salidas.modelos import Salida
from aplicaciones.nucleo.constantes import TiposDocumento


class Abordaje(models.Model):
    """
    Registro de abordaje de un estudiante a una salida de campo.
    Cada estudiante inscrito tiene un código único de verificación.
    """

    salida           = models.ForeignKey(
        Salida,
        on_delete=models.CASCADE,
        related_name='registros_abordaje',
        verbose_name='Salida'
    )
    estudiante       = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='mis_abordajes',
        verbose_name='Estudiante'
    )
    codigo           = models.CharField(
        max_length=6,
        blank=True,
        verbose_name='Código de verificación',
        help_text='6 caracteres alfanuméricos generados al activar el código'
    )
    codigo_expira_en = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Código expira en'
    )
    abordado         = models.BooleanField(default=False, verbose_name='¿Ya abordó?')
    verificado_por   = models.ForeignKey(
        Usuario,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='verificaciones_realizadas',
        verbose_name='Verificado por'
    )
    verificado_en    = models.DateTimeField(null=True, blank=True, verbose_name='Verificado en')
    foto_url         = models.URLField(blank=True, verbose_name='Foto del abordaje')

    class Meta:
        verbose_name        = 'Registro de Abordaje'
        verbose_name_plural = 'Registros de Abordaje'
        unique_together     = [('salida', 'estudiante')]   # un registro por estudiante-salida

    def __str__(self):
        estado = '✅ Abordado' if self.abordado else '⏳ Pendiente'
        return f'{self.estudiante.email} — {self.salida.codigo} [{estado}]'


class DocumentoEstudiante(models.Model):
    """
    Documento requerido del estudiante para participar en salidas.
    Ej: EPS/ARL, consentimiento, póliza de seguro.
    """

    ESTADO_VIGENTE     = 'vigente'
    ESTADO_VENCIDO     = 'vencido'
    ESTADO_NO_CARGADO  = 'no_cargado'
    ESTADOS = [
        (ESTADO_VIGENTE,    'Vigente'),
        (ESTADO_VENCIDO,    'Vencido'),
        (ESTADO_NO_CARGADO, 'No cargado'),
    ]

    estudiante        = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='mis_documentos',
        verbose_name='Estudiante'
    )
    tipo              = models.CharField(
        max_length=20,
        choices=TiposDocumento.OPCIONES,
        verbose_name='Tipo de documento'
    )
    archivo_url       = models.URLField(blank=True, verbose_name='Archivo')
    estado            = models.CharField(max_length=15, choices=ESTADOS, default=ESTADO_NO_CARGADO)
    fecha_vencimiento = models.DateField(null=True, blank=True, verbose_name='Vence el')

    class Meta:
        verbose_name        = 'Documento del Estudiante'
        verbose_name_plural = 'Documentos del Estudiante'
        unique_together     = [('estudiante', 'tipo')]

    def __str__(self):
        return f'{self.get_tipo_display()} — {self.estudiante.email} [{self.estado}]'
