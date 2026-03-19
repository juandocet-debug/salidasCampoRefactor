# aplicaciones/abordaje/admin.py
from django.contrib import admin
from .modelos import Abordaje, DocumentoEstudiante

@admin.register(Abordaje)
class AbordajeAdmin(admin.ModelAdmin):
    list_display  = ['estudiante', 'salida', 'codigo', 'abordado', 'verificado_en']
    list_filter   = ['abordado']
    search_fields = ['codigo', 'estudiante__email']

@admin.register(DocumentoEstudiante)
class DocumentoAdmin(admin.ModelAdmin):
    list_display  = ['estudiante', 'tipo', 'estado', 'fecha_vencimiento']
    list_filter   = ['tipo', 'estado']
