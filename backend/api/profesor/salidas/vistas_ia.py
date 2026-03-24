import os
import re
import json
import urllib.request
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

def cors_preflight():
    response = JsonResponse({})
    response['Access-Control-Allow-Origin']  = '*'
    response['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

def llamar_groq(prompt: str, *, max_tokens: int = 800, temperature: float = 0.1, tag: str = '') -> str | None:
    try:
        from decouple import config
        groq_key = config('GROQ_API_KEY', default='')
    except ImportError:
        groq_key = os.environ.get('GROQ_API_KEY', '')
    if not groq_key:
        return None
    try:
        url = 'https://api.groq.com/openai/v1/chat/completions'
        headers = {
            'Authorization': f'Bearer {groq_key}',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0'
        }
        data = json.dumps({
            'model': 'llama-3.3-70b-versatile',
            'messages': [{'role': 'user', 'content': prompt}],
            'temperature': temperature,
            'max_tokens': max_tokens,
        }).encode('utf-8')
        
        req = urllib.request.Request(url, data=data, headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=20) as resp:
            if resp.status == 200:
                resp_data = json.loads(resp.read().decode('utf-8'))
                return resp_data['choices'][0]['message']['content']
            pass
    except Exception as e:
        pass
    return None

def extraer_objeto_json(texto: str) -> dict | None:
    match = re.search(r'\{[\s\S]*\}', texto)
    if match:
        try:
            resultado = json.loads(match.group())
            if isinstance(resultado, dict):
                return resultado
        except json.JSONDecodeError:
            pass
    return None

PROMPT_TPL = (
    'Eres un experto en transporte terrestre en Colombia. '
    'Calcula un tiempo REALISTA de viaje en bus o buseta '
    'desde "{origen}" hasta "{destino}". '

    'REGLAS: '
    '1. Usa como base el tiempo en carro y ajústalo de forma REALISTA (no exagerada). '
    '2. Incremento típico bus vs carro: entre 10% y 25%, no más. '
    '3. Velocidad promedio real bus Colombia: 55-70 km/h en carretera. '
    '4. Considera paradas cortas y tráfico urbano moderado. '
    '5. Bogotá-Medellín referencia: carro 8-9h → bus 9-10h máximo. '
    '6. NO sobreestimar tiempos. Priorizar realismo. '

    'Responde SOLO JSON: '
    '{{"horas": 9, "minutos": 540, "distancia_km": 415, '
    '"velocidad_promedio_kmh": 60, "nota": "Ruta típica con tráfico moderado"}}'
)

@csrf_exempt
@require_http_methods(['POST', 'OPTIONS'])
def tiempo_ruta(request):
    if request.method == 'OPTIONS':
        return cors_preflight()

    try:
        from decouple import config
        groq_key = config('GROQ_API_KEY', default='')
    except ImportError:
        groq_key = os.environ.get('GROQ_API_KEY', '')
    if not groq_key:
        return JsonResponse({'error': 'GROQ_API_KEY no configurada'}, status=500)

    try:
        body    = json.loads(request.body)
        origen  = body.get('origen', '').strip()
        destino = body.get('destino', '').strip()
        if not origen or not destino:
            return JsonResponse({'error': 'Se requieren origen y destino'}, status=400)
    except Exception:
        return JsonResponse({'error': 'Body inválido'}, status=400)

    prompt = PROMPT_TPL.format(origen=origen, destino=destino)

    texto = llamar_groq(prompt, max_tokens=500, temperature=0.1, tag='tiempo_ruta')
    if not texto:
        return JsonResponse({'error': 'Groq no disponible'}, status=502)

    resultado = extraer_objeto_json(texto)
    if resultado is None:
        return JsonResponse({'ok': False, 'error': 'No se pudo interpretar la respuesta de la IA'}, status=502)

    if 'horas' not in resultado and 'minutos' in resultado:
        resultado['horas'] = round(resultado['minutos'] / 60, 1)
    if 'minutos' not in resultado and 'horas' in resultado:
        resultado['minutos'] = round(resultado['horas'] * 60)

    # Si la IA devolvió "horas": 9, "minutos": 30 (en vez de total 570)
    if resultado.get('minutos', 0) < 60 and resultado.get('horas', 0) >= 1:
        resultado['minutos'] = int(resultado['horas']) * 60 + resultado['minutos']

    r = JsonResponse({'ok': True, 'datos': resultado})
    r['Access-Control-Allow-Origin'] = '*'
    return r
