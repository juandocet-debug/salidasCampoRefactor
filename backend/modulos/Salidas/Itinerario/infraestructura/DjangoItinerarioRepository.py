from typing import List, Optional
from modulos.Salidas.Itinerario.dominio.ItinerarioRepository import ItinerarioRepository
from modulos.Salidas.Itinerario.dominio.Itinerario import Itinerario
from modulos.Salidas.Itinerario.dominio.ItinerarioId import ItinerarioId
from modulos.Salidas.Itinerario.dominio.ItinerarioSalidaId import ItinerarioSalidaId
from modulos.Salidas.Itinerario.dominio.ItinerarioGeoJSON import ItinerarioGeoJSON
from modulos.Salidas.Itinerario.dominio.ItinerarioDistanciaKm import ItinerarioDistanciaKm
from modulos.Salidas.Itinerario.dominio.ItinerarioDuracionHoras import ItinerarioDuracionHoras

from modulos.Salidas.Itinerario.dominio.PuntoParada import PuntoParada
from modulos.Salidas.Itinerario.dominio.PuntoParadaId import PuntoParadaId
from modulos.Salidas.Itinerario.dominio.PuntoParadaOrden import PuntoParadaOrden
from modulos.Salidas.Itinerario.dominio.PuntoParadaLatitud import PuntoParadaLatitud
from modulos.Salidas.Itinerario.dominio.PuntoParadaLongitud import PuntoParadaLongitud
from modulos.Salidas.Itinerario.dominio.PuntoParadaNombre import PuntoParadaNombre
from modulos.Salidas.Itinerario.dominio.PuntoParadaTipo import PuntoParadaTipo

try:
    from .models import ItinerarioModelo, PuntoParadaModelo
except ImportError:
    ItinerarioModelo = None
    PuntoParadaModelo = None

class DjangoItinerarioRepository(ItinerarioRepository):
    def _to_domain_itinerario(self, obj) -> Itinerario:
        return Itinerario(
            id=ItinerarioId(obj.id),
            salida_id=ItinerarioSalidaId(obj.salida_id),
            poligonal_mapa=ItinerarioGeoJSON(obj.poligonal_mapa),
            distancia_km=ItinerarioDistanciaKm(obj.distancia_km),
            duracion_horas=ItinerarioDuracionHoras(obj.duracion_horas)
        )

    def _to_domain_punto(self, obj) -> PuntoParada:
        return PuntoParada(
            id=PuntoParadaId(obj.id),
            itinerario_id=ItinerarioId(obj.itinerario_id),
            orden=PuntoParadaOrden(obj.orden),
            latitud=PuntoParadaLatitud(obj.latitud),
            longitud=PuntoParadaLongitud(obj.longitud),
            nombre=PuntoParadaNombre(obj.nombre),
            tipo=PuntoParadaTipo(obj.tipo)
        )

    def save(self, itinerario: Itinerario) -> Itinerario:
        defaults = {
            'salida_id': itinerario.salida_id.value,
            'poligonal_mapa': itinerario.poligonal_mapa.value,
            'distancia_km': itinerario.distancia_km.value,
            'duracion_horas': itinerario.duracion_horas.value
        }
        if itinerario.id.value:
            obj, _ = ItinerarioModelo.objects.update_or_create(id=itinerario.id.value, defaults=defaults)
        else:
            obj = ItinerarioModelo.objects.create(**defaults)
        return self._to_domain_itinerario(obj)

    def get_by_id(self, id_itinerario: int) -> Optional[Itinerario]:
        try:
            return self._to_domain_itinerario(ItinerarioModelo.objects.get(id=id_itinerario))
        except Exception:
            return None

    def get_all(self) -> List[Itinerario]:
        return [self._to_domain_itinerario(x) for x in ItinerarioModelo.objects.all()]

    def delete(self, id_itinerario: int) -> None:
        ItinerarioModelo.objects.filter(id=id_itinerario).delete()

    def save_punto_parada(self, punto: PuntoParada) -> PuntoParada:
        defaults = {
            'itinerario_id': punto.itinerario_id.value,
            'orden': punto.orden.value,
            'latitud': punto.latitud.value,
            'longitud': punto.longitud.value,
            'nombre': punto.nombre.value,
            'tipo': punto.tipo.value
        }
        if punto.id.value:
            obj, _ = PuntoParadaModelo.objects.update_or_create(id=punto.id.value, defaults=defaults)
        else:
            obj = PuntoParadaModelo.objects.create(**defaults)
        return self._to_domain_punto(obj)

    def get_puntos_by_itinerario(self, itinerario_id: int) -> List[PuntoParada]:
        qs = PuntoParadaModelo.objects.filter(itinerario_id=itinerario_id).order_by('orden')
        return [self._to_domain_punto(x) for x in qs]
