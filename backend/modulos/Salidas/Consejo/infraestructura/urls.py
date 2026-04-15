from django.urls import path
from .ConsejoController import SalidasConsejoController, RegistrarDecisionConsejoController

urlpatterns = [
    path('por-revisar/', SalidasConsejoController.as_view(), name='consejo_por_revisar'),
    path('decision/<int:salida_id>/', RegistrarDecisionConsejoController.as_view(), name='consejo_registrar_decision'),
]
