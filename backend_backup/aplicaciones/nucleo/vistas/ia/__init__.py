# aplicaciones/nucleo/vistas/ia/__init__.py
# Re-exporta los endpoints IA para que urls.py pueda importar limpiamente.
from .municipios import municipios_en_ruta
from .vehiculo   import rendimiento_vehiculo
from .tiempo     import tiempo_ruta
from .utils      import cors_preflight, llamar_groq, llamar_gemini, extraer_lista_json, extraer_objeto_json

__all__ = [
    'municipios_en_ruta',
    'rendimiento_vehiculo',
    'tiempo_ruta',
    'cors_preflight',
    'llamar_groq',
    'llamar_gemini',
    'extraer_lista_json',
    'extraer_objeto_json',
]
