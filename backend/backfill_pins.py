import os
import sys
import random
import string

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from modulos.Salidas.Core.infraestructura.models import SalidaModelo

def generar_pin():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

for salida in SalidaModelo.objects.all():
    if not salida.pin_acceso:
        pin = generar_pin()
        while SalidaModelo.objects.filter(pin_acceso=pin).exists():
            pin = generar_pin()
        salida.pin_acceso = pin
        salida.save()
        print(f"Asignado PIN {pin} a salida {salida.id}")

print("Backfill completado.")
