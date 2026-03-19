# aplicaciones/abordaje/vistas.py
# Vista stub de compatibilidad legacy — la lógica real está en el BFF (api/).
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class AbordajeListaVista(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'ok': True, 'datos': [], 'mensaje': 'Usar /api/coordinador/ o /api/conductor/'})
