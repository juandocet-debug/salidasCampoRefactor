from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .DjangoParadaRepository import DjangoParadaRepository
from ..aplicacion.ParadaCreate.ParadaCreate import ParadaCreate
from ..aplicacion.ParadaEdit.ParadaEdit import ParadaEdit
from ..aplicacion.ParadaDelete.ParadaDelete import ParadaDelete
from ..aplicacion.ParadaGetAll.ParadaGetAll import ParadaGetAll

class ParadaController(APIView):
    def get(self, request, pk=None):
        repo = DjangoParadaRepository()
        if pk:
            parada = repo.get_by_id(pk) # wait
            # Para simplificar la API, usamos pk para identificar
            pass
            return Response({'error': 'Not implemented for single id without Itinerario context'}, status=400)
            
        else:
            itinerario_id = request.query_params.get('itinerario_id')
            if not itinerario_id:
                return Response({'error': 'Falta parametro itinerario_id'}, status=status.HTTP_400_BAD_REQUEST)
                
            uso = ParadaGetAll(repository=repo)
            try:
                resultados = uso.run(int(itinerario_id))
                data = [{
                    'id': p.id.value,
                    'itinerario_id': p.itinerario_id.value,
                    'orden': p.orden.value,
                    'latitud': p.latitud.value,
                    'longitud': p.longitud.value,
                    'nombre': p.nombre.value,
                    'tipo': p.tipo.value,
                    'tiempo_estimado': p.tiempo_estimado.value,
                    'actividad': p.actividad.value,
                    'fecha_programada': p.fecha_programada.value,
                    'hora_programada': p.hora_programada.value,
                    'notas_itinerario': p.notas_itinerario.value,
                    'icono': p.icono.value,
                    'color': p.color.value
                } for p in resultados]
                return Response({'ok': True, 'datos': data}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        repo = DjangoParadaRepository()
        uso = ParadaCreate(repository=repo)
        try:
            parada = uso.run(request.data)
            return Response({'ok': True, 'id': parada.id.value}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'ok': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({'error': 'ID requerido'}, status=status.HTTP_400_BAD_REQUEST)
        repo = DjangoParadaRepository()
        uso = ParadaEdit(repository=repo)
        try:
            parada = uso.run(pk, request.data)
            return Response({'ok': True, 'id': parada.id.value}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'ok': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not pk:
            return Response({'error': 'ID requerido'}, status=status.HTTP_400_BAD_REQUEST)
        repo = DjangoParadaRepository()
        uso = ParadaDelete(repository=repo)
        try:
            uso.run(pk)
            return Response({'ok': True}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'ok': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
