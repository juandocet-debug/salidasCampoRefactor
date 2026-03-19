# aplicaciones/nucleo/vistas/ia/tiempo.py
# ─────────────────────────────────────────────────────────────────────────────
# Endpoint IA: Tiempo estimado de viaje por carretera colombiana
# POST /api/nucleo/tiempo-ruta/
# Body: { "origen": "Bogotá", "destino": "Aguachica, Cesar" }
# ─────────────────────────────────────────────────────────────────────────────
import os
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .utils import cors_preflight, llamar_groq, extraer_objeto_json

_PROMPT_TPL = (
    'Eres el mejor planificador de rutas de Colombia. '
    'Calcula el tiempo REAL que tomaría un viaje sin paradas largas '
    'desde "{origen}" hasta "{destino}". '
    'REGLAS ESTRICTAS: '
    '1. Basa tu cálculo en tiempos estándar de GPS / Google Maps, sumando un 15% o 20% '
    'extra por tratarse de un vehículo mediano/grande (bus/buseta) y por la topografía. '
    '2. No exageres los tiempos. Si en carro toma 3 horas, en buseta tomará máximo 3.5 o 4 horas. '
    '3. Incluye la distancia realista en km por carretera. '
    '4. Responde ÚNICAMENTE con JSON puro (no uses Markdown de código), como este ejemplo: '
    '{{"horas": 4.5, "minutos": 270, "distancia_km": 150, "velocidad_promedio_kmh": 33, "nota": "Desvío por La Línea"}}'
)


@csrf_exempt
@require_http_methods(['POST', 'OPTIONS'])
def tiempo_ruta(request):
    if request.method == 'OPTIONS':
        return cors_preflight()

    groq_key = os.environ.get('GROQ_API_KEY', '')
    if not groq_key:
        print('[tiempo_ruta] ERROR: GROQ_API_KEY vacía')
        return JsonResponse({'error': 'GROQ_API_KEY no configurada'}, status=500)

    try:
        body    = json.loads(request.body)
        origen  = body.get('origen', '').strip()
        destino = body.get('destino', '').strip()
        if not origen or not destino:
            return JsonResponse({'error': 'Se requieren origen y destino'}, status=400)
    except Exception:
        return JsonResponse({'error': 'Body inválido'}, status=400)

    prompt = _PROMPT_TPL.format(origen=origen, destino=destino)

    texto = llamar_groq(prompt, max_tokens=500, temperature=0.1, tag='tiempo_ruta')
    if not texto:
        return JsonResponse({'error': 'Groq no disponible'}, status=502)

    resultado = extraer_objeto_json(texto)
    if resultado is None:
        return JsonResponse({'ok': False, 'error': 'No se pudo interpretar la respuesta de la IA'}, status=502)

    # Normalizar horas/minutos si alguno falta
    if 'horas' not in resultado and 'minutos' in resultado:
        resultado['horas'] = round(resultado['minutos'] / 60, 1)
    if 'minutos' not in resultado and 'horas' in resultado:
        resultado['minutos'] = round(resultado['horas'] * 60)

    r = JsonResponse({'ok': True, 'datos': resultado})
    r['Access-Control-Allow-Origin'] = '*'
    return r
