from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .DjangoProgramaRepository import DjangoProgramaRepository
from ..aplicacion.ProgramaCreate.ProgramaCreate import ProgramaCreate
from ..aplicacion.ProgramaGetAll.ProgramaGetAll import ProgramaGetAll
from ..aplicacion.ProgramaEdit.ProgramaEdit import ProgramaEdit
from ..aplicacion.ProgramaDelete.ProgramaDelete import ProgramaDelete

class ProgramaController(APIView):
    def get(self, request, pk=None, *args, **kwargs):
        repo = DjangoProgramaRepository()
        if pk:
            # Lógica para un GET por ID. (Omitido por concisión de Ticket)
            pass
        else:
            caso_uso = ProgramaGetAll(repository=repo)
            return Response(caso_uso.run())

    def post(self, request, *args, **kwargs):
        repo = DjangoProgramaRepository()
        caso_uso = ProgramaCreate(repository=repo)
        try:
            nombre = request.data.get("nombre")
            facultad_id = request.data.get("facultad")  # The frontend sends "facultad"
            activo = request.data.get("activo", True)
            
            if not nombre or not facultad_id:
                return Response({"error": "Nombre y facultad son obligatorios."}, status=status.HTTP_400_BAD_REQUEST)
                
            nuevo = caso_uso.run(nombre=nombre, facultad_id=int(facultad_id), activo=activo)
            return Response({"message": "Programa creado con éxito"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, *args, **kwargs):
        repo = DjangoProgramaRepository()
        caso_uso = ProgramaEdit(repository=repo)
        try:
            nombre = request.data.get("nombre")
            facultad_id = request.data.get("facultad")
            activo = request.data.get("activo") or request.data.get("estado")
            
            facultad_val = int(facultad_id) if facultad_id else None
            
            caso_uso.run(id_val=pk, nombre=nombre, facultad_id=facultad_val, activo=activo)
            return Response({"message": "Programa actualizado con éxito"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, *args, **kwargs):
        return self.put(request, pk, *args, **kwargs)

    def delete(self, request, pk, *args, **kwargs):
        repo = DjangoProgramaRepository()
        caso_uso = ProgramaDelete(repository=repo)
        try:
            caso_uso.run(id_val=pk)
            return Response({"message": "Programa eliminado con éxito"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
