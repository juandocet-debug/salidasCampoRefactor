# api/admin_sistema/urls.py
# ─────────────────────────────────────────────────────────────────────────────
# Rutas BFF del Administrador del Sistema — módulo Herramientas
# ─────────────────────────────────────────────────────────────────────────────
from django.urls import path
from .vistas_herramientas import (
    AdminParametrosVista,
    AdminFacultadesVista,
    AdminFacultadDetalleVista,
    AdminProgramasVista,
    AdminProgramaDetalleVista,
    AdminVentanasVista,
    AdminVentanaDetalleVista,
    CatalogosPublicosVista,
)

urlpatterns = [
    # Parámetros del sistema (singleton)
    path('parametros/', AdminParametrosVista.as_view(), name='admin-parametros'),

    # Catálogo de Facultades
    path('facultades/',          AdminFacultadesVista.as_view(),       name='admin-facultades'),
    path('facultades/<int:pk>/', AdminFacultadDetalleVista.as_view(),  name='admin-facultad-detalle'),

    # Catálogo de Programas
    path('programas/',           AdminProgramasVista.as_view(),        name='admin-programas'),
    path('programas/<int:pk>/',  AdminProgramaDetalleVista.as_view(),  name='admin-programa-detalle'),

    # Ventanas de Programación
    path('ventanas/',            AdminVentanasVista.as_view(),         name='admin-ventanas'),
    path('ventanas/<int:pk>/',   AdminVentanaDetalleVista.as_view(),   name='admin-ventana-detalle'),

    # Catálogos públicos (para selects del frontend — sin restricción de rol)
    path('catalogos/',           CatalogosPublicosVista.as_view(),     name='admin-catalogos'),
]
