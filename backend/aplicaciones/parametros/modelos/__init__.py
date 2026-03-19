# aplicaciones/parametros/modelos/__init__.py
# Re-exporta todos los modelos de parámetros para admin.py y las migraciones.
from .parametros   import ParametrosSistema
from .academico    import Facultad, Programa
from .programacion import VentanaProgramacion

__all__ = ['ParametrosSistema', 'Facultad', 'Programa', 'VentanaProgramacion']
