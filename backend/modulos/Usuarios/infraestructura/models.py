from django.db import models

class UsuarioModel(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    foto = models.ImageField(upload_to='usuarios/fotos/', null=True, blank=True)

    class Meta:
        db_table = 'usuarios_usuario'
        app_label = 'usuarios_infra'
