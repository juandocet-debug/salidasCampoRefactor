from dataclasses import dataclass
from typing import Optional
from datetime import datetime

from modulos.Salidas.Core.dominio.SalidaId import SalidaId
from modulos.Usuarios.dominio.UsuarioId import UsuarioId

from .RevisionPedagogicaId import RevisionPedagogicaId
from .CriterioEvaluacion import CriterioEvaluacion, EstadoCriterio
from .ConceptoFinal import ConceptoFinal

@dataclass
class RevisionPedagogica:
    id: RevisionPedagogicaId
    salida_id: SalidaId
    coordinador_id: UsuarioId
    
    pertinencia: CriterioEvaluacion
    objetivos: CriterioEvaluacion
    metodologia: CriterioEvaluacion
    viabilidad: CriterioEvaluacion
    
    concepto_final: ConceptoFinal
    fecha_revision: Optional[datetime] = None

    @classmethod
    def crear_nueva(cls, salida_id: SalidaId) -> 'RevisionPedagogica':
        criterio_pendiente = CriterioEvaluacion(estado=EstadoCriterio.PENDIENTE)
        return cls(
            id=RevisionPedagogicaId(None),
            salida_id=salida_id,
            coordinador_id=UsuarioId(None), 
            pertinencia=criterio_pendiente,
            objetivos=criterio_pendiente,
            metodologia=criterio_pendiente,
            viabilidad=criterio_pendiente,
            concepto_final=ConceptoFinal.PENDIENTE,
            fecha_revision=None
        )
