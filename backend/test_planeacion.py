import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from modulos.Salidas.Planeacion.aplicacion.PlaneacionCreate.PlaneacionCreate import PlaneacionCreate
from modulos.Salidas.Planeacion.infraestructura.DjangoPlaneacionRepository import DjangoPlaneacionRepository

print("Iniciando Test Unitario DDD para Planeacion Pedagogica...")

repo = DjangoPlaneacionRepository()
uso = PlaneacionCreate(repository=repo)

try:
    print("Ejecutando Caso de Uso PlaneacionCreate...")
    nueva = uso.run({
        'salida_id': 1,
        'competencias': 'Desarrollar habilidades de observación taxonómica.',
        'resultados': 'El estudiante identificará 50 especies de flora nativa.',
        'guion': '1. Llegada al páramo. 2. Identificación visual. 3. Toma de muestras fotográficas.',
        'requiere_guia': True
    })
    
    print(f"EXITO: Planeacion persistida con ID Interno [{nueva.id.value}] ligada a la Salida [{nueva.salida_id.value}]")
    
    print("Comprobando recuperacion desde Repositorio (Infraestructura)...")
    recuperada = repo.get_by_id(nueva.id.value)
    
    if recuperada:
        print(f"EXITO: Entidad Re-Hidratada:")
        print(f" - Competencias: '{recuperada.competencias.value}'")
        print(f" - ¿Requiere Guia?: {'Sí' if recuperada.requiere_guia.value else 'No'}")
        print("El Bounded Context de Planeacion es puro y funcional.")
    else:
        print("ERROR: No se recuperó")

except Exception as e:
    import traceback
    print(f"FALLO EL TEST: {e}")
    traceback.print_exc()
