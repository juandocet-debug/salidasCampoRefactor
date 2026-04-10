from django.urls import path
from .SalidaController import SalidaController, EnviarSalidaView

urlpatterns = [
    path('', SalidaController.as_view(), name='salida-list-create'),
    path('<int:pk>/', SalidaController.as_view(), name='salida-detail'),
    path('<int:pk>/enviar/', EnviarSalidaView.as_view(), name='salida-enviar'),
]
