import os
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from modulos.Usuarios.infraestructura.models import UsuarioModel

u = UsuarioModel.objects.exclude(facultad__isnull=True).exclude(facultad='').first()
if u:
    print("Usuario:", u.email)
    print("Facultad:", getattr(u, 'facultad', 'No tiene'))
    print("Programa:", getattr(u, 'programa', 'No tiene'))
else:
    print("No hay usuarios con facultad/programa asignados.")
