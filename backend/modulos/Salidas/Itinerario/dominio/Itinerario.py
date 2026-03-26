from dataclasses import dataclass
from modulos.Salidas.Itinerario.dominio.ItinerarioId import ItinerarioId
from modulos.Salidas.Itinerario.dominio.ItinerarioSalidaId import ItinerarioSalidaId
from modulos.Salidas.Itinerario.dominio.ItinerarioGeoJSON import ItinerarioGeoJSON
from modulos.Salidas.Itinerario.dominio.ItinerarioDistanciaKm import ItinerarioDistanciaKm
from modulos.Salidas.Itinerario.dominio.ItinerarioDuracionHoras import ItinerarioDuracionHoras

@dataclass
class Itinerario:
    id: ItinerarioId
    salida_id: ItinerarioSalidaId
    poligonal_mapa: ItinerarioGeoJSON
    distancia_km: ItinerarioDistanciaKm
    duracion_horas: ItinerarioDuracionHoras
