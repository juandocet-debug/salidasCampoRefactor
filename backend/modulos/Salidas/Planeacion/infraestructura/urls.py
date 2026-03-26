from django.urls import path
from .PlaneacionController import PlaneacionController

urlpatterns = [
    path('', PlaneacionController.as_view()),
    path('<int:pk>/', PlaneacionController.as_view()),
]
