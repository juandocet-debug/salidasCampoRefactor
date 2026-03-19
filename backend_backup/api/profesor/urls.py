# api/profesor/urls.py
from django.urls import path
from .vistas_salidas import (
    ProfesorListaSalidasVista,
    ProfesorDetalleSalidaVista,
    ProfesorEnviarSalidaVista
)

urlpatterns = [
    # Endpoints para el Profesor -> Salidas de Campo
    path('salidas/',              ProfesorListaSalidasVista.as_view(),  name='profesor-salida-lista'),
    path('salidas/<int:pk>/',     ProfesorDetalleSalidaVista.as_view(), name='profesor-salida-detalle'),
    path('salidas/<int:pk>/enviar/', ProfesorEnviarSalidaVista.as_view(), name='profesor-salida-enviar'),
]
