
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from modulos.Usuarios.infraestructura.UsuarioController import UsuarioController, UsuarioDetailController, UsuarioLoginController
from modulos.Catalogos.Facultad.infraestructura.FacultadController import FacultadController, CatalogoController
from modulos.Catalogos.Programa.infraestructura.ProgramaController import ProgramaController
from modulos.Catalogos.Ventana.infraestructura.VentanaController import VentanaController

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

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
