#!/usr/bin/env python
"""
manage.py — Punto de entrada para comandos de Django.
Uso: python manage.py runserver | migrate | createsuperuser | etc.
"""
import os
import sys
from pathlib import Path

# Cargar variables de entorno desde .env
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent / '.env')
except ImportError:
    pass  # Si no está instalado dotenv, las variables deben estar en el entorno

def main():
    # Lee el entorno para saber qué settings usar
    entorno = os.environ.get('DJANGO_ENTORNO', 'development')
    if entorno == 'production':
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configuracion.settings.produccion')
    else:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configuracion.settings.desarrollo')

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "No se pudo importar Django. "
            "¿Activaste el entorno virtual? ¿Instalaste requirements.txt?"
        ) from exc

    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
