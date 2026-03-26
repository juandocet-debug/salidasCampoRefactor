from django.urls import path
from .ItinerarioController import ItinerarioController, PuntoParadaController, ItinerarioIAController, BuscarMunicipiosRutaController, EstimarTiempoRutaController

urlpatterns = [
    path('', ItinerarioController.as_view()),
    path('<int:pk>/', ItinerarioController.as_view()),
    path('puntos/', PuntoParadaController.as_view()),
    path('ia/analisis/', ItinerarioIAController.as_view()),
    path('ia/municipios/', BuscarMunicipiosRutaController.as_view()),
    path('ia/tiempo-ruta/', EstimarTiempoRutaController.as_view()),
]
