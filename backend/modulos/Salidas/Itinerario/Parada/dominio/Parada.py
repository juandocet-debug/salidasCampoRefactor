from dataclasses import dataclass
from .ParadaId import ParadaId
from .ParadaItinerarioId import ParadaItinerarioId
from .ParadaOrden import ParadaOrden
from .ParadaLatitud import ParadaLatitud
from .ParadaLongitud import ParadaLongitud
from .ParadaNombre import ParadaNombre
from .ParadaTipo import ParadaTipo

from .ParadaTiempoEstimado import ParadaTiempoEstimado
from .ParadaFecha import ParadaFecha
from .ParadaHora import ParadaHora
from .ParadaActividad import ParadaActividad
from .ParadaNotas import ParadaNotas
from .ParadaIcono import ParadaIcono
from .ParadaColor import ParadaColor

@dataclass
class Parada:
    id: ParadaId
    itinerario_id: ParadaItinerarioId
    orden: ParadaOrden
    latitud: ParadaLatitud
    longitud: ParadaLongitud
    nombre: ParadaNombre
    tipo: ParadaTipo
    tiempo_estimado: ParadaTiempoEstimado
    actividad: ParadaActividad
    fecha_programada: ParadaFecha
    hora_programada: ParadaHora
    notas_itinerario: ParadaNotas
    icono: ParadaIcono
    color: ParadaColor
