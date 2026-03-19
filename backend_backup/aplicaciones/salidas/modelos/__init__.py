# aplicaciones/salidas/modelos/__init__.py
# ─────────────────────────────────────────────────────────────────────────────
# PUNTO DE ENTRADA DEL PAQUETE DE MODELOS
# Re-exporta todo para que el resto del sistema use:
#   from aplicaciones.salidas.modelos import Salida, Revision, etc.
# ─────────────────────────────────────────────────────────────────────────────

from .salida      import Salida
from .planeacion  import PlaneacionPedagogica, ObjetivoEspecifico, Competencia
from .logistica   import PuntoRuta, CriterioEvaluacion
from .aprobacion  import Revision, CriterioRevision, DecisionConsejo

__all__ = [
    # Core
    'Salida',
    # Planeación pedagógica
    'PlaneacionPedagogica',
    'ObjetivoEspecifico',
    'Competencia',
    # Logística
    'PuntoRuta',
    'CriterioEvaluacion',
    # Flujo de aprobación
    'Revision',
    'CriterioRevision',
    'DecisionConsejo',
]
