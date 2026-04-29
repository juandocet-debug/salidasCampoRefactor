from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ..aplicacion.EmpresaCreate.EmpresaCreate import EmpresaCreate
from ..aplicacion.EmpresaGetAll.EmpresaGetAll import EmpresaGetAll
from ..aplicacion.EmpresaDelete.EmpresaDelete import EmpresaDelete
from ..aplicacion.EmpresaUpdate.EmpresaUpdate import EmpresaUpdate
from .DjangoEmpresaTransporteRepository import DjangoEmpresaTransporteRepository


class EmpresaTransporteController(APIView):
    """
    GET  /api/transporte/empresas/       → listar todas las empresas activas
    POST /api/transporte/empresas/       → crear nueva empresa
    DELETE /api/transporte/empresas/<pk>/ → desactivar empresa (soft delete)
    """

    def get(self, request):
        try:
            repo = DjangoEmpresaTransporteRepository()
            resultado = EmpresaGetAll(repo).run()
            return Response(resultado, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            repo = DjangoEmpresaTransporteRepository()
            resultado = EmpresaCreate(repo).run(
                nit=request.data.get('nit', ''),
                razon_social=request.data.get('razon_social', ''),
                telefono=request.data.get('telefono'),
                correo=request.data.get('correo'),
                contacto=request.data.get('contacto'),
            )
            return Response(resultado, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        try:
            repo = DjangoEmpresaTransporteRepository()
            resultado = EmpresaUpdate(repo).run(
                empresa_id=pk,
                nit=request.data.get('nit', ''),
                razon_social=request.data.get('razon_social', ''),
                telefono=request.data.get('telefono'),
                correo=request.data.get('correo'),
                contacto=request.data.get('contacto'),
            )
            return Response(resultado, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            repo = DjangoEmpresaTransporteRepository()
            resultado = EmpresaDelete(repo).run(empresa_id=pk)
            return Response(resultado, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
