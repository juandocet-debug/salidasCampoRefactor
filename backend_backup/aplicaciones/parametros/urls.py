# aplicaciones/parametros/urls.py
from django.urls import path
from .vistas import ParametrosVista, CalcularCostoVista

urlpatterns = [
    path('',          ParametrosVista.as_view(),    name='parametros'),
    path('calcular/', CalcularCostoVista.as_view(), name='calcular-costo'),
]
