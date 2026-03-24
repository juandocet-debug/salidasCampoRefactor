from django.urls import path
from .municipios import municipios_en_ruta
from .vehiculo_ia import asistente_vehiculo

urlpatterns = [
    path('municipios-en-ruta/', municipios_en_ruta, name='municipios-en-ruta'),
    path('rendimiento-vehiculo/', asistente_vehiculo, name='rendimiento-vehiculo'),
]
