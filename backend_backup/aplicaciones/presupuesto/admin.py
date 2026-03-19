# aplicaciones/presupuesto/admin.py
from django.contrib import admin
from .modelos import Presupuesto, Gasto

@admin.register(Presupuesto)
class PresupuestoAdmin(admin.ModelAdmin):
    list_display = ['salida', 'total_asignado', 'ejecutado']

@admin.register(Gasto)
class GastoAdmin(admin.ModelAdmin):
    list_display = ['presupuesto', 'categoria', 'monto', 'fecha']
    list_filter  = ['categoria']
