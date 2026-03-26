import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from modulos.Salidas.Itinerario.aplicacion.ItinerarioCreate.ItinerarioCreate import ItinerarioCreate
from modulos.Salidas.Itinerario.aplicacion.PuntoParadaAdd.PuntoParadaAdd import PuntoParadaAdd
from modulos.Salidas.Itinerario.aplicacion.AsistenteViajeIA.AsistenteViajeIA import AsistenteViajeIA
from modulos.Salidas.Itinerario.infraestructura.DjangoItinerarioRepository import DjangoItinerarioRepository
from modulos.Salidas.Itinerario.infraestructura.DjangoRutaIAAdapter import DjangoRutaIAAdapter

print("=========================================")
print("TESTING MODULO LOGISTICA / MAPAS / IA")
print("=========================================")

repo = DjangoItinerarioRepository()

try:
    print("\n1. Creando Entidad Itinerario Base...")
    itinerario = ItinerarioCreate(repository=repo).run({
        'salida_id': 1,
        'poligonal_mapa': '{"type":"LineString","coordinates":[[-74.08, 4.60],[-73.52, 5.63]]}',
        'distancia_km': 165.4,
        'duracion_horas': 3.5
    })
    print(f" Itinerario Guardado ID: {itinerario.id.value} (Salida {itinerario.salida_id.value})")

    print("\n2. Agregando Puntos de Parada (Waypoints)...")
    p1 = PuntoParadaAdd(repository=repo).run({
        'itinerario_id': itinerario.id.value,
        'orden': 1,
        'latitud': 4.6097, 'longitud': -74.0817,
        'nombre': 'Universidad Pedagógica Nacional (Sede 73)',
        'tipo': 'salida'
    })
    print(f"   => Waypoint Agregado: {p1.nombre.value}")
    
    p2 = PuntoParadaAdd(repository=repo).run({
        'itinerario_id': itinerario.id.value,
        'orden': 2,
        'latitud': 5.6333, 'longitud': -73.5333,
        'nombre': 'Villa de Leyva Central',
        'tipo': 'trabajo_campo'
    })
    print(f"   => Waypoint Agregado: {p2.nombre.value}")

    print("\n3. Pruebas de Inteligencia Artificial de Rutas...")
    contexto = (
        f"Ruta desde {p1.nombre.value} (Lat: {p1.latitud.value}) "
        f"hacia {p2.nombre.value} (Lat: {p2.latitud.value}). "
        f"Distancia: {itinerario.distancia_km.value} km. Terreno Andino Colombiano."
    )
    print(f"   => Contexto enviado a Groq/Gemini: '{contexto}'")
    
    ia_port = DjangoRutaIAAdapter()
    ia_asistente = AsistenteViajeIA(ia_port)
    respuesta_ia = ia_asistente.run(contexto)
    
    print("\n-------------------------------------------")
    print("RESPUESTA DE LA INTELIGENCIA ARTIFICIAL:")
    print("-------------------------------------------")
    print(respuesta_ia)
    print("-------------------------------------------")
    print("\nModulo Itinerario Sobrevive Exitosamente")

except Exception as e:
    import traceback
    print(f"FALLO LA PRUEBA: {e}")
    traceback.print_exc()
