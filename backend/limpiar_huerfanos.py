"""
Limpia itinerarios y paradas huérfanos (que no tienen salida correspondiente).
Ejecutar una sola vez para solucionar el UNIQUE constraint.
"""
import os, sys, django

sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from modulos.Salidas.Core.infraestructura.models import SalidaModelo
from modulos.Salidas.Itinerario.infraestructura.models import ItinerarioModelo
from modulos.Salidas.Itinerario.Parada.infraestructura.models import ParadaModelo

salida_ids = set(SalidaModelo.objects.values_list('id', flat=True))
huerfanos  = ItinerarioModelo.objects.exclude(salida_id__in=salida_ids)

count_paradas = 0
for itin in huerfanos:
    count_paradas += ParadaModelo.objects.filter(itinerario_id=itin.id).delete()[0]

count_itin = huerfanos.delete()[0]
print(f"✅ Eliminados: {count_itin} itinerario(s) huérfano(s), {count_paradas} parada(s) huérfana(s).")
print("   La base de datos está limpia. Puedes crear nuevas salidas sin errores.")
