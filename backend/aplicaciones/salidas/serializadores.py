# aplicaciones/salidas/serializadores.py
# ─────────────────────────────────────────────────────────────────────────────
# SERIALIZADORES DE LA APLICACIÓN SALIDAS
# Usados por la capa BFF (api/profesor/, api/coordinador/) y las rutas legacy.
# ─────────────────────────────────────────────────────────────────────────────

from rest_framework import serializers
from .modelos import Salida


class SalidaListaSerializador(serializers.ModelSerializer):
    """Representación resumida para listados (tarjetas)."""

    profesor_nombre = serializers.SerializerMethodField()

    class Meta:
        model  = Salida
        fields = [
            'id', 'codigo', 'nombre', 'asignatura', 'semestre',
            'estado', 'fecha_inicio', 'fecha_fin',
            'num_estudiantes', 'costo_estimado',
            'icono', 'color', 'resumen',
            'profesor_nombre',
        ]

    def get_profesor_nombre(self, obj):
        return obj.profesor.get_full_name() or obj.profesor.username


class SalidaDetalleSerializador(serializers.ModelSerializer):
    """Representación completa para la vista de detalle."""

    profesor_nombre = serializers.SerializerMethodField()
    profesores_asociados_ids = serializers.PrimaryKeyRelatedField(
        source='profesores_asociados', many=True, read_only=True,
    )

    class Meta:
        model  = Salida
        fields = '__all__'

    def get_profesor_nombre(self, obj):
        return obj.profesor.get_full_name() or obj.profesor.username


class CrearSalidaSerializador(serializers.ModelSerializer):
    """Para crear y editar salidas (POST / PATCH)."""

    class Meta:
        model  = Salida
        fields = [
            'nombre', 'asignatura', 'semestre', 'facultad', 'programa',
            'num_estudiantes', 'resumen', 'justificacion',
            'relacion_syllabus', 'productos_esperados',
            'fecha_inicio', 'fecha_fin', 'hora_inicio', 'hora_fin',
            'tipo_transporte', 'distancia_total_km', 'duracion_dias',
            'horas_viaje', 'tipo_vehiculo_calculo',
            'es_grupal', 'profesores_asociados',
            'icono', 'color',
        ]
