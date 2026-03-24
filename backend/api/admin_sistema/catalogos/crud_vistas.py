# CAPA: API — BFF Admin Sistema
# QUÉ HACE: Controladores REST para catálogos que delegan en Casos de Uso
# NO DEBE CONTENER: ORM, Models, Serializers de Django Rest Framework

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny # Temporalmente relajado según instrucciones
from aplicacion.parametros.inyeccion import proveer_gestionar_facultades, proveer_gestionar_programas

class FacultadViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        cu = proveer_gestionar_facultades()
        facultad = cu.crear(request.data)
        return Response({
            'id': facultad.id, 
            'nombre': facultad.nombre, 
            'activa': getattr(facultad, 'activa', True)
        }, status=status.HTTP_201_CREATED)

    def partial_update(self, request, pk=None):
        cu = proveer_gestionar_facultades()
        facultad = cu.actualizar(pk, request.data)
        return Response({
            'id': facultad.id, 
            'nombre': facultad.nombre, 
            'activa': getattr(facultad, 'activa', True)
        }, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        cu = proveer_gestionar_facultades()
        cu.eliminar(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProgramaViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        cu = proveer_gestionar_programas()
        programa = cu.crear(request.data)
        return Response({
            'id': programa.id, 
            'nombre': programa.nombre, 
            'facultad_id': programa.facultad_id,
            'activo': getattr(programa, 'activo', True)
        }, status=status.HTTP_201_CREATED)

    def partial_update(self, request, pk=None):
        cu = proveer_gestionar_programas()
        programa = cu.actualizar(pk, request.data)
        return Response({
            'id': programa.id, 
            'nombre': programa.nombre, 
            'facultad_id': programa.facultad_id,
            'activo': getattr(programa, 'activo', True)
        }, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        cu = proveer_gestionar_programas()
        cu.eliminar(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)
