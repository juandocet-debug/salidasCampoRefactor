# configuracion/settings/produccion.py
# ─────────────────────────────────────────────────────────────────────────────
# CONFIGURACIÓN DE PRODUCCIÓN — Extiende base.py
# Usa PostgreSQL. Debug desactivado. CORS restringido.
# ─────────────────────────────────────────────────────────────────────────────

from .base import *
from decouple import config

DEBUG = False

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')

# ── Base de datos: PostgreSQL ─────────────────────────────────────────────────
# Para migrar de SQLite a Postgres: solo cambia este bloque.
# El resto de la app (modelos, vistas, urls) NO cambia nada.
DATABASES = {
    'default': {
        'ENGINE':   'django.db.backends.postgresql',
        'NAME':     config('DB_NOMBRE'),
        'USER':     config('DB_USUARIO'),
        'PASSWORD': config('DB_CONTRASENA'),
        'HOST':     config('DB_HOST', default='localhost'),
        'PORT':     config('DB_PUERTO', default='5432'),
    }
}

# ── CORS: solo el dominio del frontend ───────────────────────────────────────
CORS_ALLOWED_ORIGINS = config('CORS_ORIGINS', default='http://localhost:5173').split(',')

# ── Seguridad ─────────────────────────────────────────────────────────────────
SECURE_BROWSER_XSS_FILTER      = True
SECURE_CONTENT_TYPE_NOSNIFF    = True
X_FRAME_OPTIONS                = 'DENY'
