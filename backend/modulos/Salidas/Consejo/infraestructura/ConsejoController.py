# backend/modulos/Salidas/Consejo/infraestructura/ConsejoController.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from modulos.Salidas.Core.infraestructura.DjangoSalidaRepository import DjangoSalidaRepository
from modulos.Salidas.Core.infraestructura.DjangoSalidaMetadataRepository import DjangoSalidaMetadataRepository
from modulos.Salidas.Coordinacion.infraestructura.DjangoRevisionPedagogicaRepository import DjangoRevisionPedagogicaRepository
from .DjangoConsejoRepository import DjangoConsejoRepository

from modulos.Salidas.Consejo.aplicacion.ListarSalidasConsejoCasoUso import ListarSalidasConsejoCasoUso
from modulos.Salidas.Consejo.aplicacion.RegistrarDecisionConsejoCasoUso import RegistrarDecisionConsejoCasoUso


class SalidasConsejoController(APIView):
    """
    GET /api/salidas/consejo/por-revisar/
    Lista las salidas en estado FAVORABLE pendientes de decisión,
    más las ya procesadas por el Consejo (APROBADA/RECHAZADA).
    """
    permission_classes = [AllowAny]

    def get(self, request):
        caso_uso = ListarSalidasConsejoCasoUso(
            salida_repo=DjangoSalidaRepository(),
            revision_repo=DjangoRevisionPedagogicaRepository(),
            consejo_repo=DjangoConsejoRepository(),
            metadata_repo=DjangoSalidaMetadataRepository(),
        )
        try:
            dtos = caso_uso.ejecutar()
            return Response([dto.to_dict() for dto in dtos], status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RegistrarDecisionConsejoController(APIView):
    """
    POST /api/salidas/consejo/decision/<salida_id>/
    Registra la decisión oficial del Consejo sobre una salida de campo.

    Body esperado:
    {
        "concepto_financiero": "aprobado" | "rechazado" | "ajustes",
        "observaciones": "...",
        "acta": "004-2026",
        "fecha_acta": "2026-04-15",
        "concejal_id": 1
    }
    """
    permission_classes = [AllowAny]

    def post(self, request, salida_id):
        salida_repo = DjangoSalidaRepository()
        consejo_repo = DjangoConsejoRepository()
        caso_uso = RegistrarDecisionConsejoCasoUso(consejo_repo, salida_repo)

        try:
            concejal_id = request.data.get('concejal_id', 1)  # Estático por ahora
            decision = caso_uso.ejecutar(salida_id, concejal_id, request.data)
            return Response(
                {
                    'mensaje': 'Decisión del Consejo registrada exitosamente.',
                    'concepto_financiero': decision.concepto_financiero,
                    'acta': decision.acta,
                },
                status=status.HTTP_201_CREATED
            )
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
