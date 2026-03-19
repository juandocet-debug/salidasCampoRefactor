"""
configuracion/wsgi.py — Interfaz WSGI para servidores de producción (Gunicorn, etc.)
"""
import os
from django.core.wsgi import get_wsgi_application

entorno = os.environ.get('DJANGO_ENTORNO', 'development')
if entorno == 'production':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configuracion.settings.produccion')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configuracion.settings.desarrollo')

application = get_wsgi_application()
