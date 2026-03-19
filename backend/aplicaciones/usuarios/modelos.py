# aplicaciones/usuarios/modelos.py
# ─────────────────────────────────────────────────────────────────────────────
# MODELO DE USUARIO PERSONALIZADO
# Extiende AbstractUser de Django para agregar el campo 'rol'.
# Django Admin, JWT y permisos funcionan automáticamente con este modelo.
# ─────────────────────────────────────────────────────────────────────────────

from django.contrib.auth.models import AbstractUser
from django.db import models
from aplicaciones.nucleo.constantes import Roles


class Usuario(AbstractUser):
    """
    Usuario del sistema OTIUM.
    Hereda: id, username, password, email, first_name, last_name, is_active.
    Agrega: rol (obligatorio para controlar acceso por pantalla)
    """

    # Usamos 'correo' como identificador principal en vez de 'username'
    email    = models.EmailField(unique=True, verbose_name='Correo electrónico')
    username = models.CharField(
        max_length=150,
        unique=True,
        blank=True,
        verbose_name='Usuario',
    )

    rol = models.CharField(
        max_length=30,
        choices=Roles.OPCIONES,
        verbose_name='Rol en el sistema',
    )

    # Iniciar sesión con correo en vez de username
    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['username', 'rol']

    class Meta:
        verbose_name        = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering            = ['email']

    def __str__(self):
        return f'{self.get_full_name() or self.email} ({self.rol})'

    def save(self, *args, **kwargs):
        # Si no tiene username, usar la parte local del correo
        if not self.username:
            self.username = self.email.split('@')[0]
        super().save(*args, **kwargs)
