# aplicaciones/salidas/admin.py
from django.contrib import admin
from .modelos import (
    Salida, PlaneacionPedagogica, ObjetivoEspecifico,
    Competencia, PuntoRuta, CriterioEvaluacion,
    Revision, CriterioRevision, DecisionConsejo
)


class ObjetivoInline(admin.TabularInline):
    model = ObjetivoEspecifico
    extra = 1


class CompetenciaInline(admin.TabularInline):
    model = Competencia
    extra = 1


class PuntoRutaInline(admin.TabularInline):
    model   = PuntoRuta
    extra   = 1
    ordering = ['orden']


class CriterioRevisionInline(admin.TabularInline):
    model = CriterioRevision
    extra = 1


@admin.register(Salida)
class SalidaAdmin(admin.ModelAdmin):
    list_display  = ['codigo', 'nombre', 'profesor', 'estado', 'fecha_inicio', 'num_estudiantes']
    list_filter   = ['estado', 'programa']
    search_fields = ['codigo', 'nombre', 'profesor__email']
    inlines       = [PuntoRutaInline]
    ordering      = ['-created_at']


@admin.register(PlaneacionPedagogica)
class PlaneacionAdmin(admin.ModelAdmin):
    list_display = ['salida']
    inlines      = [ObjetivoInline, CompetenciaInline]


@admin.register(Revision)
class RevisionAdmin(admin.ModelAdmin):
    list_display  = ['salida', 'coordinador', 'concepto', 'created_at']
    list_filter   = ['concepto']
    inlines       = [CriterioRevisionInline]


@admin.register(DecisionConsejo)
class DecisionConsejoAdmin(admin.ModelAdmin):
    list_display = ['salida', 'decision', 'decidido_por', 'decided_at']
    list_filter  = ['decision']
