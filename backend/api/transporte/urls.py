from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .vistas import VehiculoViewSet

router = DefaultRouter()
router.register(r'vehiculos', VehiculoViewSet, basename='vehiculos')

urlpatterns = [
    path('', include(router.urls)),
]
