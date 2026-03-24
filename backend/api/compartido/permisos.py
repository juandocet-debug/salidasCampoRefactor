# CAPA: API — Compartido
# QUÉ HACE: Clases de permisos DRF reutilizables por todos los BFFs
# NO DEBE CONTENER: lógica de negocio, ORM, queries a BD

from rest_framework.permissions import BasePermission
from dominio.compartido.constantes import Rol


class EsProfesor(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'rol') and
            request.user.rol == Rol.PROFESOR.value
        )


class EsCoordinador(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'rol') and
            request.user.rol == Rol.COORDINADOR.value
        )


class EsConductor(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'rol') and
            request.user.rol == Rol.CONDUCTOR.value
        )


class EsAdminSistema(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'rol') and
            request.user.rol == Rol.ADMIN_SISTEMA.value
        )
