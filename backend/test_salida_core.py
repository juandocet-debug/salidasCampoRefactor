import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from modulos.Salidas.Core.aplicacion.SalidaCreate.SalidaCreate import SalidaCreate
from modulos.Salidas.Core.infraestructura.DjangoSalidaRepository import DjangoSalidaRepository

print("Iniciando Test Unitario DDD...")

repo = DjangoSalidaRepository()
uso = SalidaCreate(repository=repo)

try:
    print("Ejecutando Caso de Uso SalidaCreate...")
    nueva_salida = uso.run({
        'codigo': 'BOT-001X',
        'nombre': 'Expedición Botánica Páramo',
        'asignatura': 'Biología Vegetal',
        'semestre': '2026-I',
        'facultad_id': 1,
        'programa_id': 2,
        'num_estudiantes': 30,
        'justificacion': 'Reconocimiento de flora',
        'estado': 'borrador',
        'profesor_id': 5,
        'distancia_total_km': 150.5
    })
    
    print(f"EXITO: Salida persistida con ID Interno [{nueva_salida.id.value}] y Codigo [{nueva_salida.codigo.value}]")
    
    print("Comprobando recuperacion desde Repositorio (Infraestructura)...")
    recuperada = repo.get_by_id(nueva_salida.id.value)
    
    if recuperada:
        print(f"EXITO: Entidad Re-Hidratada: Nombre: '{recuperada.nombre.value}', FacultadID: {recuperada.facultad_id.value}")
        print("Todo el encadenamiento de capas (Dominio -> App -> Infra) es funcional y puro.")
    else:
        print("ERROR: No se recuperó")

except Exception as e:
    import traceback
    print(f"FALLO EL TEST: {e}")
    traceback.print_exc()
