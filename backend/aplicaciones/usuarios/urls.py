# aplicaciones/usuarios/urls.py
# ─────────────────────────────────────────────────────────────────────────────
# RUTAS DE LA APP USUARIOS
# ─────────────────────────────────────────────────────────────────────────────

from django.urls import path
from .vistas import PerfilVista, ListaUsuariosVista, DetalleUsuarioVista, BuscarProfesoresVista

urlpatterns = [
    path('perfil/',              PerfilVista.as_view(),            name='usuario-perfil'),
    path('buscar-profesores/',   BuscarProfesoresVista.as_view(),  name='buscar-profesores'),
    path('',                     ListaUsuariosVista.as_view(),     name='usuario-lista'),
    path('<int:pk>/',            DetalleUsuarioVista.as_view(),    name='usuario-detalle'),
]
