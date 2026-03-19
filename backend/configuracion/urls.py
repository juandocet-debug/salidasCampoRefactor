# configuracion/urls.py
# ─────────────────────────────────────────────────────────────────────────────
# URLS RAÍZ DEL PROYECTO
# Aquí se registran todas las rutas de cada aplicación bajo el prefijo /api/
# ─────────────────────────────────────────────────────────────────────────────

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from aplicaciones.usuarios.vistas import LoginVista

urlpatterns = [

    # ── Panel de administración de Django (solo para superusuarios) ───────────
    path('admin/', admin.site.urls),

    # ── Autenticación JWT ─────────────────────────────────────────────────────
    path('api/auth/login/',   LoginVista.as_view(),        name='login'),
    path('api/auth/renovar/', TokenRefreshView.as_view(),  name='renovar-token'),

    # ── Rutas BFF por Rol (ACTIVAS — endpoints oficiales) ───────────────────
    path('api/profesor/',     include('api.profesor.urls')),
    path('api/coordinador/',  include('api.coordinador.urls')),
    path('api/conductor/',    include('api.conductor.urls')),
    path('api/admin/',        include('api.admin_sistema.urls')),

    # ── Rutas Legacy (DEPRECATED — migrar gradualmente al BFF de arriba) ──
    path('api/usuarios/',     include('aplicaciones.usuarios.urls')),
    path('api/salidas/',      include('aplicaciones.salidas.urls')),
    path('api/parametros/',   include('aplicaciones.parametros.urls')),
    path('api/transporte/',   include('aplicaciones.transporte.urls')),
    path('api/presupuesto/',  include('aplicaciones.presupuesto.urls')),
    path('api/abordaje/',     include('aplicaciones.abordaje.urls')),
    path('api/novedades/',    include('aplicaciones.novedades.urls')),
    path('api/checklist/',    include('aplicaciones.checklist.urls')),
    path('api/nucleo/',       include('aplicaciones.nucleo.urls')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
