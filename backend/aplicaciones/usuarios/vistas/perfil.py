# aplicaciones/usuarios/vistas/perfil.py
# Vistas de gestión de usuarios y perfil propio.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from ..modelos import Usuario
from ..serializadores import (
    UsuarioResumenSerializador,
    UsuarioDetalleSerializador,
    CrearUsuarioSerializador,
)


class PerfilVista(generics.RetrieveUpdateAPIView):
    """
    GET  /api/usuarios/perfil/ → datos del usuario autenticado
    PUT  /api/usuarios/perfil/ → actualizar nombre, etc.
    """
    serializer_class   = UsuarioDetalleSerializador
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ListaUsuariosVista(generics.ListCreateAPIView):
    """
    GET  /api/usuarios/ → lista de usuarios (solo admin)
    POST /api/usuarios/ → crear usuario (solo admin)
    """
    queryset           = Usuario.objects.all().order_by('rol', 'email')
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CrearUsuarioSerializador
        return UsuarioResumenSerializador


class DetalleUsuarioVista(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/usuarios/:id/ → detalle de un usuario (solo admin)
    PUT    /api/usuarios/:id/ → actualizar
    DELETE /api/usuarios/:id/ → desactivar
    """
    queryset           = Usuario.objects.all()
    serializer_class   = UsuarioDetalleSerializador
    permission_classes = [IsAdminUser]
