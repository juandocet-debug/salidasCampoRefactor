import os
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from modulos.Usuarios.infraestructura.models import UsuarioModel
from modulos.Salidas.Estudiante.infraestructura.models import DirectorioEstudiante

print("Usuarios:")
for u in UsuarioModel.objects.all():
    print(f"- {u.email} (Rol: {getattr(u, 'rol', 'N/A')})")

print("\nDirectorioEstudiante:")
for d in DirectorioEstudiante.objects.all():
    print(f"- {d.correo} (Carga activa: {d.carga.activa})")
