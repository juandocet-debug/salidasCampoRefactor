# dominio/abordaje/valor_objetos.py
# ─────────────────────────────────────────────────────────────────────────────
# VALOR OBJETOS del slice Abordaje
# ⚠️  Python puro — cero imports de Django.
# ─────────────────────────────────────────────────────────────────────────────

from enum import Enum


class EstadoDocumento(str, Enum):
    """Estado de un documento del estudiante."""
    VIGENTE    = 'vigente'
    VENCIDO    = 'vencido'
    NO_CARGADO = 'no_cargado'


class TipoDocumento(str, Enum):
    """Tipos de documento requeridos para participar en una salida."""
    IDENTIDAD      = 'identidad'
    EPS_ARL        = 'eps_arl'
    CONSENTIMIENTO = 'consentimiento'
    POLIZA         = 'poliza'


class RolVerificador(str, Enum):
    """
    Quién confirmó el abordaje del estudiante.
    Usado en la columna "Verificado por" del Coordinador de Salidas.
    """
    CONDUCTOR = 'conductor'
    PROFESOR  = 'profesor'
