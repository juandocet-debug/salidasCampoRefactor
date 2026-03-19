# aplicaciones/salidas/urls.py
# ─────────────────────────────────────────────────────────────────────────────
# URLs LEGACY para el módulo de Salidas.
# La lógica real está en api/profesor/ y api/coordinador/ (BFF por rol).
# Estas rutas dan compatibilidad temporal mientras se migra completamente.
# ─────────────────────────────────────────────────────────────────────────────

from django.urls import path
from . import vistas

app_name = 'salidas'

urlpatterns = [
    path('',         vistas.SalidaListaVista.as_view(),    name='lista'),
    path('<int:pk>/', vistas.SalidaDetalleVista.as_view(), name='detalle'),
]
