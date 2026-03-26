from modulos.Salidas.Itinerario.dominio.ItinerarioRepository import ItinerarioRepository
from modulos.Salidas.Itinerario.dominio.PuntoParada import PuntoParada
from modulos.Salidas.Itinerario.dominio.PuntoParadaId import PuntoParadaId
from modulos.Salidas.Itinerario.dominio.ItinerarioId import ItinerarioId
from modulos.Salidas.Itinerario.dominio.PuntoParadaOrden import PuntoParadaOrden
from modulos.Salidas.Itinerario.dominio.PuntoParadaLatitud import PuntoParadaLatitud
from modulos.Salidas.Itinerario.dominio.PuntoParadaLongitud import PuntoParadaLongitud
from modulos.Salidas.Itinerario.dominio.PuntoParadaNombre import PuntoParadaNombre
from modulos.Salidas.Itinerario.dominio.PuntoParadaTipo import PuntoParadaTipo

class PuntoParadaAdd:
    def __init__(self, repository: ItinerarioRepository):
        self.repository = repository

    def run(self, data: dict) -> PuntoParada:
        # Validar existencia de Itinerario
        it_id = int(data.get('itinerario_id'))
        if not self.repository.get_by_id(it_id):
            raise ValueError(f"Itinerario {it_id} no existe.")

        nuevo_punto = PuntoParada(
            id=PuntoParadaId(data.get('id', None)),
            itinerario_id=ItinerarioId(it_id),
            orden=PuntoParadaOrden(data.get('orden', 1)),
            latitud=PuntoParadaLatitud(data.get('latitud')),
            longitud=PuntoParadaLongitud(data.get('longitud')),
            nombre=PuntoParadaNombre(data.get('nombre')),
            tipo=PuntoParadaTipo(data.get('tipo', PuntoParadaTipo.TRABAJO_CAMPO.value))
        )
        return self.repository.save_punto_parada(nuevo_punto)
