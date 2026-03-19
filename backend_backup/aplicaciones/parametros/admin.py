# aplicaciones/parametros/admin.py
# ─────────────────────────────────────────────────────────────────────────────
# Admin: Parámetros del Sistema, Catálogos Académicos, Ventanas
# ─────────────────────────────────────────────────────────────────────────────
from django.contrib import admin
from .modelos import ParametrosSistema, Facultad, Programa, VentanaProgramacion


@admin.register(ParametrosSistema)
class ParametrosSistemaAdmin(admin.ModelAdmin):
    list_display    = ['precio_galon', 'rendimiento', 'costo_noche', 'costo_hora_extra', 'actualizado_en']
    readonly_fields = ['actualizado_por', 'actualizado_en']

    def has_add_permission(self, request):
        return not ParametrosSistema.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


class ProgramaInline(admin.TabularInline):
    model = Programa
    extra = 1


@admin.register(Facultad)
class FacultadAdmin(admin.ModelAdmin):
    list_display  = ['nombre', 'activa']
    list_filter   = ['activa']
    search_fields = ['nombre']
    inlines       = [ProgramaInline]


@admin.register(Programa)
class ProgramaAdmin(admin.ModelAdmin):
    list_display  = ['nombre', 'facultad', 'activo']
    list_filter   = ['activo', 'facultad']
    search_fields = ['nombre']


@admin.register(VentanaProgramacion)
class VentanaProgramacionAdmin(admin.ModelAdmin):
    list_display  = ['nombre', 'fecha_apertura', 'fecha_cierre', 'activa']
    list_filter   = ['activa']

