# aplicaciones/novedades/urls.py
from django.urls import path
from . import vistas

app_name = 'novedades'

urlpatterns = [
    path('', vistas.NovedadListaVista.as_view(), name='lista'),
]
