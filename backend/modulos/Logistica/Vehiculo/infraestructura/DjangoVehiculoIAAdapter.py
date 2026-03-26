import json
import urllib.request
import urllib.error
from typing import Optional
from modulos.Logistica.Vehiculo.dominio.VehiculoIAPort import VehiculoIAPort

try:
    from decouple import config
except ImportError:
    import os
    config = lambda key, default='', cast=str: cast(os.environ.get(key, default))

_PROMPT_TPL = (
    'Eres un Asistente Experto en parque automotor y flotas de transporte en Colombia. '
    'El administrador de transporte te pregunta lo siguiente: "{consulta}". '
    'Tu objetivo es responder de forma clara, directa y concisa proporcionando '
    'los datos técnicos solicitados, pero si te preguntan porCONSUMO, OBLIGATORIAMENTE DEBE SER EN Kilómetros por Galón (km/gal). '
    'REGLAS ESTRICTAS: '
    '1. Responde en lenguaje natural breve (máximo un párrafo corto). '
    '2. IMPORTANTE: La mayoría de fichas técnicas en internet muestran consumo en km/L (kilómetros por litro). '
    '   DEBES MULTIPLICAR ese valor por 3.785 para dar el dato en km/gal al usuario. '
    '   Por ejemplo, si un vehículo hace 12 km/L, la respuesta correcta es ~45 km/gal. ¡NUNCA digas que hace 12 km/gal, eso es un error gravísimo! '
    '3. NO utilices formato JSON. Escribe texto normal directo al usuario.'
)

class DjangoVehiculoIAAdapter(VehiculoIAPort):
    """
    Adaptador de Infraestructura para el Asistente IA de Vehículos usando Groq como motor principal y Gemini como Fallback.
    Aquí es "DONDE ESTÁN" las llaves de la API de IA explícitamente.
    """

    def consultar_datos_tecnicos(self, consulta: str) -> Optional[str]:
        prompt = _PROMPT_TPL.format(consulta=consulta)
        
        # 1. Intentar llamar a Groq (Llama 3.3 70b)
        respuesta = self._llamar_groq(prompt)
        if respuesta:
            return respuesta
            
        # 2. Si falla Groq, intentar Gemini (Fallback)
        respuesta_gemini = self._llamar_gemini(prompt)
        if respuesta_gemini:
            return respuesta_gemini
            
        return None

    def _llamar_groq(self, prompt: str) -> Optional[str]:
        groq_key = config('GROQ_API_KEY', default='')
        if not groq_key:
            return None
            
        try:
            payload = json.dumps({
                'model': 'llama-3.3-70b-versatile',
                'messages': [{'role': 'user', 'content': prompt}],
                'temperature': 0.1,
                'max_tokens': 1000,
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
        except Exception as e:
            print("[GROQ IA Adapter] Error:", str(e))
            return None

    def _llamar_gemini(self, prompt: str) -> Optional[str]:
        gemini_key = config('GEMINI_API_KEY', default='')
        if not gemini_key:
            return None
            
        url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_key}'
        try:
            payload = json.dumps({
                'contents': [{'parts': [{'text': prompt}]}],
                'generationConfig': {'temperature': 0.1, 'maxOutputTokens': 1000},
            }).encode('utf-8')
            
            req = urllib.request.Request(
                url, data=payload,
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
        except Exception as e:
            print("[GEMINI IA Adapter] Error:", str(e))
            return None
