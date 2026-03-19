# aplicaciones/checklist/admin.py
from django.contrib import admin
from .modelos import ItemChecklist

@admin.register(ItemChecklist)
class ItemChecklistAdmin(admin.ModelAdmin):
    list_display  = ['asignacion', 'categoria', 'item', 'estado']
    list_filter   = ['categoria', 'estado']
    search_fields = ['item']
