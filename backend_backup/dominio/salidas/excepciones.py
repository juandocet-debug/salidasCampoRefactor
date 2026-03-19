# dominio/salidas/excepciones.py
# ─────────────────────────────────────────────────────────────────────────────
# EXCEPCIONES DE DOMINIO del slice Salidas
#
# Las excepciones de dominio representan violaciones a las reglas de negocio.
# Son lanzadas desde las entidades o casos de uso, y capturadas en los
# adaptadores (vistas DRF) para convertirlas en respuestas HTTP adecuadas.
#
# ⚠️  CERO imports de Django aquí. Solo Python puro.
# ─────────────────────────────────────────────────────────────────────────────


class SalidaDominioError(Exception):
    """Excepción base para todos los errores del dominio de salidas."""


class SalidaNoEncontrada(SalidaDominioError):
    """La salida solicitada no existe en el sistema."""
    def __init__(self, salida_id):
        super().__init__(f'Salida con id={salida_id!r} no encontrada.')


class TransicionNoPermitida(SalidaDominioError):
    """
    Se intentó mover la salida a un estado que no está permitido
    desde el estado actual.
    """
    def __init__(self, estado_actual, estado_destino):
        super().__init__(
            f'No se puede transicionar de «{estado_actual}» a «{estado_destino}».'
        )


class SalidaSinPermiso(SalidaDominioError):
    """El usuario no tiene permiso para realizar esta acción sobre la salida."""
    def __init__(self, usuario_id, accion: str):
        super().__init__(
            f'El usuario {usuario_id!r} no tiene permiso para: {accion}.'
        )


class ParametrosCostoInvalidos(SalidaDominioError):
    """Los parámetros de costo proporcionados no son válidos."""
