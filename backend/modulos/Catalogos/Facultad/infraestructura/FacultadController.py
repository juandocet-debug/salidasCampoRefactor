from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .DjangoFacultadRepository import DjangoFacultadRepository
from ..aplicacion.FacultadCreate.FacultadCreate import FacultadCreate
from ..aplicacion.FacultadGetAll.FacultadGetAll import FacultadGetAll
from ..aplicacion.FacultadEdit.FacultadEdit import FacultadEdit
from ..aplicacion.FacultadDelete.FacultadDelete import FacultadDelete
from modulos.Catalogos.Programa.infraestructura.DjangoProgramaRepository import DjangoProgramaRepository
from modulos.Catalogos.Programa.aplicacion.ProgramaGetAll.ProgramaGetAll import ProgramaGetAll
from modulos.Catalogos.Ventana.infraestructura.DjangoVentanaRepository import DjangoVentanaRepository
from modulos.Catalogos.Ventana.aplicacion.VentanaGetAll.VentanaGetAll import VentanaGetAll

class FacultadController(APIView):
    def get(self, request, pk=None, *args, **kwargs):
        repo = DjangoFacultadRepository()
        if pk:
            # Lógica para un GET por ID. (Omitido por concisión de Ticket)
            pass
        else:
            caso_uso = FacultadGetAll(repository=repo)
            return Response(caso_uso.run())

    def post(self, request, *args, **kwargs):
        repo = DjangoFacultadRepository()
        caso_uso = FacultadCreate(repository=repo)
        try:
            nombre = request.data.get("nombre")
            activa = request.data.get("activa", True)
            caso_uso.run(nombre=nombre, activa=activa)
            return Response({"message": "Facultad creada con éxito"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, *args, **kwargs):
        repo = DjangoFacultadRepository()
        caso_uso = FacultadEdit(repository=repo)
        try:
            nombre = request.data.get("nombre")
            activa = request.data.get("activa")
            caso_uso.run(id_val=pk, nombre=nombre, activa=activa)
            return Response({"message": "Facultad actualizada con éxito"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, *args, **kwargs):
        return self.put(request, pk, *args, **kwargs)

    def delete(self, request, pk, *args, **kwargs):
        repo = DjangoFacultadRepository()
        caso_uso = FacultadDelete(repository=repo)
        try:
            caso_uso.run(pk)
            return Response({"message": "Facultad eliminada con éxito"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

class CatalogoController(APIView):
    def get(self, request, *args, **kwargs):
        repo = DjangoFacultadRepository()
        facultades = FacultadGetAll(repository=repo).run()
        
        repo_prog = DjangoProgramaRepository()
        programas = ProgramaGetAll(repository=repo_prog).run()
        
        repo_vent = DjangoVentanaRepository()
        ventanas = VentanaGetAll(repository=repo_vent).run()
        
        return Response({
            "ok": True,
            "datos": {
                "facultades": facultades,
                "programas": programas,
                "ventanas": ventanas
            }
        }, status=status.HTTP_200_OK)
