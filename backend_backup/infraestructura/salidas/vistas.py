# infraestructura/salidas/vistas.py
# ─────────────────────────────────────────────────────────────────────────────
# ADAPTADOR DE ENTRADA — Vistas DRF del slice Salidas
#
# Estas vistas son el punto de contacto entre HTTP y la capa de aplicación.
# Responsabilidades:
#   1. Autenticar / autorizar (JWT + permisos de rol)
#   2. Deserializar el request → Comando de caso de uso
#   3. Llamar al caso de uso correspondiente
#   4. Serializar la entidad resultante → Response JSON
#   5. Capturar excepciones de dominio → HTTP 4xx apropiados
#
# NO contiene lógica de negocio. Todo lo delega al caso de uso.
# ─────────────────────────────────────────────────────────────────────────────

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from dominio.salidas.excepciones import (
    SalidaNoEncontrada,
    TransicionNoPermitida,
    SalidaSinPermiso,
)
from aplicacion.salidas.crear_salida import CrearSalidaCasoUso, CrearSalidaComando
from aplicacion.salidas.enviar_salida import EnviarSolicitudCasoUso, EnviarSolicitudComando
from aplicacion.salidas.aprobar_salida import (
    AprobarSalidaCasoUso,
    SolicitarCambiosCasoUso,
    RechazarSalidaCasoUso,
    IniciarEjecucionCasoUso,
    FinalizarSalidaCasoUso,
)
from .repositorio_django import SalidaRepositorioDjango
from .serializadores import SalidaSerializer


def _repo():
    """Factory → crea el repositorio. Facilita reemplazarlo en tests."""
    return SalidaRepositorioDjango()


# ── Salidas del Profesor ───────────────────────────────────────────────────────

class SalidaListaVista(APIView):
    """
    GET  /api/profesor/salidas/          → lista salidas del profesor autenticado
    POST /api/profesor/salidas/          → crea nueva salida (borrador)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        caso_uso = CrearSalidaCasoUso(_repo())  # reutiliza repo para listing
        salidas = _repo().listar_por_profesor(request.user.id)
        return Response(SalidaSerializer(salidas, many=True).data)

    def post(self, request):
        data = request.data
        comando = CrearSalidaComando(
            profesor_id=     request.user.id,
            nombre=          data.get('nombre', ''),
            asignatura=      data.get('asignatura', ''),
            semestre=        data.get('semestre', ''),
            facultad=        data.get('facultad', ''),
            programa=        data.get('programa', ''),
            num_estudiantes= data.get('num_estudiantes', 0),
            justificacion=   data.get('justificacion', ''),
        )
        try:
            salida = CrearSalidaCasoUso(_repo()).ejecutar(comando)
            return Response(SalidaSerializer(salida).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class EnviarSolicitudVista(APIView):
    """
    POST /api/profesor/salidas/{id}/enviar/
    Mueve la salida de BORRADOR → ENVIADA.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, salida_id: int):
        comando = EnviarSolicitudComando(
            salida_id=      salida_id,
            solicitante_id= request.user.id,
        )
        try:
            salida = EnviarSolicitudCasoUso(_repo()).ejecutar(comando)
            return Response(SalidaSerializer(salida).data)
        except SalidaNoEncontrada as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        except (TransicionNoPermitida, SalidaSinPermiso) as e:
            return Response({'error': str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


# ── Transiciones de Estado ────────────────────────────────────────────────────

class AprobarSalidaVista(APIView):
    """POST /api/coordinador/salidas/{id}/aprobar/"""
    permission_classes = [IsAuthenticated]

    def post(self, request, salida_id: int):
        try:
            salida = AprobarSalidaCasoUso(_repo()).ejecutar(salida_id)
            return Response(SalidaSerializer(salida).data)
        except SalidaNoEncontrada as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        except TransicionNoPermitida as e:
            return Response({'error': str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class RechazarSalidaVista(APIView):
    """POST /api/coordinador/salidas/{id}/rechazar/"""
    permission_classes = [IsAuthenticated]

    def post(self, request, salida_id: int):
        try:
            salida = RechazarSalidaCasoUso(_repo()).ejecutar(salida_id)
            return Response(SalidaSerializer(salida).data)
        except SalidaNoEncontrada as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        except TransicionNoPermitida as e:
            return Response({'error': str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class IniciarEjecucionVista(APIView):
    """POST /api/coordinador-salidas/salidas/{id}/iniciar-ejecucion/"""
    permission_classes = [IsAuthenticated]

    def post(self, request, salida_id: int):
        try:
            salida = IniciarEjecucionCasoUso(_repo()).ejecutar(salida_id)
            return Response(SalidaSerializer(salida).data)
        except SalidaNoEncontrada as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        except TransicionNoPermitida as e:
            return Response({'error': str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
