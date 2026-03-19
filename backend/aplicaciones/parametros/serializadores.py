# aplicaciones/parametros/serializadores.py
# ─────────────────────────────────────────────────────────────────────────────
# Serializadores de Parámetros, Catálogos Académicos y Ventanas.
# ─────────────────────────────────────────────────────────────────────────────
from rest_framework import serializers
from .modelos import ParametrosSistema, Facultad, Programa, VentanaProgramacion
from aplicaciones.usuarios.serializadores import UsuarioResumenSerializador


class ParametrosSerializador(serializers.ModelSerializer):
    """Serializa los parámetros del sistema para lectura y escritura."""

    actualizado_por_info = UsuarioResumenSerializador(
        source='actualizado_por', read_only=True
    )

    class Meta:
        model  = ParametrosSistema
        fields = [
            'id',
            'precio_galon',
            'rendimiento',
            'rendimiento_bus',
            'rendimiento_buseta',
            'rendimiento_camioneta',
            'costo_noche',
            'costo_hora_extra',
            'costo_hora_extra_2',
            'max_horas_viaje',
            'horas_buffer',
            'actualizado_por',
            'actualizado_por_info',
            'actualizado_en',
        ]
        read_only_fields = ['id', 'actualizado_por', 'actualizado_por_info', 'actualizado_en']


class CalcularCostoSerializador(serializers.Serializer):
    """Valida los inputs de la calculadora de costo."""

    distancia_km   = serializers.FloatField(min_value=0.1,  help_text='Distancia total en km')
    duracion_dias  = serializers.FloatField(min_value=0.5,  help_text='Duración en días')
    horas_totales  = serializers.FloatField(min_value=1,    help_text='Horas totales del viaje')


class FacultadSerializador(serializers.ModelSerializer):
    """CRUD de Facultad — catálogo académico."""
    cantidad_programas = serializers.IntegerField(source='programas.count', read_only=True)

    class Meta:
        model  = Facultad
        fields = ['id', 'nombre', 'activa', 'cantidad_programas']


class ProgramaSerializador(serializers.ModelSerializer):
    """CRUD de Programa — vinculado a Facultad."""
    facultad_nombre = serializers.CharField(source='facultad.nombre', read_only=True)

    class Meta:
        model  = Programa
        fields = ['id', 'facultad', 'facultad_nombre', 'nombre', 'activo']


class VentanaSerializador(serializers.ModelSerializer):
    """CRUD de Ventana de Programación."""

    class Meta:
        model  = VentanaProgramacion
        fields = ['id', 'nombre', 'fecha_apertura', 'fecha_cierre', 'activa']
