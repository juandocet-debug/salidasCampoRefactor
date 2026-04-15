
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from modulos.Usuarios.infraestructura.UsuarioController import UsuarioController, UsuarioDetailController, UsuarioLoginController
from modulos.Catalogos.Facultad.infraestructura.FacultadController import FacultadController, CatalogoController
from modulos.Catalogos.Programa.infraestructura.ProgramaController import ProgramaController
from modulos.Catalogos.Ventana.infraestructura.VentanaController import VentanaController
from modulos.Logistica.Vehiculo.infraestructura.VehiculoController import VehiculoController
from modulos.Logistica.Vehiculo.infraestructura.VehiculoIAController import VehiculoIAController
from modulos.Logistica.Parametro.infraestructura.ParametroController import ParametroController
from modulos.Logistica.Parametro.infraestructura.ParametroConfiguracionController import ParametroConfiguracionController
from modulos.Salidas.Core.infraestructura.AdminSalidasController import AdminSalidasController, CleanupHuerfanosController
from modulos.Salidas.Core.infraestructura.OsrmProxyController import OsrmProxyController

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Rutas para Facultad
    path('api/facultades/', FacultadController.as_view()),
    path('api/facultades/<int:pk>/', FacultadController.as_view()),
    
    # Rutas para Programa
    path('api/programas/', ProgramaController.as_view()),
    path('api/programas/<int:pk>/', ProgramaController.as_view()),
    
    # Rutas para Ventana
    path('api/ventanas/', VentanaController.as_view()),
    path('api/ventanas/<int:pk>/', VentanaController.as_view()),
    
    # Rutas para Usuarios
    path('api/usuarios/', UsuarioController.as_view()),
    path('api/usuarios/<int:pk>/', UsuarioDetailController.as_view()),
    path('api/usuarios/login/', UsuarioLoginController.as_view()),
    
    # Alias de Autenticación para compatibilidad con el Frontend
    path('api/auth/login/', UsuarioLoginController.as_view()),
    
    # Endpoint masivo para el Tablero Académico
    path('api/admin/catalogos/', CatalogoController.as_view()),
    
    # Rutas para Parámetros Globales (Logística / Catálogos)
    path('api/admin/parametros/configuracion/', ParametroConfiguracionController.as_view()),
    path('api/admin/parametros/', ParametroController.as_view()),
    path('api/admin/parametros/<str:pk>/', ParametroController.as_view()),

    # Rutas para Transporte / Vehiculos
    path('api/transporte/vehiculos/', VehiculoController.as_view()),
    path('api/transporte/vehiculos/ia/', VehiculoIAController.as_view()),
    path('api/transporte/vehiculos/<str:pk>/', VehiculoController.as_view()),

    # Rutas para Salidas Core
    path('api/salidas/core/', include('modulos.Salidas.Core.infraestructura.urls')),
    path('api/salidas/planeacion/', include('modulos.Salidas.Planeacion.infraestructura.urls')),
    path('api/salidas/itinerario/', include('modulos.Salidas.Itinerario.infraestructura.urls')),
    path('api/salidas/itinerario/paradas/', include('modulos.Salidas.Itinerario.Parada.infraestructura.urls')),
    path('api/salidas/coordinacion/', include('modulos.Salidas.Coordinacion.infraestructura.urls')),
    path('api/salidas/consejo/', include('modulos.Salidas.Consejo.infraestructura.urls')),

    # Rutas para Administrador del Sistema — Gestión de Salidas
    path('api/admin/salidas/', AdminSalidasController.as_view(), name='admin-salidas-list'),
    path('api/admin/salidas/<int:pk>/', AdminSalidasController.as_view(), name='admin-salidas-detail'),

    # Proxy OSRM — evita CORS del navegador
    path('api/routing/osrm/', OsrmProxyController.as_view(), name='osrm-proxy'),

    # Limpieza de huérfanos (temporal)
    path('api/admin/limpiar-huerfanos/', CleanupHuerfanosController.as_view(), name='limpiar-huerfanos'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
