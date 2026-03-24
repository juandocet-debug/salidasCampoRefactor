
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from api.compartido.auth import login as auth_login
from api.admin_sistema.catalogos.crud_vistas import FacultadViewSet, ProgramaViewSet

crud_router = DefaultRouter()
crud_router.register(r'api/admin/facultades', FacultadViewSet, basename='crud-facultades')
crud_router.register(r'api/admin/programas', ProgramaViewSet, basename='crud-programas')

urlpatterns = [
    path('admin/', admin.site.urls),

    # ── Auth ───────────────────────────────────────────────────────────────
    path('api/auth/login/', auth_login, name='auth-login'),

    # ── JWT ────────────────────────────────────────────────────────────────
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ── BFF por rol ───────────────────────────────────────────────────────
    path('api/profesor/salidas/', include('api.profesor.salidas.urls')),
    path('api/admin/catalogos/', include('api.admin_sistema.catalogos.urls')),
    path('api/admin/parametros/', include('api.admin_sistema.parametros.urls')),
    path('api/transporte/', include('api.transporte.urls')),
    # path('api/coordinador/',  include('api.coordinador.urls')),
    # path('api/conductor/',    include('api.conductor.urls')),
    # path('api/admin/',        include('api.admin_sistema.urls')),
    
    # ── Nucleo IA ─────────────────────────────────────────────────────────
    path('api/nucleo/', include('api.nucleo.urls')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + crud_router.urls
