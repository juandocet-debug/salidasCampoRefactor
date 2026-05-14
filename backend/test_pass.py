import os
import sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from modulos.Salidas.Estudiante.infraestructura.DjangoEstudianteRepository import DjangoEstudianteRepository
repo = DjangoEstudianteRepository()
print("juan password123:", repo.verificar_password_directorio('juan.perez@upn.edu.co', 'password123'))
print("juan 123456:", repo.verificar_password_directorio('juan.perez@upn.edu.co', '123456'))
