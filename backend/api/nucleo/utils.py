# aplicaciones/nucleo/vistas/ia/utils.py
# ─────────────────────────────────────────────────────────────────────────────
# Utilidades compartidas para todos los endpoints de IA (Groq + Gemini)
# ─────────────────────────────────────────────────────────────────────────────
import re
import json
import urllib.request
import urllib.error
from django.http import JsonResponse

try:
    from decouple import config
except ImportError:
    import os
    config = lambda key, default='', cast=str: cast(os.environ.get(key, default))

GEMINI_API_KEY = config('GEMINI_API_KEY', default='')
GEMINI_URL = (
    'https://generativelanguage.googleapis.com/v1beta/models/'
    'gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY
)


def cors_preflight():
    """Devuelve una respuesta vacía con cabeceras CORS para preflight OPTIONS."""
    response = JsonResponse({})
    response['Access-Control-Allow-Origin']  = '*'
    response['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response


def llamar_groq(prompt: str, *, max_tokens: int = 800, temperature: float = 0.1, tag: str = '') -> str | None:
    """
    Llama a la API de Groq (Llama 3.3 70b).
    Retorna el texto de la respuesta o None si falla.
    """
    groq_key = config('GROQ_API_KEY', default='')
    if not groq_key:
        return None
    try:
        payload = json.dumps({
            'model': 'llama-3.3-70b-versatile',
            'messages': [{'role': 'user', 'content': prompt}],
            'temperature': temperature,
            'max_tokens': max_tokens,
        }).encode('utf-8')
        req = urllib.request.Request(
            'https://api.groq.com/openai/v1/chat/completions',
            data=payload,
            headers={
                'Authorization': f'Bearer {groq_key}',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            },
            method='POST',
        )
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read())
            return data['choices'][0]['message']['content']
    except urllib.error.HTTPError as e:
        print("[GROQ] HTTPError:", e.read().decode('utf-8', 'ignore'))
    except Exception as e:
        print("[GROQ] Exception:", str(e))
    return None


def llamar_gemini(prompt: str, *, max_tokens: int = 800, temperature: float = 0.1, tag: str = '') -> str | None:
    """
    Llama a la API de Gemini 2.0 Flash.
    Retorna el texto de la respuesta o None si falla.
    """
    if not GEMINI_API_KEY:
        return None
    try:
        payload = json.dumps({
            'contents': [{'parts': [{'text': prompt}]}],
            'generationConfig': {'temperature': temperature, 'maxOutputTokens': max_tokens},
        }).encode('utf-8')
        req = urllib.request.Request(
            GEMINI_URL, data=payload,
            headers={
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            }, method='POST',
        )
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read())
        return (
            data.get('candidates', [{}])[0]
                .get('content', {})
                .get('parts', [{}])[0]
                .get('text', '')
        )
    except urllib.error.HTTPError as e:
        print("[GEMINI] HTTPError:", e.read().decode('utf-8', 'ignore'))
    except Exception as e:
        print("[GEMINI] Exception:", str(e))
    return None


def extraer_lista_json(texto: str) -> list | None:
    """Extrae el primer array JSON válido de un texto."""
    match = re.search(r'\[[\s\S]*\]', texto)
    if match:
        try:
            resultado = json.loads(match.group())
            if isinstance(resultado, list):
                return resultado
        except json.JSONDecodeError:
            pass
    return None


def extraer_objeto_json(texto: str) -> dict | None:
    """Extrae el primer objeto JSON válido de un texto."""
    match = re.search(r'\{[\s\S]*\}', texto)
    if match:
        try:
            resultado = json.loads(match.group())
            if isinstance(resultado, dict):
                return resultado
        except json.JSONDecodeError:
            pass
    return None
