"""
ProfesorInscritosController — Adaptador de entrada.
Permite al profesor ver la lista de inscritos de su salida
y cambiar el estado de cada inscripción (autorizar/rechazar).
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from modulos.Salidas.Estudiante.aplicacion.ListarInscritos.ListarInscritosCasoUso import ListarInscritosCasoUso
from modulos.Salidas.Estudiante.aplicacion.GestionarEstado.GestionarEstadoCasoUso import GestionarEstadoCasoUso
from .DjangoEstudianteRepository import DjangoEstudianteRepository


class ProfesorInscritosController(APIView):
    permission_classes = [AllowAny]  # En prod: IsAuthenticated con rol profesor

    def get(self, request, salida_id):
        """Lista todos los inscritos de la salida con foto, firma y estado."""
        repo = DjangoEstudianteRepository()
        try:
            inscritos = ListarInscritosCasoUso(repo).ejecutar(int(salida_id))
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        return Response(inscritos)

    def patch(self, request, salida_id, inscripcion_id):
        """Cambia el estado de una inscripción: 'autorizado' o 'rechazado'."""
        nuevo_estado = request.data.get('estado', '')
        repo = DjangoEstudianteRepository()
        try:
            resultado = GestionarEstadoCasoUso(repo).ejecutar(int(inscripcion_id), nuevo_estado)
        except ValueError as e:
            return Response({'error': str(e)}, status=400)
        return Response(resultado)
