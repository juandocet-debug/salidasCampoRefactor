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

class ParadaEdit:
    def __init__(self, repository: ParadaRepository):
        self.repository = repository

    def run(self, id: int, data: dict) -> Parada:
        parada_id = ParadaId(id)
        existente = self.repository.get_by_id(parada_id)
        if not existente:
            raise ValueError(f"La Parada con ID {id} no existe")
            
        parada_modificada = Parada(
            id=parada_id,
            itinerario_id=ParadaItinerarioId(data.get('itinerario_id', existente.itinerario_id.value)),
            orden=ParadaOrden(data.get('orden', existente.orden.value)),
            latitud=ParadaLatitud(data.get('latitud', existente.latitud.value)),
            longitud=ParadaLongitud(data.get('longitud', existente.longitud.value)),
            nombre=ParadaNombre(data.get('nombre', existente.nombre.value)),
            tipo=ParadaTipo(data.get('tipo', existente.tipo.value)),
            tiempo_estimado=ParadaTiempoEstimado(data.get('tiempo_estimado', existente.tiempo_estimado.value)),
            actividad=ParadaActividad(data.get('actividad', existente.actividad.value)),
            fecha_programada=ParadaFecha(data.get('fecha_programada', existente.fecha_programada.value)),
            hora_programada=ParadaHora(data.get('hora_programada', existente.hora_programada.value)),
            notas_itinerario=ParadaNotas(data.get('notas_itinerario', existente.notas_itinerario.value)),
            icono=ParadaIcono(data.get('icono', existente.icono.value)),
            color=ParadaColor(data.get('color', existente.color.value))
        )
        return self.repository.save(parada_modificada)
