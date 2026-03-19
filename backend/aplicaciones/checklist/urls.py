# aplicaciones/checklist/urls.py
from django.urls import path
from . import vistas

app_name = 'checklist'

urlpatterns = [
    path('', vistas.ChecklistListaVista.as_view(), name='lista'),
]
