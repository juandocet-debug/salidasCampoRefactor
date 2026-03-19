# aplicaciones/nucleo/servicios/codigos.py
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# GENERADOR DE CÃ“DIGO DE ABORDAJE â€” FunciÃ³n pura Python.
# Genera un cÃ³digo alfanumÃ©rico de 6 caracteres legibles.
# Sin I, O, 0, 1 para evitar confusiones visuales.
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import secrets
from datetime import datetime, time

CARACTERES = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'


def generar_codigo(longitud: int = 6) -> str:
    """
    Genera un cÃ³digo alfanumÃ©rico Ãºnico.
    Ejemplo: 'K4MZ7R'

    Args:
        longitud: nÃºmero de caracteres (por defecto 6)

    Returns:
        Cadena alfanumÃ©rica en mayÃºsculas
    """
    return ''.join(secrets.choice(CARACTERES) for _ in range(longitud))


def calcular_expiracion(fecha_salida) -> datetime:
    """
    Calcula la fecha-hora de expiraciÃ³n del cÃ³digo.
    El cÃ³digo es vÃ¡lido hasta la medianoche del dÃ­a de la salida.

    Args:
        fecha_salida: objeto date con la fecha de inicio de la salida

    Returns:
        datetime con la expiraciÃ³n (23:59:59 del dÃ­a de la salida)
    """
    from django.utils import timezone
    from datetime import timedelta

    expiracion = datetime.combine(fecha_salida, time(23, 59, 59))
    return timezone.make_aware(expiracion)

