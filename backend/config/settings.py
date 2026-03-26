# config/settings.py
# ─────────────────────────────────────────────────────────────────────────────
# Configuración unificada de Django — Arquitectura Hexagonal
# ─────────────────────────────────────────────────────────────────────────────

from pathlib import Path
from datetime import timedelta

try:
    from decouple import config
except ImportError:
    import os
    config = lambda key, default=None, cast=str: cast(os.environ.get(key, default))

# Raíz del proyecto (carpeta backend/)
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY', default='clave-insegura-solo-para-dev')
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# ── Aplicaciones instaladas ──────────────────────────────────────────────────
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

TERCEROS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
]

# Apps del proyecto registradas desde infraestructura/
APPS_PROYECTO = [
    # Módulos DDD
    'modulos.Usuarios.infraestructura',
    'modulos.Catalogos.Facultad.infraestructura',
    'modulos.Catalogos.Programa.infraestructura',
    'modulos.Catalogos.Ventana.infraestructura',
    'modulos.Logistica.Vehiculo.infraestructura',
    'modulos.Logistica.Parametro.infraestructura',
    'modulos.Salidas.Core.infraestructura',
    'modulos.Salidas.Planeacion.infraestructura',
    'modulos.Salidas.Itinerario.infraestructura',
    'modulos.Salidas.Itinerario.Parada.infraestructura',

    # Apps del sistema anterior (si deciden conservarse temporalmente)ura.apps.UsuariosInfraConfig',
]

INSTALLED_APPS = DJANGO_APPS + TERCEROS + APPS_PROYECTO

# ── Middleware ────────────────────────────────────────────────────────────────
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# ── Base de datos ─────────────────────────────────────────────────────────────
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / config('DB_NOMBRE', default='otium.sqlite3'),
    }
}

# ── DRF ───────────────────────────────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
}

# ── JWT ───────────────────────────────────────────────────────────────────────
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=int(config('JWT_HORAS_EXPIRACION', default='8'))),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ── CORS ──────────────────────────────────────────────────────────────────────
CORS_ALLOW_ALL_ORIGINS = True

# ── Internacionalización ─────────────────────────────────────────────────────
LANGUAGE_CODE = 'es-co'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True

# ── Archivos estáticos y media ────────────────────────────────────────────────
STATIC_URL = '/static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ── Modelo de usuario personalizado ───────────────────────────────────────────
# AUTH_USER_MODEL = 'usuarios.Usuario'
