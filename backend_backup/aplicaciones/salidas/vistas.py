# aplicaciones/salidas/vistas.py
# Vistas mínimas legacy para que las URLs del módulo salidas funcionen.
# La lógica real está en el BFF por rol (api/profesor/, api/coordinador/).

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .modelos import Salida
from .serializadores import SalidaListaSerializador, SalidaDetalleSerializador


class SalidaListaVista(generics.ListAPIView):
    """Lista de salidas — solo lectura, compatible con roles."""
    permission_classes = [IsAuthenticated]
    serializer_class   = SalidaListaSerializador

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'rol') and user.rol == 'profesor':
            return Salida.objects.filter(profesor=user)
        return Salida.objects.all()


class SalidaDetalleVista(generics.RetrieveAPIView):
    """Detalle de una salida — solo lectura."""
    permission_classes = [IsAuthenticated]
    serializer_class   = SalidaDetalleSerializador
    queryset           = Salida.objects.all()
