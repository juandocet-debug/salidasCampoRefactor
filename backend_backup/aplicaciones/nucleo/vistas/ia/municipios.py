# aplicaciones/nucleo/vistas/ia/municipios.py
# ─────────────────────────────────────────────────────────────────────────────
# Endpoint IA: Municipios en ruta (Groq Llama → Gemini fallback)
# POST /api/nucleo/municipios-en-ruta/
# Body: { "origen": "Bogotá", "destino": "Medellín" }
# ─────────────────────────────────────────────────────────────────────────────
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .utils import cors_preflight, llamar_groq, llamar_gemini, extraer_lista_json

_PROMPT_TPL = (
    'Eres un experto geógrafo colombiano especializado en vías terrestres. '
    'Lista TODOS los municipios y ciudades que están DIRECTAMENTE sobre la carretera principal '
    'desde "{origen}" hasta "{destino}" en Colombia, en orden del viaje. '
    'REGLAS ESTRICTAS: '
    '1. Solo incluye los que están sobre la vía principal (no desvíos). '
    '2. Excluye el origen y el destino. '
    '3. Incluye hasta 30 municipios si la ruta es larga. '
    '4. Si no conoces la ruta exacta, devuelve []. '
    '5. Responde ÚNICAMENTE con JSON puro, sin explicaciones ni texto adicional: '
    '[{{"nombre":"Villeta","depto":"Cundinamarca"}},{{"nombre":"Honda","depto":"Tolima"}}]'
)


@csrf_exempt
@require_http_methods(['POST', 'OPTIONS'])
def municipios_en_ruta(request):
    if request.method == 'OPTIONS':
        return cors_preflight()

    try:
        body    = json.loads(request.body)
        origen  = body.get('origen', '').strip()
        destino = body.get('destino', '').strip()
        if not origen or not destino:
            return JsonResponse({'error': 'Se requieren origen y destino'}, status=400)
    except Exception:
        return JsonResponse({'error': 'Body inválido'}, status=400)

    prompt = _PROMPT_TPL.format(origen=origen, destino=destino)

    # 1️⃣ Groq (primario)
    texto = llamar_groq(prompt, max_tokens=1200, temperature=0.1, tag='municipios')
    if texto:
        municipios = extraer_lista_json(texto)
        if municipios is not None:
            return _ok(municipios)

    # 2️⃣ Gemini (fallback)
    texto = llamar_gemini(prompt, max_tokens=1200, temperature=0.1, tag='municipios')
    if texto:
        municipios = extraer_lista_json(texto)
        if municipios is not None:
            return _ok(municipios)

    return JsonResponse({'municipios': []})


def _ok(municipios):
    r = JsonResponse({'municipios': municipios})
    r['Access-Control-Allow-Origin'] = '*'
    return r
