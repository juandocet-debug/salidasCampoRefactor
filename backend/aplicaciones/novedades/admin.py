# aplicaciones/novedades/admin.py
from django.contrib import admin
from .modelos import Novedad

@admin.register(Novedad)
class NovedadAdmin(admin.ModelAdmin):
    list_display  = ['salida', 'tipo', 'urgencia', 'estado', 'registrado_en']
    list_filter   = ['tipo', 'urgencia', 'estado']
    search_fields = ['descripcion']
