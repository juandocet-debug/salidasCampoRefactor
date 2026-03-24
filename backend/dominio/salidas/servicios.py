# CAPA: Dominio
# QUÉ HACE: Servicios de dominio exclusivos del módulo salidas
# NO DEBE CONTENER: Django, ORM, lógica de vistas

import uuid


def generar_codigo_salida() -> str:
    return f'SC-{uuid.uuid4().hex[:8].upper()}'
