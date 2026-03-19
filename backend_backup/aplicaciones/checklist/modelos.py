# aplicaciones/checklist/modelos.py
# ─────────────────────────────────────────────────────────────────────────────
# MODELO DE CHECKLIST DEL VEHÍCULO
# Lista de verificación que el conductor completa antes de salir.
# ─────────────────────────────────────────────────────────────────────────────

from django.db import models
from aplicaciones.transporte.modelos import Asignacion


class ItemChecklist(models.Model):
    """
    Ítem individual del checklist de revisión del vehículo.
    El conductor marca cada ítem como OK, NO OK o N/A antes de partir.
    """

    CATEGORIA_MECANICA   = 'mecanica'
    CATEGORIA_SEGURIDAD  = 'seguridad'
    CATEGORIA_DOCUMENTOS = 'documentos'
    CATEGORIA_CONFORT    = 'confort'
    CATEGORIAS = [
        (CATEGORIA_MECANICA,   'Mecánica'),
        (CATEGORIA_SEGURIDAD,  'Seguridad'),
        (CATEGORIA_DOCUMENTOS, 'Documentos'),
        (CATEGORIA_CONFORT,    'Confort'),
    ]

    ESTADO_OK      = 'ok'
    ESTADO_NO_OK   = 'no_ok'
    ESTADO_NA      = 'na'
    ESTADO_PENDIENTE = 'pendiente'
    ESTADOS = [
        (ESTADO_OK,       'OK'),
        (ESTADO_NO_OK,    'No OK'),
        (ESTADO_NA,       'N/A'),
        (ESTADO_PENDIENTE,'Pendiente'),
    ]

    asignacion    = models.ForeignKey(
        Asignacion,
        on_delete=models.CASCADE,
        related_name='items_checklist',
        verbose_name='Asignación'
    )
    categoria     = models.CharField(max_length=15, choices=CATEGORIAS, verbose_name='Categoría')
    item          = models.CharField(max_length=200, verbose_name='Ítem a verificar')
    estado        = models.CharField(
        max_length=10,
        choices=ESTADOS,
        default=ESTADO_PENDIENTE,
        verbose_name='Estado'
    )
    observacion   = models.TextField(blank=True, verbose_name='Observación')
    evidencia_url = models.URLField(blank=True, verbose_name='Evidencia fotográfica')

    class Meta:
        verbose_name        = 'Ítem de Checklist'
        verbose_name_plural = 'Ítems de Checklist'
        ordering            = ['categoria', 'item']

    def __str__(self):
        return f'[{self.get_categoria_display()}] {self.item} → {self.get_estado_display()}'


# ── Items predeterminados del checklist ───────────────────────────────────────
# Se insertan automáticamente al crear una asignación.
ITEMS_PREDETERMINADOS = [
    # Mecánica
    ('mecanica', 'Nivel de aceite del motor'),
    ('mecanica', 'Nivel de agua del radiador'),
    ('mecanica', 'Presión de llantas (incluida la de repuesto)'),
    ('mecanica', 'Frenos (pedal y de mano)'),
    ('mecanica', 'Luces delanteras y traseras'),
    ('mecanica', 'Dirección sin vibraciones'),
    # Seguridad
    ('seguridad', 'Extintor vigente y cargado'),
    ('seguridad', 'Botiquín de primeros auxilios completo'),
    ('seguridad', 'Triángulos de señalización'),
    ('seguridad', 'Cinturones de seguridad en buen estado'),
    ('seguridad', 'Puertas de emergencia operativas'),
    # Documentos
    ('documentos', 'Licencia de conducción vigente'),
    ('documentos', 'SOAT vigente'),
    ('documentos', 'Revisión técnico-mecánica vigente'),
    ('documentos', 'Tarjeta de propiedad'),
    # Confort
    ('confort', 'Aire acondicionado funcionando'),
    ('confort', 'Limpieza general del vehículo'),
    ('confort', 'Asientos sin daños'),
]
