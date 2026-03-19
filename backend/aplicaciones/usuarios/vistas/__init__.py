# aplicaciones/usuarios/vistas/__init__.py
# Re-exporta todas las vistas de usuarios para que urls.py no cambie.
from .autenticacion import LoginVista, BuscarProfesoresVista
from .perfil        import PerfilVista, ListaUsuariosVista, DetalleUsuarioVista

__all__ = [
    'LoginVista',
    'BuscarProfesoresVista',
    'PerfilVista',
    'ListaUsuariosVista',
    'DetalleUsuarioVista',
]
