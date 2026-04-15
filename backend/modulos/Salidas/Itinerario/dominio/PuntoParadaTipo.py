from enum import Enum

class PuntoParadaTipo(str, Enum):
    SALIDA = 'salida'
    DESCANSO = 'descanso'
    TRABAJO_CAMPO = 'trabajo_campo'
    LLEGADA = 'llegada'
    VIAJE = 'viaje'
    RETORNO = 'retorno'
