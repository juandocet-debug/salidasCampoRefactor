from dataclasses import dataclass
from modulos.Salidas.Itinerario.dominio.PuntoParadaId import PuntoParadaId
from modulos.Salidas.Itinerario.dominio.ItinerarioId import ItinerarioId
from modulos.Salidas.Itinerario.dominio.PuntoParadaOrden import PuntoParadaOrden
from modulos.Salidas.Itinerario.dominio.PuntoParadaLatitud import PuntoParadaLatitud
from modulos.Salidas.Itinerario.dominio.PuntoParadaLongitud import PuntoParadaLongitud
from modulos.Salidas.Itinerario.dominio.PuntoParadaNombre import PuntoParadaNombre
from modulos.Salidas.Itinerario.dominio.PuntoParadaTipo import PuntoParadaTipo

@dataclass
class PuntoParada:
    id: PuntoParadaId
    itinerario_id: ItinerarioId
    orden: PuntoParadaOrden
    latitud: PuntoParadaLatitud
    longitud: PuntoParadaLongitud
    nombre: PuntoParadaNombre
    tipo: PuntoParadaTipo
