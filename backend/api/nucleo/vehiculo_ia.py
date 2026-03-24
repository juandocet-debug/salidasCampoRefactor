# CAPA: API
# QUÉ HACE: Endpoint IA: Identificador de vehículos (Groq Llama → Gemini fallback)
# NO DEBE CONTENER: Reglas de negocio duras. Es un procesador NLP a JSON estructurado.

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .utils import cors_preflight, llamar_groq, llamar_gemini, extraer_objeto_json

_PROMPT_TPL = (
    'Eres un Asistente Experto en parque automotor y flotas de transporte en Colombia. '
    'El administrador de transporte te pregunta lo siguiente: "{consulta}". '
    'Tu objetivo es responder de forma clara, directa y concisa proporcionando '
    'los datos técnicos solicitados, especialmente el consumo en Kilómetros por Galón (km/gal). '
    'REGLAS ESTRICTAS: '
    '1. Responde en lenguaje natural breve (máximo un párrafo corto). '
    '2. Si se pide consumo, enfócate en dar el dato en km/gal basado en estimaciones realistas. '
    '3. NO utilices formato JSON. Escribe texto normal directo al usuario. '
    'Ejemplo: "La Chevrolet NHR modelo 2018 tiene un consumo promedio en ruta de 14.5 a 16 km/gal, dependiendo de la carga y topografía."'
)

@csrf_exempt
@require_http_methods(['POST', 'OPTIONS'])
def asistente_vehiculo(request):
    if request.method == 'OPTIONS':
        return cors_preflight()

    try:
        body = json.loads(request.body)
        consulta = body.get('consulta', '').strip()
        if not consulta:
            return JsonResponse({'error': 'Se requiere una consulta'}, status=400)
    except Exception:
        return JsonResponse({'error': 'Body JSON inválido'}, status=400)

    prompt = _PROMPT_TPL.format(consulta=consulta)

    # 1️⃣ Groq (primario)
    texto = llamar_groq(prompt, max_tokens=1000, temperature=0.1, tag='vehiculo_ia')
    if texto:
        return _ok(texto.strip())

    # 2️⃣ Gemini (fallback)
    texto = llamar_gemini(prompt, max_tokens=1000, temperature=0.1, tag='vehiculo_ia')
    if texto:
        return _ok(texto.strip())

    return JsonResponse({'ok': False, 'error': 'IA no pudo procesar la solicitud'}, status=503)

def _ok(respuesta):
    r = JsonResponse({'ok': True, 'respuesta': respuesta})
    r['Access-Control-Allow-Origin'] = '*'
    return r

