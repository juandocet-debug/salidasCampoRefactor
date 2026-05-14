from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from ..aplicacion.CargaDirectorio.ListarDirectorioActivoCasoUso import ListarDirectorioActivoCasoUso
from ..aplicacion.CargaDirectorio.EditarEstudianteDirectorioCasoUso import EditarEstudianteDirectorioCasoUso
from .DjangoEstudianteRepository import DjangoEstudianteRepository

class DirectorioActivoController(APIView):
    """GET /api/admin/directorio/activos/ -> Retorna estudiantes del directorio activo."""
    permission_classes = [AllowAny]

    def get(self, request):
        repo = DjangoEstudianteRepository()
        estudiantes = ListarDirectorioActivoCasoUso(repo).ejecutar()
        return Response(estudiantes, status=200)


class DirectorioEstudianteEditController(APIView):
    """PUT /api/admin/directorio/estudiantes/<id>/ -> Edita un estudiante."""
    permission_classes = [AllowAny]

    def put(self, request, pk):
        repo = DjangoEstudianteRepository()
        try:
            resultado = EditarEstudianteDirectorioCasoUso(repo).ejecutar(int(pk), request.data)
            return Response(resultado, status=200)
        except ValueError as e:
            return Response({"error": str(e)}, status=400)
