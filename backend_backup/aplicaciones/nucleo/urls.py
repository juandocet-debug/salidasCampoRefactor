# aplicaciones/nucleo/urls.py
from django.urls import path
from .vistas.ia import municipios_en_ruta, rendimiento_vehiculo, tiempo_ruta

urlpatterns = [
    path('municipios-en-ruta/',   municipios_en_ruta,    name='municipios-en-ruta'),
    path('rendimiento-vehiculo/', rendimiento_vehiculo,  name='rendimiento-vehiculo'),
    path('tiempo-ruta/',          tiempo_ruta,           name='tiempo-ruta'),
]
