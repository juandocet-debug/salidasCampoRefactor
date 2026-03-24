from django.urls import path
from api.admin_sistema.parametros.vistas import obtener_parametros

urlpatterns = [
    path('', obtener_parametros, name='admin-parametros'),
]
