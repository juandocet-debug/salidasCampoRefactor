# dominio/transporte/valor_objetos.py  (~60 líneas)
# ⚠️  Python puro — cero Django.

from enum import Enum


class TipoVehiculo(str, Enum):
    BUS      = 'bus'
    BUSETA   = 'buseta'
    MICROBUS = 'microbus'
    CAMIONETA = 'camioneta'
    FURGON   = 'furgon'


class EstadoVehiculo(str, Enum):
    DISPONIBLE    = 'disponible'
    EN_SERVICIO   = 'en_servicio'
    MANTENIMIENTO = 'mantenimiento'


class Propietario(str, Enum):
    INSTITUCIONAL = 'institucional'   # Flota propia UPN
    EXTERNO       = 'externo'         # Empresa contratada


class TipoCombustible(str, Enum):
    DIESEL   = 'diesel'
    GASOLINA = 'gasolina'
    GAS      = 'gas'


class TipoTransporte(str, Enum):
    """Cómo se contrata el transporte para la salida."""
    PROPIO   = 'propio'
    EXTERNO  = 'externo'
