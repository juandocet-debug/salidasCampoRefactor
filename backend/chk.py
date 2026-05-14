import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from modulos.Salidas.Core.infraestructura.models import SalidaModelo
from modulos.Salidas.Estudiante.infraestructura.models import EstudianteSalida

print("=== Salidas en BD ===")
for s in SalidaModelo.objects.all()[:10]:
    print(f"  PK={s.id}  codigo={s.codigo}  pin={s.pin_acceso}  nombre={s.nombre[:40]}")

print("\n=== Inscripciones ===")
for e in EstudianteSalida.objects.all()[:10]:
    print(f"  usuario={e.usuario_id}  salida={e.salida_id}  estado={e.estado}")
