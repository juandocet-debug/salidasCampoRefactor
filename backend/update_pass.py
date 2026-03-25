import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.hashers import make_password
from modulos.Usuarios.infraestructura.models import UsuarioModel

u = UsuarioModel.objects.get(email="profesor@upn.edu.co")
u.password_hash = make_password("otium2026")
u.save()
print("Password updated to otium2026 in password_hash column")
