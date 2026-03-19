# aplicaciones/transporte/admin.py
from django.contrib import admin
from .modelos import Vehiculo, Asignacion

@admin.register(Vehiculo)
class VehiculoAdmin(admin.ModelAdmin):
    list_display  = ['placa', 'tipo', 'capacidad', 'estado_tecnico']
    list_filter   = ['tipo', 'estado_tecnico']
    search_fields = ['placa']

@admin.register(Asignacion)
class AsignacionAdmin(admin.ModelAdmin):
    list_display  = ['salida', 'vehiculo', 'conductor', 'tipo_transporte']
    list_filter   = ['tipo_transporte']
