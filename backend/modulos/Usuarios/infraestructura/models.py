from django.db import models

class UsuarioModel(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    foto = models.ImageField(upload_to='usuarios/fotos/', null=True, blank=True)
    cedula = models.CharField(max_length=20, null=True, blank=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    rol = models.CharField(max_length=50, default='estudiante', choices=[
        ('estudiante', 'Estudiante'),
        ('conductor', 'Conductor'),
        ('profesor', 'Profesor'),
        ('admin', 'Administrador')
    ])
    debe_cambiar_password = models.BooleanField(default=True)

    class Meta:
        db_table = 'usuarios_usuario'
        app_label = 'usuarios_infra'
