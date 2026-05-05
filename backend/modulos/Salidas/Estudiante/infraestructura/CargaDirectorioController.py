"""
CargaDirectorioController — Adaptador de entrada para el Admin del Sistema.
Permite subir un CSV/Excel con la nómina estudiantil, ver el historial
y eliminar cargas anteriores.
"""
import csv
import io

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser

from modulos.Salidas.Estudiante.aplicacion.CargaDirectorio.CargaDirectorioCasoUso import (
    CargaDirectorioCasoUso,
    ListarHistorialCargasCasoUso,
    EliminarCargaCasoUso,
)
from .DjangoEstudianteRepository import DjangoEstudianteRepository


def _parsear_csv(archivo) -> list:
    """
    Parsea un archivo CSV y retorna lista de dicts.
    Columnas esperadas (case-insensitive):
      correo, password, nombre, apellido, facultad, programa
    """
    contenido = archivo.read().decode('utf-8-sig')  # utf-8-sig soporta BOM de Excel
    reader = csv.DictReader(io.StringIO(contenido))
    filas = []
    for row in reader:
        # Normalizar claves a minúsculas sin espacios
        fila_norm = {k.strip().lower(): v.strip() for k, v in row.items()}
        filas.append(fila_norm)
    return filas


class CargaDirectorioController(APIView):
    """
    GET  → historial de cargas
    POST → subir nuevo CSV (desactiva el anterior automáticamente)
    """
    permission_classes = [AllowAny]  # En prod: IsAdminUser
    parser_classes     = [MultiPartParser, FormParser]

    def get(self, request):
        repo = DjangoEstudianteRepository()
        historial = ListarHistorialCargasCasoUso(repo).ejecutar()
        return Response(historial)

    def post(self, request):
        archivo = request.FILES.get('archivo')
        if not archivo:
            return Response({'error': 'Se requiere un archivo CSV.'}, status=400)

        if not archivo.name.endswith('.csv'):
            return Response({'error': 'Solo se aceptan archivos .csv'}, status=400)

        try:
            filas = _parsear_csv(archivo)
        except Exception as e:
            return Response({'error': f'Error al parsear el archivo: {str(e)}'}, status=400)

        admin_id = getattr(getattr(request, 'user', None), 'id', None) or 0

        repo = DjangoEstudianteRepository()
        try:
            resultado = CargaDirectorioCasoUso(repo).ejecutar(filas, archivo.name, admin_id)
        except ValueError as e:
            return Response({'error': str(e)}, status=400)

        return Response(resultado, status=201)


class CargaDirectorioDetalleController(APIView):
    """
    DELETE /api/admin/directorio/{id}/ → elimina la carga y sus estudiantes
    """
    permission_classes = [AllowAny]

    def delete(self, request, pk):
        repo = DjangoEstudianteRepository()
        try:
            EliminarCargaCasoUso(repo).ejecutar(int(pk))
        except Exception as e:
            return Response({'error': str(e)}, status=400)
        return Response(status=204)
