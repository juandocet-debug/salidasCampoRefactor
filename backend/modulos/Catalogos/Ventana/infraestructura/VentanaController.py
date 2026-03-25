from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .DjangoVentanaRepository import DjangoVentanaRepository
from ..aplicacion.VentanaCreate.VentanaCreate import VentanaCreate
from ..aplicacion.VentanaGetAll.VentanaGetAll import VentanaGetAll
from ..aplicacion.VentanaEdit.VentanaEdit import VentanaEdit
from ..aplicacion.VentanaDelete.VentanaDelete import VentanaDelete

class VentanaController(APIView):
    def get(self, request, pk=None, *args, **kwargs):
        repo = DjangoVentanaRepository()
        if pk:
            pass
        else:
            caso_uso = VentanaGetAll(repository=repo)
            return Response(caso_uso.run())

    def post(self, request, *args, **kwargs):
        repo = DjangoVentanaRepository()
        caso_uso = VentanaCreate(repository=repo)
        try:
            nombre = request.data.get("nombre")
            fecha_apertura = request.data.get("fecha_apertura")
            fecha_cierre = request.data.get("fecha_cierre")
            activa = request.data.get("activa", True)
            
            if not nombre or not fecha_apertura or not fecha_cierre:
                return Response({"error": "Nombre, fecha de apertura y fecha de cierre son fijos obligatorios."}, status=status.HTTP_400_BAD_REQUEST)
                
            caso_uso.run(nombre=nombre, fecha_apertura=fecha_apertura, fecha_cierre=fecha_cierre, activa=activa)
            return Response({"message": "Ventana creada con éxito"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, *args, **kwargs):
        repo = DjangoVentanaRepository()
        caso_uso = VentanaEdit(repository=repo)
        try:
            nombre = request.data.get("nombre")
            fecha_apertura = request.data.get("fecha_apertura")
            fecha_cierre = request.data.get("fecha_cierre")
            activa = request.data.get("activa")
            
            caso_uso.run(id_val=pk, nombre=nombre, fecha_apertura=fecha_apertura, fecha_cierre=fecha_cierre, activa=activa)
            return Response({"message": "Ventana actualizada con éxito"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, *args, **kwargs):
        return self.put(request, pk, *args, **kwargs)

    def delete(self, request, pk, *args, **kwargs):
        repo = DjangoVentanaRepository()
        caso_uso = VentanaDelete(repository=repo)
        try:
            caso_uso.run(id_val=pk)
            return Response({"message": "Ventana eliminada con éxito"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
