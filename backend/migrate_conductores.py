import os
import sys

# Preparar entorno Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from modulos.Logistica.ConductorInstitucional.infraestructura.models import ConductorInstitucionalModel
from modulos.Usuarios.infraestructura.models import UsuarioModel

def migrar_conductores():
    conductores = ConductorInstitucionalModel.objects.all()
    print(f"Encontrados {conductores.count()} conductores.")
    for c in conductores:
        # Generar un correo falso si no tiene
        email = f"conductor_{c.cedula}@upn.edu.co"
        # Contraseña por defecto (su cedula o "conductor123")
        password = "conductor123"
        
        # Separar nombre en nombre y apellido de forma ingenua
        partes = c.nombre.split(' ')
        nombre = partes[0]
        apellido = ' '.join(partes[1:]) if len(partes) > 1 else 'UPN'

        usuario, created = UsuarioModel.objects.get_or_create(
            email=email,
            defaults={
                'nombre': nombre,
                'apellido': apellido,
                'password_hash': 'pbkdf2_sha256$600000$xxxx$yyyy', # Usaremos set_password
                'foto': c.foto,
                'rol': 'conductor'
            }
        )
        if created:
            from django.contrib.auth.hashers import make_password
            usuario.password_hash = make_password(password)
            usuario.save()
            print(f"  [+] Creado usuario para {c.nombre} (email: {email}, password: {password})")
        else:
            print(f"  [=] Usuario ya existente para {c.nombre}")

if __name__ == "__main__":
    migrar_conductores()
