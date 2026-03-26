from django.urls import path
from .ParadaController import ParadaController

urlpatterns = [
    path('', ParadaController.as_view(), name='paradas-lista-crear'),
    path('<int:pk>/', ParadaController.as_view(), name='paradas-detalle-editar-eliminar'),
]
