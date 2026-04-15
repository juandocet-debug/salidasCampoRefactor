from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from modulos.Salidas.Core.infraestructura.DjangoSalidaRepository import DjangoSalidaRepository
from modulos.Salidas.Core.infraestructura.DjangoSalidaMetadataRepository import DjangoSalidaMetadataRepository
from .DjangoRevisionPedagogicaRepository import DjangoRevisionPedagogicaRepository
from modulos.Salidas.Coordinacion.aplicacion.RegistrarRevisionCasoUso import RegistrarRevisionCasoUso
from modulos.Salidas.Coordinacion.aplicacion.ListarSalidasPorRevisarCasoUso import ListarSalidasPorRevisarCasoUso
from modulos.Salidas.Coordinacion.aplicacion.ListarSalidasAprobadasCasoUso import ListarSalidasAprobadasCasoUso


class DebugSalidasController(APIView):
    """Endpoint temporal para debuggear el estado de todas las salidas."""
    permission_classes = [AllowAny]

    def get(self, request):
        repo = DjangoSalidaRepository()
        todas = repo.get_all()
        data = [{'id': s.id.value, 'codigo': s.codigo.value, 'nombre': s.nombre.value, 'estado': s.estado.value} for s in todas]
        return Response(data, status=status.HTTP_200_OK)


class SalidasPendientesCoordinadorController(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        caso_uso = ListarSalidasPorRevisarCasoUso(
            salida_repo=DjangoSalidaRepository(),
            revision_repo=DjangoRevisionPedagogicaRepository(),
            metadata_repo=DjangoSalidaMetadataRepository(),
        )
        dtos = caso_uso.ejecutar()
        return Response([dto.to_dict() for dto in dtos], status=status.HTTP_200_OK)


class SalidasAprobadasCoordinadorController(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        caso_uso = ListarSalidasAprobadasCasoUso(
            salida_repo=DjangoSalidaRepository(),
            revision_repo=DjangoRevisionPedagogicaRepository(),
            metadata_repo=DjangoSalidaMetadataRepository(),
        )
        dtos = caso_uso.ejecutar()
        return Response([dto.to_dict() for dto in dtos], status=status.HTTP_200_OK)


class RegistrarRevisionController(APIView):
    permission_classes = [AllowAny]

    def post(self, request, salida_id):
        salida_repo = DjangoSalidaRepository()
        revision_repo = DjangoRevisionPedagogicaRepository()
        caso_uso = RegistrarRevisionCasoUso(revision_repo, salida_repo)

        try:
            coordinador_id = request.data.get('coordinador_id', 1)
            caso_uso.ejecutar(salida_id, coordinador_id, request.data)
            return Response({"mensaje": "Revisión pedagógica registrada exitosamente."}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
