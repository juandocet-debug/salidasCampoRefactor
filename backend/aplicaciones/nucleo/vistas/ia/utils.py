# aplicaciones/nucleo/vistas/ia/utils.py
# ─────────────────────────────────────────────────────────────────────────────
# Utilidades compartidas para todos los endpoints de IA (Groq + Gemini)
# ─────────────────────────────────────────────────────────────────────────────
import os
import re
import json
import urllib.request
from django.http import JsonResponse

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
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
    groq_key = os.environ.get('GROQ_API_KEY', '')
    if not groq_key:
        return None
    try:
        import requests as http_requests
        resp = http_requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {groq_key}',
                'Content-Type': 'application/json',
            },
            json={
                'model': 'llama-3.3-70b-versatile',
                'messages': [{'role': 'user', 'content': prompt}],
                'temperature': temperature,
                'max_tokens': max_tokens,
            },
            timeout=20,
        )
        if resp.status_code == 200:
            return resp.json()['choices'][0]['message']['content']
        print(f'[{tag}] Groq error: {resp.status_code}')
    except Exception as e:
        print(f'[{tag}] Groq exception: {e}')
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
            headers={'Content-Type': 'application/json'}, method='POST',
        )
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read())
        return (
            data.get('candidates', [{}])[0]
                .get('content', {})
                .get('parts', [{}])[0]
                .get('text', '')
        )
    except Exception as e:
        print(f'[{tag}] Gemini exception: {e}')
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
