# dominio/salidas/valor_objetos.py
# ─────────────────────────────────────────────────────────────────────────────
# VALOR OBJETOS del slice Salidas
#
# ¿Qué es un Valor Objeto?
# Un objeto inmutable que representa CONCEPTOS del negocio, no entidades.
# No tiene identidad propia (no tiene un ID en BD).
# Dos EstadoSalida con el mismo valor son iguales.
#
# ⚠️  CERO imports de Django aquí. Solo Python puro.
# ─────────────────────────────────────────────────────────────────────────────

from enum import Enum


class EstadoSalida(str, Enum):
    """
    Ciclo de vida completo de una salida de campo.

    Diagrama de transiciones:
        BORRADOR → ENVIADA → EN_REVISION → FAVORABLE → APROBADA
                                        ↘ PENDIENTE_AJUSTE → AJUSTADA →  (vuelve a EN_REVISION)
                                        ↘ RECHAZADA
        APROBADA → EN_PREPARACION → EN_EJECUCION → FINALIZADA → CERRADA
        Cualquier estado → CANCELADA
    """
    BORRADOR         = 'borrador'
    ENVIADA          = 'enviada'
    EN_REVISION      = 'en_revision'
    FAVORABLE        = 'favorable'
    PENDIENTE_AJUSTE = 'pendiente_ajuste'
    AJUSTADA         = 'ajustada'
    APROBADA         = 'aprobada'
    RECHAZADA        = 'rechazada'
    EN_PREPARACION   = 'en_preparacion'
    EN_EJECUCION     = 'en_ejecucion'
    FINALIZADA       = 'finalizada'
    CERRADA          = 'cerrada'
    CANCELADA        = 'cancelada'

# Definimos las transiciones permitidas fuera del enum para evitar conflicto
# con los miembros del enum (Python no permite atributos con valor mixto).
EstadoSalida._TRANSICIONES = {
    EstadoSalida.BORRADOR:         {EstadoSalida.ENVIADA},
    EstadoSalida.ENVIADA:          {EstadoSalida.EN_REVISION, EstadoSalida.CANCELADA},
    EstadoSalida.EN_REVISION:      {EstadoSalida.FAVORABLE, EstadoSalida.PENDIENTE_AJUSTE, EstadoSalida.RECHAZADA},
    EstadoSalida.FAVORABLE:        {EstadoSalida.APROBADA, EstadoSalida.RECHAZADA},
    EstadoSalida.PENDIENTE_AJUSTE: {EstadoSalida.AJUSTADA, EstadoSalida.CANCELADA},
    EstadoSalida.AJUSTADA:         {EstadoSalida.EN_REVISION},
    EstadoSalida.APROBADA:         {EstadoSalida.EN_PREPARACION, EstadoSalida.CANCELADA},
    EstadoSalida.EN_PREPARACION:   {EstadoSalida.EN_EJECUCION, EstadoSalida.CANCELADA},
    EstadoSalida.EN_EJECUCION:     {EstadoSalida.FINALIZADA},
    EstadoSalida.FINALIZADA:       {EstadoSalida.CERRADA},
    EstadoSalida.RECHAZADA:        set(),
    EstadoSalida.CERRADA:          set(),
    EstadoSalida.CANCELADA:        set(),
}


class ConceptoRevision(str, Enum):
    """Concepto emitido por el Coordinador Académico."""
    FAVORABLE    = 'favorable'
    CON_AJUSTES  = 'favorable_con_ajustes'
    NO_FAVORABLE = 'no_favorable'


class DecisionConsejo(str, Enum):
    """Decisión del Consejo de Facultad."""
    APROBAR           = 'aprobada'
    SOLICITAR_CAMBIOS = 'solicitar_cambios'
    RECHAZAR          = 'rechazada'


class TipoVehiculo(str, Enum):
    """Tipo de vehículo — afecta el rendimiento en el cálculo de costos."""
    BUS      = 'bus'
    BUSETA   = 'buseta'
    CAMIONETA = 'camioneta'


class ParametrosCosto:
    """
    Valor objeto que agrupa los 4 parámetros configurables para calcular
    el costo estimado de una salida.

    Fórmula:
        C_total = (DT/R · Pg) + (max(0.5, D-0.5) · C_noche) + (max(0, Ht-9D) · C_hora)

    Defaults del sistema:
        Pg      = 16.500 COP/galón
        R       = 8 km/galón
        C_noche = 222.000 COP/noche
        C_hora  = 11.000 COP/hora extra
    """
    DEFAULTS = {
        'precio_galon':      16_500.0,
        'rendimiento_km_gal': 8.0,
        'costo_noche':       222_000.0,
        'costo_hora_extra':   11_000.0,
    }

    def __init__(
        self,
        precio_galon: float      = DEFAULTS['precio_galon'],
        rendimiento_km_gal: float = DEFAULTS['rendimiento_km_gal'],
        costo_noche: float       = DEFAULTS['costo_noche'],
        costo_hora_extra: float  = DEFAULTS['costo_hora_extra'],
    ):
        if rendimiento_km_gal <= 0:
            raise ValueError('El rendimiento del vehículo debe ser mayor que cero.')
        self.precio_galon      = precio_galon
        self.rendimiento_km_gal = rendimiento_km_gal
        self.costo_noche       = costo_noche
        self.costo_hora_extra  = costo_hora_extra

    @classmethod
    def por_defecto(cls) -> 'ParametrosCosto':
        return cls()
