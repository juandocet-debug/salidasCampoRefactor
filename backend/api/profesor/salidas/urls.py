# CAPA: API — BFF Profesor
# QUÉ HACE: Rutas URL para el módulo de salidas del profesor
# NO DEBE CONTENER: lógica de negocio, ORM, queries a BD

from django.urls import path

from api.profesor.salidas.vistas import (
    salidas_list,
    salida_detail,
    enviar_salida,
    calcular_costo,
)
from api.profesor.salidas.vistas_ia import tiempo_ruta

urlpatterns = [
    path('',                                salidas_list,    name='profesor-salidas-list'),
    path('<int:salida_id>/',                salida_detail,   name='profesor-salidas-detail'),
    path('<int:salida_id>/enviar/',          enviar_salida,   name='profesor-salidas-enviar'),
    path('<int:salida_id>/calcular-costo/', calcular_costo,  name='profesor-salidas-calcular-costo'),
    
    # Endpoints IA Groq
    path('ia/tiempo-ruta/',                 tiempo_ruta,     name='profesor-salidas-ia-tiempo'),
]

