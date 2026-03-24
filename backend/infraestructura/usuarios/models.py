# CAPA: Infraestructura
# QUÉ HACE: Modelo de usuario personalizado con campo rol
# NO DEBE CONTENER: lógica de negocio, reglas de permisos

from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    email    = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True, blank=True)
    rol      = models.CharField(max_length=30, default='profesor')

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['username', 'rol']

    class Meta:
        db_table = 'usuarios'
