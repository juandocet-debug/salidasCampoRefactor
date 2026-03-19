# infraestructura/salidas/serializadores.py
# ─────────────────────────────────────────────────────────────────────────────
# SERIALIZADOR de la entidad Salida → JSON
#
# Serializa entidades de dominio (dataclasses), no modelos Django.
# ─────────────────────────────────────────────────────────────────────────────

from rest_framework import serializers
from dominio.salidas.entidades import Salida


class SalidaSerializer(serializers.Serializer):
    """
    Serializa la entidad de dominio Salida a dict/JSON.
    Usa Serializer base (no ModelSerializer) porque opera sobre
    entidades de dominio, no modelos Django.
    """
    id              = serializers.IntegerField(read_only=True, allow_null=True)
    codigo          = serializers.CharField(read_only=True)
    nombre          = serializers.CharField()
    asignatura      = serializers.CharField()
    semestre        = serializers.CharField()
    facultad        = serializers.CharField()
    programa        = serializers.CharField()
    num_estudiantes = serializers.IntegerField()
    justificacion   = serializers.CharField()
    estado          = serializers.CharField()          # valor del enum
    profesor_id     = serializers.IntegerField(allow_null=True)
    fecha_inicio    = serializers.DateField(allow_null=True)
    fecha_fin       = serializers.DateField(allow_null=True)
    distancia_total_km = serializers.FloatField()
    duracion_dias   = serializers.FloatField()
    horas_viaje     = serializers.FloatField()
    costo_estimado  = serializers.FloatField()
    icono           = serializers.CharField()
    color           = serializers.CharField()
    created_at      = serializers.DateTimeField(read_only=True, allow_null=True)
