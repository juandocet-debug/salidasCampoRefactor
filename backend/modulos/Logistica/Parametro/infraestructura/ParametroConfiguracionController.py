from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .DjangoParametroRepository import DjangoParametroRepository
from modulos.Logistica.Parametro.aplicacion.ParametroGetConfiguracion.ParametroGetConfiguracion import ParametroGetConfiguracion
from modulos.Logistica.Parametro.aplicacion.ParametroUpdateConfiguracion.ParametroUpdateConfiguracion import ParametroUpdateConfiguracion

class ParametroConfiguracionController(APIView):
    def get(self, request, *args, **kwargs):
        repo = DjangoParametroRepository()
        caso_uso = ParametroGetConfiguracion(repository=repo)
        try:
            datos = caso_uso.run()
            return Response({"ok": True, "datos": datos})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        repo = DjangoParametroRepository()
        caso_uso = ParametroUpdateConfiguracion(repository=repo)
        try:
            nuevos_datos = caso_uso.run(request.data)
            return Response({"ok": True, "datos": nuevos_datos})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
