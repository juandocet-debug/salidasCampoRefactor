from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from modulos.Salidas.Itinerario.infraestructura.DjangoItinerarioRepository import DjangoItinerarioRepository
from modulos.Salidas.Itinerario.infraestructura.DjangoRutaIAAdapter import DjangoRutaIAAdapter
from modulos.Salidas.Itinerario.aplicacion.ItinerarioCreate.ItinerarioCreate import ItinerarioCreate
from modulos.Salidas.Itinerario.aplicacion.PuntoParadaAdd.PuntoParadaAdd import PuntoParadaAdd
from modulos.Salidas.Itinerario.aplicacion.AsistenteViajeIA.AsistenteViajeIA import AsistenteViajeIA
from modulos.Salidas.Itinerario.aplicacion.GenerarMunicipiosRuta.GenerarMunicipiosRuta import GenerarMunicipiosRuta
from modulos.Salidas.Itinerario.aplicacion.EstimarTiempoRuta.EstimarTiempoRuta import EstimarTiempoRuta

class ItinerarioController(APIView):
    def get(self, request, pk=None):
        repo = DjangoItinerarioRepository()
        if pk:
            entidad = repo.get_by_id(pk)
            if not entidad:
                return Response({'error': 'No encontrado'}, status=404)
            puntos = repo.get_puntos_by_itinerario(pk)
            return Response({
                'id': entidad.id.value,
                'salida_id': entidad.salida_id.value,
                'distancia_km': str(entidad.distancia_km.value),
                'puntos': [{
                    'id': p.id.value,
                    'nombre': p.nombre.value,
                    'lat': p.latitud.value,
                    'lng': p.longitud.value,
                    'tipo': p.tipo.value
                } for p in puntos]
            })
        return Response([])

    def post(self, request):
        repo = DjangoItinerarioRepository()
        try:
            nuevo = ItinerarioCreate(repository=repo).run(request.data)
            return Response({'id': nuevo.id.value}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PuntoParadaController(APIView):
    def post(self, request):
        repo = DjangoItinerarioRepository()
        try:
            nuevo_punto = PuntoParadaAdd(repository=repo).run(request.data)
            return Response({'id': nuevo_punto.id.value}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ItinerarioIAController(APIView):
    def post(self, request):
        ia_port = DjangoRutaIAAdapter()
        contexto = request.data.get('ruta_texto', '')
        try:
            respuesta = AsistenteViajeIA(ia_port=ia_port).run(contexto)
            return Response({'asistencia': respuesta}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class BuscarMunicipiosRutaController(APIView):
    def post(self, request):
        inicio = request.data.get('origen', '')
        fin = request.data.get('destino', '')
        instrucciones = request.data.get('instrucciones', '')
        
        ia_port = DjangoRutaIAAdapter()
        try:
            municipios = GenerarMunicipiosRuta(ia_port=ia_port).run(inicio, fin, instrucciones)
            return Response({'municipios': municipios}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class EstimarTiempoRutaController(APIView):
    def post(self, request):
        origen = request.data.get('origen', '')
        destino = request.data.get('destino', '')
        
        ia_port = DjangoRutaIAAdapter()
        try:
            resultado = EstimarTiempoRuta(ia_port=ia_port).run(origen, destino)
            # resultado ahora es dict: {minutos, distancia_km}
            if isinstance(resultado, dict):
                minutos      = resultado.get('minutos', 0)
                distancia_km = resultado.get('distancia_km', 0)
            else:
                minutos      = int(resultado)  # compatibilidad retroactiva
                distancia_km = 0
            return Response({
                'ok': True,
                'datos': {'minutos': minutos, 'distancia_km': distancia_km}
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'ok': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
