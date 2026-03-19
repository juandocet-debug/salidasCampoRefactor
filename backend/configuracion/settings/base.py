# configuracion/settings/base.py
# ─────────────────────────────────────────────────────────────────────────────
# CONFIGURACIÓN BASE — Compartida por desarrollo y producción.
# No importa directamente. Los archivos desarrollo.py y produccion.py la extienden.
# ─────────────────────────────────────────────────────────────────────────────

from pathlib import Path
from datetime import timedelta
from decouple import config

# Raíz del proyecto (carpeta backend/)
BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = config('SECRET_KEY', default='clave-insegura-solo-para-dev')

# ── Aplicaciones instaladas ───────────────────────────────────────────────────
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

APLICACIONES_OTIUM = [
    'aplicaciones.usuarios.apps.UsuariosConfig',
    'aplicaciones.salidas.apps.SalidasConfig',
    'aplicaciones.parametros.apps.ParametrosConfig',
    'aplicaciones.transporte.apps.TransporteConfig',
    'aplicaciones.presupuesto.apps.PresupuestoConfig',
    'aplicaciones.abordaje.apps.AbordajeConfig',
    'aplicaciones.novedades.apps.NovedadesConfig',
    'aplicaciones.checklist.apps.ChecklistConfig',
]

INSTALLED_APPS = DJANGO_APPS + TERCEROS + APLICACIONES_OTIUM

# ── Middleware ─────────────────────────────────────────────────────────────────
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',          # CORS (primero)
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'configuracion.urls'

# Requerido por el panel admin de Django
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS':    [],
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


# ── Modelo de usuario personalizado ──────────────────────────────────────────
# Usamos nuestro propio modelo con campo 'rol'
AUTH_USER_MODEL = 'usuarios.Usuario'

# ── Configuración de Django REST Framework ────────────────────────────────────
REST_FRAMEWORK = {
    # Autenticación por defecto: JWT
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    # Solo usuarios autenticados por defecto
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    # Formato de respuesta: JSON siempre
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
}

# ── Configuración de JWT ───────────────────────────────────────────────────────
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME':  timedelta(hours=config('JWT_HORAS_EXPIRACION', default=8, cast=int)),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES':      ('Bearer',),
}

# ── Internacionalización ───────────────────────────────────────────────────────
LANGUAGE_CODE = 'es-co'
TIME_ZONE     = 'America/Bogota'
USE_I18N      = True
USE_TZ        = True

# ── Archivos estáticos ─────────────────────────────────────────────────────────
STATIC_URL = '/static/'

# ── Archivos de medios (fotos de vehículos, etc.) ───────────────────────
MEDIA_URL  = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
