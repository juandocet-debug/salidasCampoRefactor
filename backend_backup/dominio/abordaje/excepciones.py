# dominio/abordaje/excepciones.py
# ⚠️  Python puro — cero imports de Django.

class AbordajeDominioError(Exception):
    """Base para errores de dominio del slice Abordaje."""

class AbordajeNoEncontrado(AbordajeDominioError):
    def __init__(self, salida_id, estudiante_id):
        super().__init__(
            f'No existe registro de abordaje para estudiante={estudiante_id} en salida={salida_id}.'
        )

class CodigoInvalido(AbordajeDominioError):
    """El código de verificación ingresado no coincide o ha expirado."""
    def __init__(self, codigo):
        super().__init__(f'Código «{codigo}» inválido o expirado.')

class EstudianteYaAbordado(AbordajeDominioError):
    """El estudiante ya fue marcado como abordado en esta salida."""
    def __init__(self, estudiante_id, salida_id):
        super().__init__(
            f'El estudiante {estudiante_id} ya abordó la salida {salida_id}.'
        )

class FotoRequeridaParaCodigo(AbordajeDominioError):
    """El estudiante debe subir su foto antes de generar el código."""
