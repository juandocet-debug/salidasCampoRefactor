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
    LISTA_EJECUCION  = 'lista_ejecucion'  # Estado asignado por coordinador logístico
    EN_EJECUCION     = 'en_ejecucion'
    FINALIZADA       = 'finalizada'
    CERRADA          = 'cerrada'
    CANCELADA        = 'cancelada'
