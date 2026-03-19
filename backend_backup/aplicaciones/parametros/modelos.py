# aplicaciones/parametros/modelos.py
# DEPRECATED: Usar parametros.modelos.{parametros,academico,programacion} directamente.
# Este shim se mantiene para no romper admin.py y migraciones.
from .modelos.parametros   import ParametrosSistema    # noqa: F401
from .modelos.academico    import Facultad, Programa   # noqa: F401
from .modelos.programacion import VentanaProgramacion  # noqa: F401
