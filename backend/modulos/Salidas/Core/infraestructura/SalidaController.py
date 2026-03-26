from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from modulos.Salidas.Core.infraestructura.DjangoSalidaRepository import DjangoSalidaRepository
from modulos.Salidas.Core.aplicacion.SalidaCreate.SalidaCreate import SalidaCreate
from modulos.Salidas.Core.aplicacion.SalidaEdit.SalidaEdit import SalidaEdit
from modulos.Salidas.Core.aplicacion.SalidaDelete.SalidaDelete import SalidaDelete
from modulos.Salidas.Core.aplicacion.SalidaGetAll.SalidaGetAll import SalidaGetAll

from modulos.Salidas.Itinerario.infraestructura.DjangoItinerarioRepository import DjangoItinerarioRepository
from modulos.Salidas.Itinerario.aplicacion.ItinerarioCreate.ItinerarioCreate import ItinerarioCreate

# Nuevo Módulo Hexagonal Parada
from modulos.Salidas.Itinerario.Parada.infraestructura.DjangoParadaRepository import DjangoParadaRepository
from modulos.Salidas.Itinerario.Parada.aplicacion.ParadaCreate.ParadaCreate import ParadaCreate

class SalidaController(APIView):
    def get(self, request, pk=None):
        repo = DjangoSalidaRepository()
        if pk:
            salida = repo.get_by_id(pk)
            if not salida:
                return Response({'error': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)
            
            # Serializando los VOs
            return Response({
                'id': salida.id.value,
                'codigo': salida.codigo.value,
                'nombre': salida.nombre.value,
                'estado': salida.estado.value,
                'profesor_id': salida.profesor_id.value
            })
        else:
            uso = SalidaGetAll(repository=repo)
            resultados = uso.run()
            data = [{
                'id': s.id.value, 
                'codigo': s.codigo.value, 
                'nombre': s.nombre.value, 
                'estado': s.estado.value
            } for s in resultados]
            return Response({'ok': True, 'datos': data}, status=status.HTTP_200_OK)

    def post(self, request):
        repo = DjangoSalidaRepository()
        uso = SalidaCreate(repository=repo)
        try:
            nueva_salida = uso.run(request.data)
            
            # --- Orquestación de Itinerario ---
            repo_itin = DjangoItinerarioRepository()
            itinerario_data = {
                'salida_id': nueva_salida.id.value,
                'poligonal_mapa': '{}',
                'distancia_km': request.data.get('distancia_total_km', 0.0),
                'duracion_horas': request.data.get('horas_viaje', 0.0)
            }
            itinerario_creado = ItinerarioCreate(repository=repo_itin).run(itinerario_data)
            
            # --- Orquestación de Paradas (Nuevo Módulo) ---
            repo_paradas = DjangoParadaRepository()
            
            # Puntos de Ruta (Ida y Retorno)
            ruta_ida = request.data.get('puntos_ruta_data', [])
            ruta_retorno = request.data.get('puntos_retorno_data', [])
            
            orden_global = 1
            for p in ruta_ida:
                ParadaCreate(repository=repo_paradas).run({
                    'itinerario_id': itinerario_creado.id.value,
                    'orden': orden_global,
                    'latitud': p.get('lat', 0.0),
                    'longitud': p.get('lng', 0.0),
                    'nombre': p.get('nombreParada') or p.get('nombre', 'Punto'),
                    'tipo': p.get('motivo', 'viaje'),
                    'tiempo_estimado': p.get('tiempoEstimado'),
                    'actividad': p.get('actividad'),
                    'fecha_programada': p.get('fechaProgramada'),
                    'hora_programada': p.get('horaProgramada'),
                    'notas_itinerario': p.get('notasItinerario'),
                    'icono': p.get('icono'),
                    'color': p.get('color')
                })
                orden_global += 1
                
            for p in ruta_retorno:
                ParadaCreate(repository=repo_paradas).run({
                    'itinerario_id': itinerario_creado.id.value,
                    'orden': orden_global,
                    'latitud': p.get('lat', 0.0),
                    'longitud': p.get('lng', 0.0),
                    'nombre': p.get('nombreParada') or p.get('nombre', 'Punto'),
                    'tipo': p.get('motivo', 'retorno'),
                    'tiempo_estimado': p.get('tiempoEstimado'),
                    'actividad': p.get('actividad'),
                    'fecha_programada': p.get('fechaProgramada'),
                    'hora_programada': p.get('horaProgramada'),
                    'notas_itinerario': p.get('notasItinerario'),
                    'icono': p.get('icono'),
                    'color': p.get('color')
                })
                orden_global += 1
            
            return Response({'ok': True, 'id': nueva_salida.id.value}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'ok': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({'error': 'ID requerido'}, status=status.HTTP_400_BAD_REQUEST)
        repo = DjangoSalidaRepository()
        uso = SalidaEdit(repository=repo)
        try:
            salida_actualizada = uso.run(pk, request.data)
            return Response({'ok': True, 'id': salida_actualizada.id.value}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'ok': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not pk:
            return Response({'error': 'ID requerido'}, status=status.HTTP_400_BAD_REQUEST)
        repo = DjangoSalidaRepository()
        uso = SalidaDelete(repository=repo)
        uso.run(pk)
        return Response({'ok': True}, status=status.HTTP_204_NO_CONTENT)
