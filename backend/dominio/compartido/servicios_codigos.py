# CAPA: Dominio — Compartido
# QUÉ HACE: Generación de códigos compartidos entre módulos (abordaje, conductor)
# NO DEBE CONTENER: Django, ORM, lógica de vistas

import secrets
from datetime import datetime, timedelta


def generar_codigo_abordaje() -> str:
    """Genera código alfanumérico de 6 caracteres para abordaje."""
    return secrets.token_hex(3).upper()


def calcular_expiracion(horas: int = 24) -> datetime:
    """Calcula la fecha de expiración de un código."""
    return datetime.now() + timedelta(hours=horas)
