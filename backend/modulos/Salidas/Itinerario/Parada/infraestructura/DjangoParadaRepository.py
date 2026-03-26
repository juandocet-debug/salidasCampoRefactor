from typing import List, Optional
from ..dominio.Parada import Parada
from ..dominio.ParadaId import ParadaId
from ..dominio.ParadaItinerarioId import ParadaItinerarioId
from ..dominio.ParadaOrden import ParadaOrden
from ..dominio.ParadaLatitud import ParadaLatitud
from ..dominio.ParadaLongitud import ParadaLongitud
from ..dominio.ParadaNombre import ParadaNombre
from ..dominio.ParadaTipo import ParadaTipo

from ..dominio.ParadaTiempoEstimado import ParadaTiempoEstimado
from ..dominio.ParadaFecha import ParadaFecha
from ..dominio.ParadaHora import ParadaHora
from ..dominio.ParadaActividad import ParadaActividad
from ..dominio.ParadaNotas import ParadaNotas
from ..dominio.ParadaIcono import ParadaIcono
from ..dominio.ParadaColor import ParadaColor

from ..dominio.ParadaRepository import ParadaRepository
from .models import ParadaModelo

class DjangoParadaRepository(ParadaRepository):
    def save(self, parada: Parada) -> Parada:
        if parada.id.value is None:
            # CREATE
            model = ParadaModelo.objects.create(
                itinerario_id=parada.itinerario_id.value,
                orden=parada.orden.value,
                latitud=parada.latitud.value,
                longitud=parada.longitud.value,
                nombre=parada.nombre.value,
                tipo=parada.tipo.value,
                tiempo_estimado=parada.tiempo_estimado.value,
                actividad=parada.actividad.value,
                fecha_programada=parada.fecha_programada.value,
                hora_programada=parada.hora_programada.value,
                notas_itinerario=parada.notas_itinerario.value,
                icono=parada.icono.value,
                color=parada.color.value
            )
            parada.id = ParadaId(value=model.id)
        else:
            # UPDATE
            try:
                model = ParadaModelo.objects.get(id=parada.id.value)
                model.itinerario_id = parada.itinerario_id.value
                model.orden = parada.orden.value
                model.latitud = parada.latitud.value
                model.longitud = parada.longitud.value
                model.nombre = parada.nombre.value
                model.tipo = parada.tipo.value
                model.tiempo_estimado = parada.tiempo_estimado.value
                model.actividad = parada.actividad.value
                model.fecha_programada = parada.fecha_programada.value
                model.hora_programada = parada.hora_programada.value
                model.notas_itinerario = parada.notas_itinerario.value
                model.icono = parada.icono.value
                model.color = parada.color.value
                model.save()
            except ParadaModelo.DoesNotExist:
                raise ValueError(f"Parada con ID {parada.id.value} no existe")
        return parada

    def get_by_id(self, id: ParadaId) -> Optional[Parada]:
        try:
            model = ParadaModelo.objects.get(id=id.value)
            return Parada(
                id=ParadaId(model.id),
                itinerario_id=ParadaItinerarioId(model.itinerario_id),
                orden=ParadaOrden(model.orden),
                latitud=ParadaLatitud(model.latitud),
                longitud=ParadaLongitud(model.longitud),
                nombre=ParadaNombre(model.nombre),
                tipo=ParadaTipo(model.tipo),
                tiempo_estimado=ParadaTiempoEstimado(model.tiempo_estimado),
                actividad=ParadaActividad(model.actividad),
                fecha_programada=ParadaFecha(model.fecha_programada),
                hora_programada=ParadaHora(model.hora_programada),
                notas_itinerario=ParadaNotas(model.notas_itinerario),
                icono=ParadaIcono(model.icono),
                color=ParadaColor(model.color)
            )
        except ParadaModelo.DoesNotExist:
            return None

    def get_by_itinerario(self, itinerario_id: int) -> List[Parada]:
        models = ParadaModelo.objects.filter(itinerario_id=itinerario_id).order_by('orden')
        return [
            Parada(
                id=ParadaId(m.id),
                itinerario_id=ParadaItinerarioId(m.itinerario_id),
                orden=ParadaOrden(m.orden),
                latitud=ParadaLatitud(m.latitud),
                longitud=ParadaLongitud(m.longitud),
                nombre=ParadaNombre(m.nombre),
                tipo=ParadaTipo(m.tipo),
                tiempo_estimado=ParadaTiempoEstimado(m.tiempo_estimado),
                actividad=ParadaActividad(m.actividad),
                fecha_programada=ParadaFecha(m.fecha_programada),
                hora_programada=ParadaHora(m.hora_programada),
                notas_itinerario=ParadaNotas(m.notas_itinerario),
                icono=ParadaIcono(m.icono),
                color=ParadaColor(m.color)
            ) for m in models
        ]

    def delete(self, id: ParadaId) -> None:
        ParadaModelo.objects.filter(id=id.value).delete()
