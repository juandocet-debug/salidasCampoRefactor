# backend/modulos/Salidas/Consejo/aplicacion/SalidaConsejoDTO.py
"""
DTO (Data Transfer Object) de la capa de Aplicación para el módulo Consejo.
Concentra todos los datos que la UI del Consejo de Facultad necesita ver para
una Salida de Campo, incluyendo el concepto del Coordinador y la decisión del
Consejo si ya existe.
No depende de ningún framework ni de Django ORM.
"""
from dataclasses import dataclass, field
from typing import Optional, Dict, Any


@dataclass
class RevisionCoordinadorDTO:
    """Resumen del concepto del Coordinador para que el Consejo lo visualice."""
    concepto_final: str
    pertinencia_estado: Optional[str] = None
    pertinencia_obs: Optional[str] = None
    objetivos_estado: Optional[str] = None
    objetivos_obs: Optional[str] = None
    metodologia_estado: Optional[str] = None
    metodologia_obs: Optional[str] = None
    viabilidad_estado: Optional[str] = None
    viabilidad_obs: Optional[str] = None
    fecha: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            'concepto_final': self.concepto_final,
            'pertinencia_estado': self.pertinencia_estado,
            'pertinencia_obs': self.pertinencia_obs,
            'objetivos_estado': self.objetivos_estado,
            'objetivos_obs': self.objetivos_obs,
            'metodologia_estado': self.metodologia_estado,
            'metodologia_obs': self.metodologia_obs,
            'viabilidad_estado': self.viabilidad_estado,
            'viabilidad_obs': self.viabilidad_obs,
            'fecha': self.fecha,
        }


@dataclass
class DecisionConsejoDTO:
    """Decisión ya registrada por el Consejo, si existe."""
    concepto_financiero: str
    observaciones: Optional[str] = None
    acta: Optional[str] = None
    fecha_acta: Optional[str] = None
    fecha_decision: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            'concepto_financiero': self.concepto_financiero,
            'observaciones': self.observaciones,
            'acta': self.acta,
            'fecha_acta': self.fecha_acta,
            'fecha_decision': self.fecha_decision,
        }


@dataclass
class SalidaConsejoDTO:
    """DTO plano que el Controlador puede serializar directamente a JSON."""
    id: int
    nombre: str
    estado: str
    codigo: str
    asignatura: str
    destino: str
    semestre: str
    profesor_id: Optional[int]
    fecha_inicio: Optional[str]
    fecha_fin: Optional[str]
    num_estudiantes: int
    programa_id: Optional[int]
    justificacion: str
    costo_estimado: float
    objetivo_general: str
    revision_coordinador: Optional[RevisionCoordinadorDTO] = None
    decision_consejo: Optional[DecisionConsejoDTO] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'nombre': self.nombre,
            'estado': self.estado,
            'codigo': self.codigo,
            'asignatura': self.asignatura,
            'destino': self.destino,
            'semestre': self.semestre,
            'profesor_id': self.profesor_id,
            'fecha_inicio': self.fecha_inicio,
            'fecha_fin': self.fecha_fin,
            'num_estudiantes': self.num_estudiantes,
            'programa_id': self.programa_id,
            'justificacion': self.justificacion,
            'costo_estimado': self.costo_estimado,
            'objetivo_general': self.objetivo_general,
            'revision_coordinador': self.revision_coordinador.to_dict() if self.revision_coordinador else None,
            'decision_consejo': self.decision_consejo.to_dict() if self.decision_consejo else None,
        }
