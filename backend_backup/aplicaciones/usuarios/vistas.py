# aplicaciones/usuarios/vistas.py
# DEPRECATED: Usar usuarios.vistas.autenticacion / usuarios.vistas.perfil directamente.
# Este shim se mantiene para no romper urls.py existente.
from .vistas.autenticacion import LoginVista, BuscarProfesoresVista  # noqa: F401
from .vistas.perfil        import PerfilVista, ListaUsuariosVista, DetalleUsuarioVista  # noqa: F401
