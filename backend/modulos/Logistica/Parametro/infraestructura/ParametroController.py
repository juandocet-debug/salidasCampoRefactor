from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .DjangoParametroRepository import DjangoParametroRepository
from modulos.Logistica.Parametro.aplicacion.ParametroCreate.ParametroCreate import ParametroCreate
from modulos.Logistica.Parametro.aplicacion.ParametroEdit.ParametroEdit import ParametroEdit
from modulos.Logistica.Parametro.aplicacion.ParametroDelete.ParametroDelete import ParametroDelete
from modulos.Logistica.Parametro.aplicacion.ParametroGetAll.ParametroGetAll import ParametroGetAll
from modulos.Logistica.Parametro.aplicacion.ParametroGetConfiguracion.ParametroGetConfiguracion import ParametroGetConfiguracion
from modulos.Logistica.Parametro.aplicacion.ParametroUpdateConfiguracion.ParametroUpdateConfiguracion import ParametroUpdateConfiguracion

class ParametroController(APIView):
    def get(self, request, pk=None, *args, **kwargs):
        repo = DjangoParametroRepository()
        if pk:
            pass # Detalle omitido por brevedad
        else:
            caso_uso = ParametroGetAll(repository=repo)
            try:
                datos = caso_uso.run()
                return Response(datos, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        repo = DjangoParametroRepository()
        caso_uso = ParametroCreate(repository=repo)
        try:
            dato = caso_uso.run(
                clave=request.data.get('clave'),
                nombre=request.data.get('nombre'),
                valor=str(request.data.get('valor')),
                descripcion=request.data.get('descripcion', ''),
                categoria=request.data.get('categoria', 'Global')
            )
            return Response(dato, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None, *args, **kwargs):
        if not pk:
            return Response({"error": "ID requerido"}, status=status.HTTP_400_BAD_REQUEST)
        repo = DjangoParametroRepository()
        try:
            caso_uso_edit = ParametroEdit(repository=repo)
            data = caso_uso_edit.run(
                id_val=pk,
                clave=request.data.get('clave'),
                nombre=request.data.get('nombre'),
                valor=str(request.data.get('valor')) if 'valor' in request.data else None,
                descripcion=request.data.get('descripcion'),
                categoria=request.data.get('categoria')
            )
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None, *args, **kwargs):
        if not pk:
            return Response({"error": "ID requerido"}, status=status.HTTP_400_BAD_REQUEST)
        repo = DjangoParametroRepository()
        try:
            caso_uso = ParametroDelete(repository=repo)
            caso_uso.run(pk)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
