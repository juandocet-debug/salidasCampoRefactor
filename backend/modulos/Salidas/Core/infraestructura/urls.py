from django.urls import path
from .SalidaController import SalidaController

urlpatterns = [
    path('', SalidaController.as_view(), name='salida-list-create'),
    path('<int:pk>/', SalidaController.as_view(), name='salida-detail'),
]
