# aplicaciones/usuarios/serializadores.py
# ─────────────────────────────────────────────────────────────────────────────
# SERIALIZADORES DE USUARIO
# Transforman objetos Usuario ↔ JSON.
# También manejan la validación de datos de entrada.
# ─────────────────────────────────────────────────────────────────────────────

from rest_framework import serializers
from .modelos import Usuario


class UsuarioResumenSerializador(serializers.ModelSerializer):
    """Datos mínimos del usuario — para incluir en otras respuestas."""

    class Meta:
        model  = Usuario
        fields = ['id', 'email', 'first_name', 'last_name', 'rol']


class UsuarioDetalleSerializador(serializers.ModelSerializer):
    """Datos completos del usuario — para el perfil."""

    class Meta:
        model  = Usuario
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'rol', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class CrearUsuarioSerializador(serializers.ModelSerializer):
    """Para crear un nuevo usuario con contraseña."""

    contrasena = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model  = Usuario
        fields = ['email', 'first_name', 'last_name', 'rol', 'contrasena']

    def create(self, datos_validados):
        contrasena = datos_validados.pop('contrasena')
        usuario    = Usuario(**datos_validados)
        usuario.set_password(contrasena)   # hashea la contraseña
        usuario.save()
        return usuario


class LoginSerializador(serializers.Serializer):
    """Valida las credenciales del formulario de login."""

    correo     = serializers.EmailField()
    contrasena = serializers.CharField(write_only=True)
