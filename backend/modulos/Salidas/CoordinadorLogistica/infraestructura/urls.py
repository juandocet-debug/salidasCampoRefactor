from django.urls import path
from .CoordinadorLogisticaController import (
    PendientesLogisticaController,
    AsignarTransporteController,
    MonitorNovedadesController,
    CerrarOperacionController
)

urlpatterns = [
    # GET /api/salidas/logistica/pendientes/
    path('pendientes/', PendientesLogisticaController.as_view(), name='logistica-pendientes'),
    
    # POST /api/salidas/logistica/asignar/
    path('asignar/', AsignarTransporteController.as_view(), name='logistica-asignar'),
    
    # POST /api/salidas/logistica/novedad/
    path('novedad/', MonitorNovedadesController.as_view(), name='logistica-novedad'),
    
    # POST /api/salidas/logistica/cierre/
    path('cierre/', CerrarOperacionController.as_view(), name='logistica-cierre'),
]
