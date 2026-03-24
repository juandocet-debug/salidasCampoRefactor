from django.urls import path
from api.admin_sistema.catalogos.vistas import catalogos_publicos

urlpatterns = [
    path('', catalogos_publicos, name='admin-catalogos'),
]
