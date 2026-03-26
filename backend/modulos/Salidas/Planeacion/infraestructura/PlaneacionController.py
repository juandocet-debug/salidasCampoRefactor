from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from modulos.Salidas.Planeacion.infraestructura.DjangoPlaneacionRepository import DjangoPlaneacionRepository
from modulos.Salidas.Planeacion.aplicacion.PlaneacionCreate.PlaneacionCreate import PlaneacionCreate
from modulos.Salidas.Planeacion.aplicacion.PlaneacionEdit.PlaneacionEdit import PlaneacionEdit
from modulos.Salidas.Planeacion.aplicacion.PlaneacionDelete.PlaneacionDelete import PlaneacionDelete
from modulos.Salidas.Planeacion.aplicacion.PlaneacionGetAll.PlaneacionGetAll import PlaneacionGetAll

class PlaneacionController(APIView):
    def get(self, request, pk=None):
        repo = DjangoPlaneacionRepository()
        if pk:
            entidad = repo.get_by_id(pk)
            if not entidad:
                return Response({'error': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)
            return Response({
                'id': entidad.id.value,
                'salida_id': entidad.salida_id.value,
                'competencias': entidad.competencias.value,
                'requiere_guia': entidad.requiere_guia.value
            })
        else:
            resultados = PlaneacionGetAll(repository=repo).run()
            return Response([{'id': r.id.value, 'salida_id': r.salida_id.value} for r in resultados])

    def post(self, request):
        repo = DjangoPlaneacionRepository()
        try:
            nueva = PlaneacionCreate(repository=repo).run(request.data)
            return Response({'id': nueva.id.value}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk: return Response(statuss=status.HTTP_400_BAD_REQUEST)
        try:
            actualizada = PlaneacionEdit(repository=DjangoPlaneacionRepository()).run(pk, request.data)
            return Response({'id': actualizada.id.value})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not pk: return Response(status=status.HTTP_400_BAD_REQUEST)
        PlaneacionDelete(repository=DjangoPlaneacionRepository()).run(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)
