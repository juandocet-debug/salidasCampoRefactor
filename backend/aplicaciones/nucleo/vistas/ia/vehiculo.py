# aplicaciones/nucleo/vistas/ia/vehiculo.py
# ─────────────────────────────────────────────────────────────────────────────
# Endpoint IA: Especificaciones técnicas de vehículo dado su marca/modelo
# POST /api/nucleo/rendimiento-vehiculo/
# Body: { "consulta": "Chevrolet NQR 916" }
# ─────────────────────────────────────────────────────────────────────────────
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .utils import cors_preflight, llamar_groq, llamar_gemini, extraer_objeto_json

_PROMPT_TPL = (
    'Eres un experto en vehículos de transporte terrestre en Colombia. '
    'El usuario busca información técnica del vehículo: "{consulta}". '
    'INSTRUCCIONES CRÍTICAS: '
    '1. Identifica la marca y modelo EXACTO. '
    '2. Clasifica el tipo según el vehículo: '
    '   - "microbus": Microbús (8-16 pax). Rendimiento típico: 35-45 km/gal. '
    '   - "camioneta": Van/Camioneta (3-8 pax). Rendimiento típico: 40-50 km/gal. '
    '   - "buseta": Microbus mediano (15-25 pax). Rendimiento típico: 28-35 km/gal. '
    '   - "bus": Bus grande (35-50 pax) como Chevrolet FRR, LV. Rendimiento típico: 25-30 km/gal. '
    '   - "furgon": Vehículo de carga. Pon capacidad de pax en 2 o 3 máximo. Rendimiento típico: 20-30 km/gal. '
    '3. El rendimiento debe ser en kilómetros por GALÓN colombiano (km/gal). '
    '   ATENCIÓN: Si vas a calcular usando km/litro, MULTIPLÍCALO por 3.785 siempre. '
    '4. Indica tipo de combustible: "diesel", "gasolina" o "gas". '
    '5. Responde ÚNICAMENTE con JSON puro, sin markdown: '
    '{{"marca": "Chevrolet", "modelo": "FRR Euro 4", "tipo": "bus", '
    '"capacidad": 40, "rendimiento_kmgal": 28.5, "tipo_combustible": "diesel", '
    '"anio_desde": 2018, "anio_hasta": 2024, '
    '"nota": "Bus grande para transporte. Rinde entre 25-30 km/gal."}}'
)


@csrf_exempt
@require_http_methods(['POST', 'OPTIONS'])
def rendimiento_vehiculo(request):
    if request.method == 'OPTIONS':
        return cors_preflight()

    try:
        body     = json.loads(request.body)
        consulta = body.get('consulta', '').strip()
        if not consulta:
            return JsonResponse({'error': 'Se requiere consulta (marca/modelo)'}, status=400)
    except Exception:
        return JsonResponse({'error': 'Body inválido'}, status=400)

    prompt = _PROMPT_TPL.format(consulta=consulta)

    # 1️⃣ Groq (primario)
    texto = llamar_groq(prompt, max_tokens=500, temperature=0.2, tag='rendimiento')
    if texto:
        resultado = extraer_objeto_json(texto)
        if resultado is not None:
            return _ok(resultado)

    # 2️⃣ Gemini (fallback)
    texto = llamar_gemini(prompt, max_tokens=500, temperature=0.2, tag='rendimiento')
    if texto:
        resultado = extraer_objeto_json(texto)
        if resultado is not None:
            return _ok(resultado)

    return JsonResponse({'ok': False, 'error': 'IA no disponible'}, status=502)


def _ok(datos):
    r = JsonResponse({'ok': True, 'datos': datos})
    r['Access-Control-Allow-Origin'] = '*'
    return r
