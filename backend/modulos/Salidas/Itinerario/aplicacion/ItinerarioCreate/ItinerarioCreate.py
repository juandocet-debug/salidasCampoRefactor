from modulos.Salidas.Itinerario.dominio.ItinerarioRepository import ItinerarioRepository
from modulos.Salidas.Itinerario.dominio.Itinerario import Itinerario
from modulos.Salidas.Itinerario.dominio.ItinerarioId import ItinerarioId
from modulos.Salidas.Itinerario.dominio.ItinerarioSalidaId import ItinerarioSalidaId
from modulos.Salidas.Itinerario.dominio.ItinerarioGeoJSON import ItinerarioGeoJSON
from modulos.Salidas.Itinerario.dominio.ItinerarioDistanciaKm import ItinerarioDistanciaKm
from modulos.Salidas.Itinerario.dominio.ItinerarioDuracionHoras import ItinerarioDuracionHoras

class ItinerarioCreate:
    def __init__(self, repository: ItinerarioRepository):
        self.repository = repository

    def run(self, data: dict) -> Itinerario:
        nuevo = Itinerario(
            id=ItinerarioId(data.get('id', None)),
            salida_id=ItinerarioSalidaId(data.get('salida_id')),
            poligonal_mapa=ItinerarioGeoJSON(data.get('poligonal_mapa', '{}')),
            distancia_km=ItinerarioDistanciaKm(data.get('distancia_km', 0.0)),
            duracion_horas=ItinerarioDuracionHoras(data.get('duracion_horas', 0.0))
        )
        return self.repository.save(nuevo)
