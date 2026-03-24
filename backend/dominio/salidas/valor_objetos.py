# CAPA: Dominio
# QUÉ HACE: Define los estados válidos de una Salida y sus transiciones permitidas
# NO DEBE CONTENER: imports de Django, ORM, lógica de vistas, lógica de persistencia

from enum import Enum


class EstadoSalida(str, Enum):
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


# estado_actual → {estados destino válidos}
TRANSICIONES = {
    EstadoSalida.BORRADOR:         {EstadoSalida.ENVIADA, EstadoSalida.CANCELADA},
    EstadoSalida.ENVIADA:          {EstadoSalida.EN_REVISION, EstadoSalida.CANCELADA},
    EstadoSalida.EN_REVISION:      {EstadoSalida.FAVORABLE, EstadoSalida.RECHAZADA, EstadoSalida.CANCELADA},
    EstadoSalida.FAVORABLE:        {EstadoSalida.APROBADA, EstadoSalida.PENDIENTE_AJUSTE, EstadoSalida.RECHAZADA, EstadoSalida.CANCELADA},
    EstadoSalida.PENDIENTE_AJUSTE: {EstadoSalida.AJUSTADA, EstadoSalida.CANCELADA},
    EstadoSalida.AJUSTADA:         {EstadoSalida.FAVORABLE, EstadoSalida.CANCELADA},
    EstadoSalida.APROBADA:         {EstadoSalida.EN_PREPARACION, EstadoSalida.CANCELADA},
    EstadoSalida.EN_PREPARACION:   {EstadoSalida.EN_EJECUCION, EstadoSalida.CANCELADA},
    EstadoSalida.EN_EJECUCION:     {EstadoSalida.FINALIZADA, EstadoSalida.CANCELADA},
    EstadoSalida.FINALIZADA:       {EstadoSalida.CERRADA},
    EstadoSalida.CERRADA:          set(),
    EstadoSalida.RECHAZADA:        set(),
    EstadoSalida.CANCELADA:        set(),
}
