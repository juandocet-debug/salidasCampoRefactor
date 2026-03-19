# aplicaciones/nucleo/permisos.py
# ─────────────────────────────────────────────────────────────────────────────
# PERMISOS PERSONALIZADOS POR ROL
# Se usan en las vistas (vistas.py) con permission_classes = [EsProfesor]
# ─────────────────────────────────────────────────────────────────────────────

from rest_framework.permissions import BasePermission
from .constantes import Roles


class EsProfesor(BasePermission):
    """Solo permite acceso a usuarios con rol 'profesor' (y admins para pruebas)."""
    def has_permission(self, request, view):
        if not request.user.is_authenticated: return False
        return (request.user.rol == Roles.PROFESOR) or request.user.is_superuser or request.user.rol == Roles.ADMIN_SISTEMA


class EsCoordinadorAcademico(BasePermission):
    """Solo permite acceso a coordinadores académicos (y admins)."""
    def has_permission(self, request, view):
        if not request.user.is_authenticated: return False
        return (request.user.rol == Roles.COORDINADOR_ACADEMICO) or request.user.is_superuser or request.user.rol == Roles.ADMIN_SISTEMA


class EsConsejo(BasePermission):
    """Solo permite acceso a miembros del Consejo de Facultad (y admins)."""
    def has_permission(self, request, view):
        if not request.user.is_authenticated: return False
        return (request.user.rol == Roles.CONSEJO) or request.user.is_superuser or request.user.rol == Roles.ADMIN_SISTEMA


class EsCoordinadorSalidas(BasePermission):
    """Solo permite acceso al Coordinador de Salidas (y admins)."""
    def has_permission(self, request, view):
        if not request.user.is_authenticated: return False
        return (request.user.rol == Roles.COORDINADOR_SALIDAS) or request.user.is_superuser or request.user.rol == Roles.ADMIN_SISTEMA


class EsConductor(BasePermission):
    """Solo permite acceso a conductores (y admins)."""
    def has_permission(self, request, view):
        if not request.user.is_authenticated: return False
        return (request.user.rol == Roles.CONDUCTOR) or request.user.is_superuser or request.user.rol == Roles.ADMIN_SISTEMA


class EsEstudiante(BasePermission):
    """Solo permite acceso a estudiantes (y admins)."""
    def has_permission(self, request, view):
        if not request.user.is_authenticated: return False
        return (request.user.rol == Roles.ESTUDIANTE) or request.user.is_superuser or request.user.rol == Roles.ADMIN_SISTEMA


class EsCoordinadorOAdmin(BasePermission):
    """Permite acceso al coordinador de salidas O al admin de Django."""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return (
            request.user.rol == Roles.COORDINADOR_SALIDAS
            or request.user.is_staff
        )


class EsAdminSistema(BasePermission):
    """Solo permite acceso al Administrador del Sistema o Superusuarios."""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.rol == Roles.ADMIN_SISTEMA or request.user.is_superuser or request.user.is_staff


class EsGestorFlota(BasePermission):
    """En desarrollo: cualquier usuario autenticado puede gestionar la flota."""

    def has_permission(self, request, view):
        return request.user.is_authenticated
