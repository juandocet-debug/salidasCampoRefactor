# aplicaciones/abordaje/urls.py
from django.urls import path
from . import vistas

app_name = 'abordaje'

urlpatterns = [
    path('', vistas.AbordajeListaVista.as_view(), name='lista'),
]
