# aplicaciones/presupuesto/urls.py
from django.urls import path
from . import vistas

app_name = 'presupuesto'

urlpatterns = [
    path('', vistas.PresupuestoListaVista.as_view(), name='lista'),
]
