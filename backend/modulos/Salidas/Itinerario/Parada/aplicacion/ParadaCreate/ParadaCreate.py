from ...dominio.ParadaRepository import ParadaRepository
from ...dominio.Parada import Parada
from ...dominio.ParadaId import ParadaId
from ...dominio.ParadaItinerarioId import ParadaItinerarioId
from ...dominio.ParadaOrden import ParadaOrden
from ...dominio.ParadaLatitud import ParadaLatitud
from ...dominio.ParadaLongitud import ParadaLongitud
from ...dominio.ParadaNombre import ParadaNombre
from ...dominio.ParadaTipo import ParadaTipo

from ...dominio.ParadaTiempoEstimado import ParadaTiempoEstimado
from ...dominio.ParadaFecha import ParadaFecha
from ...dominio.ParadaHora import ParadaHora
from ...dominio.ParadaActividad import ParadaActividad
from ...dominio.ParadaNotas import ParadaNotas
from ...dominio.ParadaIcono import ParadaIcono
from ...dominio.ParadaColor import ParadaColor

class ParadaCreate:
    def __init__(self, repository: ParadaRepository):
        self.repository = repository

    def run(self, data: dict) -> Parada:
        parada = Parada(
            id=ParadaId(data.get('id', None)),
            itinerario_id=ParadaItinerarioId(data.get('itinerario_id')),
            orden=ParadaOrden(data.get('orden', 1)),
            latitud=ParadaLatitud(data.get('latitud', 0.0)),
            longitud=ParadaLongitud(data.get('longitud', 0.0)),
            nombre=ParadaNombre(data.get('nombre', 'Punto')),
            tipo=ParadaTipo(data.get('tipo', 'trabajo_campo')),
            tiempo_estimado=ParadaTiempoEstimado(data.get('tiempo_estimado')),
            actividad=ParadaActividad(data.get('actividad')),
            fecha_programada=ParadaFecha(data.get('fecha_programada')),
            hora_programada=ParadaHora(data.get('hora_programada')),
            notas_itinerario=ParadaNotas(data.get('notas_itinerario')),
            icono=ParadaIcono(data.get('icono')),
            color=ParadaColor(data.get('color'))
        )
        return self.repository.save(parada)
