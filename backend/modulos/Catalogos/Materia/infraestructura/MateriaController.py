from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .DjangoMateriaRepository import DjangoMateriaRepository
from ..aplicacion.MateriaCreate.MateriaCreate import MateriaCreate
from ..aplicacion.MateriaGetAll.MateriaGetAll import MateriaGetAll
from ..aplicacion.MateriaEdit.MateriaEdit import MateriaEdit
from ..aplicacion.MateriaDelete.MateriaDelete import MateriaDelete


class MateriaController(APIView):

    def get(self, request, pk=None, *args, **kwargs):
        repo = DjangoMateriaRepository()
        if pk:
            materia = repo.get_by_id(__import__(
                'modulos.Catalogos.Materia.dominio.MateriaId',
                fromlist=['MateriaId']
            ).MateriaId(value=pk))
            if not materia:
                return Response({"error": "Materia no encontrada"}, status=status.HTTP_404_NOT_FOUND)
            return Response({
                "id": materia.id.value,
                "nombre": materia.nombre.value,
                "codigo": materia.codigo.value,
                "activa": materia.activa.value,
                "programa_id": materia.programa_id,
                "programa_nombre": materia.programa_nombre,
            })
        else:
            programa_id = request.query_params.get("programa_id")
            caso_uso = MateriaGetAll(repository=repo)
            return Response(caso_uso.run(
                programa_id=int(programa_id) if programa_id else None
            ))

    def post(self, request, *args, **kwargs):
        repo = DjangoMateriaRepository()
        caso_uso = MateriaCreate(repository=repo)
        try:
            nombre      = request.data.get("nombre")
            codigo      = request.data.get("codigo")
            programa_id = request.data.get("programa_id")
            activa      = request.data.get("activa", True)

            if not nombre or not codigo or not programa_id:
                return Response(
                    {"error": "nombre, codigo y programa_id son obligatorios."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            caso_uso.run(nombre=nombre, codigo=codigo, programa_id=int(programa_id), activa=activa)
            return Response({"message": "Materia creada con éxito"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback; traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, pk, *args, **kwargs):
        repo = DjangoMateriaRepository()
        caso_uso = MateriaEdit(repository=repo)
        try:
            caso_uso.run(
                id_val=pk,
                nombre=request.data.get("nombre"),
                codigo=request.data.get("codigo"),
                activa=request.data.get("activa"),
                programa_id=request.data.get("programa_id"),
            )
            return Response({"message": "Materia actualizada con éxito"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback; traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, pk, *args, **kwargs):
        return self.patch(request, pk, *args, **kwargs)

    def delete(self, request, pk, *args, **kwargs):
        repo = DjangoMateriaRepository()
        caso_uso = MateriaDelete(repository=repo)
        try:
            caso_uso.run(id_val=pk)
            return Response({"message": "Materia eliminada con éxito"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback; traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
