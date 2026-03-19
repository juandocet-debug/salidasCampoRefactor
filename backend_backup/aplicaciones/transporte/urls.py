# aplicaciones/transporte/urls.py
from django.urls import path
from . import vistas

app_name = 'transporte'

urlpatterns = [
    path('', vistas.TransporteListaVista.as_view(), name='lista'),
]
