import json
import re
import urllib.request
from typing import Optional
from modulos.Salidas.Itinerario.dominio.GeneradorRutaIAPort import GeneradorRutaIAPort

try:
    from decouple import config
except ImportError:
    import os
    config = lambda key, default='': os.environ.get(key, default)

_GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

def _groq_headers(key: str) -> dict:
    return {
        'Authorization': f'Bearer {key}',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',
    }

def _llamar_groq(prompt: str, *, model: str = 'llama-3.3-70b-versatile',
                 max_tokens: int = 800, temperature: float = 0.1) -> Optional[str]:
    """Helper: Llama a Groq y devuelve el texto de la respuesta o None si falla."""
    groq_key = config('GROQ_API_KEY', default='')
    if not groq_key:
        return None
    try:
        payload = json.dumps({
            'model': model,
            'messages': [{'role': 'user', 'content': prompt}],
            'temperature': temperature,
            'max_tokens': max_tokens,
        }).encode('utf-8')
        req = urllib.request.Request(_GROQ_URL, data=payload, headers=_groq_headers(groq_key), method='POST')
        with urllib.request.urlopen(req, timeout=20) as resp:
            if resp.status == 200:
                return json.loads(resp.read().decode('utf-8'))['choices'][0]['message']['content']
    except Exception as e:
        print('[GROQ] Error:', e)
    return None

def _extraer_objeto_json(texto: str) -> dict:
    """Extrae el primer objeto JSON valido de un texto libre."""
    match = re.search(r'\{[\s\S]*\}', texto)
    if match:
        try:
            resultado = json.loads(match.group())
            if isinstance(resultado, dict):
                return resultado
        except json.JSONDecodeError:
            pass
    return {}

def _extraer_lista_json(texto: str) -> list:
    """Extrae la primera lista JSON valida de un texto libre."""
    texto = re.sub(r'```json\n?', '', texto)
    texto = re.sub(r'```\n?', '', texto).strip()
    try:
        obj = json.loads(texto)
        if isinstance(obj, dict) and 'municipios' in obj:
            return obj['municipios']
        if isinstance(obj, list):
            return obj
    except Exception:
        pass
    match = re.search(r'\[[\s\S]*?\]', texto)
    if match:
        try:
            arr = json.loads(match.group())
            if isinstance(arr, list):
                return arr
        except Exception:
            pass
    return []


_PROMPT_ASISTENCIA = (
    "Eres un analizador de terreno y logistica geografica. "
    "Un administrador de viajes te da la siguiente ruta: '{contexto_ruta}'. "
    "Responde SOLO con recomendaciones logisticas breves (peligros climaticos, "
    "estaciones sugeridas, precauciones de terreno). "
    "Mantenlo conciso, menos de 3 oraciones."
)

_PROMPT_MUNICIPIOS = (
    "Actua como un GPS estricto. La ruta va desde '{inicio}' hasta '{fin}'. "
    "Instrucciones o paradas intermedias: '{instrucciones}'. "
    "Devuelve un JSON estricto con una clave \"municipios\" que contenga un arreglo "
    "de strings con los nombres exactos de los municipios y pueblos intermedios que "
    "se atraviesan en Colombia en esta ruta. "
    'Ejemplo: {{"municipios": ["Pueblo1", "Pueblo2"]}}'
)

_PROMPT_TIEMPO = (
    'Eres un experto en transporte terrestre en Colombia. '
    'Calcula un tiempo REALISTA de viaje en bus o buseta '
    'desde "{origen}" hasta "{destino}". '
    'REGLAS: '
    '1. Usa como base el tiempo en carro y ajustalo de forma REALISTA (no exagerada). '
    '2. Incremento tipico bus vs carro: entre 10% y 25%, no mas. '
    '3. Velocidad promedio real bus Colombia: 55-70 km/h en carretera. '
    '4. Considera paradas cortas y trafico urbano moderado. '
    '5. Bogota-Medellin referencia: carro 8-9h -> bus 9-10h maximo. '
    '6. NO sobreestimar tiempos. Priorizar realismo. '
    'Responde SOLO JSON: '
    '{{"horas": 9, "minutos": 540, "distancia_km": 415, '
    '"velocidad_promedio_kmh": 60, "nota": "Ruta tipica con trafico moderado"}}'
)


class DjangoRutaIAAdapter(GeneradorRutaIAPort):
    """
    Adapter de infraestructura que llama a Groq (Llama) para 
    analizar rutas geográficas del Itinerario.
    Sigue el patron del proyecto anterior (vistas_ia.py).
    """

    def consultar_asistencia_ruta(self, contexto_ruta: str) -> str:
        prompt = _PROMPT_ASISTENCIA.format(contexto_ruta=contexto_ruta)
        texto = _llamar_groq(prompt, max_tokens=1000, temperature=0.3)
        if texto:
            return texto
        return "El asistente geografico no esta disponible actualmente."

    def extraer_municipios_ruta(self, inicio: str, fin: str, instrucciones: str = '') -> list:
        prompt = _PROMPT_MUNICIPIOS.format(inicio=inicio, fin=fin, instrucciones=instrucciones)
        texto = _llamar_groq(prompt, model='llama-3.1-8b-instant', max_tokens=1200, temperature=0.1)
        if texto:
            return _extraer_lista_json(texto)
        return []

    def estimar_tiempo_ruta(self, origen: str, destino: str) -> dict:
        prompt = (
            f'Tiempo de viaje en bus desde "{origen}" hasta "{destino}" en Colombia. '
            'Considera trafico y cordilleras. '
            'Responde SOLO JSON: {"minutos": NUMERO_ENTERO, "distancia_km": NUMERO_KM_REALES_EN_CARRETERA}'
        )
        groq_key = config('GROQ_API_KEY', default='')
        if not groq_key:
            return {'minutos': 0, 'distancia_km': 0}
        try:
            payload = json.dumps({
                'model': 'llama-3.1-8b-instant',
                'messages': [{'role': 'user', 'content': prompt}],
                'temperature': 0.0,
                'max_tokens': 60,
                'response_format': {'type': 'json_object'},
            }).encode('utf-8')
            req = urllib.request.Request(
                _GROQ_URL, data=payload,
                headers=_groq_headers(groq_key), method='POST'
            )
            with urllib.request.urlopen(req, timeout=12) as resp:
                if resp.status == 200:
                    texto = json.loads(resp.read().decode('utf-8'))['choices'][0]['message']['content']
                    obj = _extraer_objeto_json(texto)
                    minutos = obj.get('minutos', 0) or obj.get('horas', 0) * 60
                    distancia = obj.get('distancia_km', 0)
                    print(f'[IA] {origen}->{destino}: {minutos} min / {distancia} km')
                    return {'minutos': int(minutos), 'distancia_km': float(distancia)}
        except Exception as e:
            print('[IA] Error Tiempo:', e)
        return {'minutos': 0, 'distancia_km': 0}
