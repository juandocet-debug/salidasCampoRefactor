# configuracion/settings/desarrollo.py
# ─────────────────────────────────────────────────────────────────────────────
# CONFIGURACIÓN DE DESARROLLO — Extiende base.py
# Usa SQLite localmente. Debug activado.
# ─────────────────────────────────────────────────────────────────────────────

from .base import *
from decouple import config

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# ── Base de datos: SQLite (sin configuración extra) ───────────────────────────
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME':   BASE_DIR / config('DB_NOMBRE', default='otium.sqlite3'),
    }
}

# ── CORS: permite todas las rutas en desarrollo ───────────────────────────────
CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'cache-control',
]

# ── Logs simples en consola ───────────────────────────────────────────────────
LOGGING = {
    'version': 1,
    'handlers': {
        'consola': { 'class': 'logging.StreamHandler' },
    },
    'root': {
        'handlers': ['consola'],
        'level':    'DEBUG',
    },
}
