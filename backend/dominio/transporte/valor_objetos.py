# CAPA: Dominio
# QUÉ HACE: Enums del módulo transporte
# NO DEBE CONTENER: Django, ORM, lógica de vistas

from enum import Enum


class TipoVehiculo(str, Enum):
    BUS       = 'bus'
    BUSETA    = 'buseta'
    MICROBUS  = 'microbus'
    CAMIONETA = 'camioneta'
    FURGON    = 'furgon'


class TipoCombustible(str, Enum):
    DIESEL   = 'diesel'
    GASOLINA = 'gasolina'
    GAS      = 'gas'


class Propietario(str, Enum):
    INSTITUCIONAL = 'institucional'
    EXTERNO       = 'externo'


class EstadoVehiculo(str, Enum):
    DISPONIBLE    = 'disponible'
    EN_SERVICIO   = 'en_servicio'
    MANTENIMIENTO = 'mantenimiento'


class TipoTransporte(str, Enum):
    PROPIO  = 'propio'
    EXTERNO = 'externo'
