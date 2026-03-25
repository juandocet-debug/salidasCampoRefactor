import os
import sys

# Preparar entorno Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from modulos.Usuarios.infraestructura.DjangoUsuarioRepository import DjangoUsuarioRepository
from modulos.Usuarios.aplicacion.UsuarioCreate.UsuarioCreate import UsuarioCreate
from modulos.Usuarios.infraestructura.models import UsuarioModel

repo = DjangoUsuarioRepository()
uc = UsuarioCreate(repository=repo)

# Revisar si ya existe
if not UsuarioModel.objects.filter(email="profesor@upn.edu.co").exists():
    try:
        uc.run(
            nombre="Profesor",
            apellido="Prueba",
            email="profesor@upn.edu.co",
            password="password123",
            foto=None
        )
        print("Usuario profesor@upn.edu.co creado con éxito con password 'password123'")
    except Exception as e:
        print(f"Error creando usuario: {e}")
else:
    print("El usuario profesor@upn.edu.co ya existe. Validando credenciales...")
    # Podríamos forzar actualización de contraseña, pero ya sabemos que existe.
