from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ..aplicacion.ConductorCreate.ConductorCreate import ConductorCreate
from ..aplicacion.ConductorGetAll.ConductorGetAll import ConductorGetAll
from ..aplicacion.ConductorDelete.ConductorDelete import ConductorDelete
from ..aplicacion.ConductorUpdate.ConductorUpdate import ConductorUpdate
from .DjangoConductorExternoRepository import DjangoConductorExternoRepository


class ConductorExternoController(APIView):
    """
    GET  /api/transporte/conductores/?empresa_id=X → listar conductores de empresa
    POST /api/transporte/conductores/              → crear nuevo conductor
    DELETE /api/transporte/conductores/<pk>/       → desactivar conductor (soft delete)
    """

    def get(self, request):
        try:
            empresa_id = request.query_params.get('empresa_id')
            if not empresa_id:
                return Response({"error": "Se requiere el parámetro empresa_id"}, status=status.HTTP_400_BAD_REQUEST)
            repo = DjangoConductorExternoRepository()
            resultado = ConductorGetAll(repo).run(empresa_id=int(empresa_id))
            return Response(resultado, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            repo = DjangoConductorExternoRepository()
            resultado = ConductorCreate(repo).run(
                empresa_id=int(request.data.get('empresa_id')),
                nombre=request.data.get('nombre', ''),
                cedula=request.data.get('cedula', ''),
                telefono=request.data.get('telefono'),
                licencia=request.data.get('licencia'),
            )
            return Response(resultado, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        try:
            repo = DjangoConductorExternoRepository()
            resultado = ConductorUpdate(repo).run(
                conductor_id=pk,
                nombre=request.data.get('nombre', ''),
                cedula=request.data.get('cedula', ''),
                telefono=request.data.get('telefono'),
                licencia=request.data.get('licencia'),
            )
            return Response(resultado, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            repo = DjangoConductorExternoRepository()
            resultado = ConductorDelete(repo).run(conductor_id=pk)
            return Response(resultado, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
