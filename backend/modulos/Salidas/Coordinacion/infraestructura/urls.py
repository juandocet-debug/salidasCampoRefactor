from django.urls import path
from .CoordinacionController import (
    SalidasPendientesCoordinadorController, 
    SalidasAprobadasCoordinadorController, 
    RegistrarRevisionController,
    DebugSalidasController
)

urlpatterns = [
    path('debug/', DebugSalidasController.as_view(), name='coordinador_debug'),
    path('pendientes/', SalidasPendientesCoordinadorController.as_view(), name='coordinador_pendientes'),
    path('aprobadas/', SalidasAprobadasCoordinadorController.as_view(), name='coordinador_aprobadas'),
    path('revision/<int:salida_id>/', RegistrarRevisionController.as_view(), name='coordinador_registrar_revision'),
]
