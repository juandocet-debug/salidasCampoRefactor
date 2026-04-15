"""
DTO (Data Transfer Object) de la capa de Aplicación.
Concentra todos los datos que la UI de Coordinación necesita ver
para una Salida, incluyendo su Revisión Pedagógica si existe.
El Controlador (Infraestructura) SOLO serializa este objeto a JSON.
No depende de ningún framework ni de Django ORM.
"""
from dataclasses import dataclass, field
from typing import Optional, Dict, Any


@dataclass
class CriterioDTO:
    estado: str
    observacion: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {'estado': self.estado, 'observacion': self.observacion or ''}


@dataclass
class RevisionDTO:
    concepto_final: str
    pertinencia: CriterioDTO
    objetivos: CriterioDTO
    metodologia: CriterioDTO
    viabilidad: CriterioDTO
    fecha: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            'concepto_final': self.concepto_final,
            'pertinencia': self.pertinencia.to_dict(),
            'objetivos': self.objetivos.to_dict(),
            'metodologia': self.metodologia.to_dict(),
            'viabilidad': self.viabilidad.to_dict(),
            'fecha': self.fecha,
        }


@dataclass
class SalidaCoordinacionDTO:
    """DTO plano que el Controlador puede serializar directamente a JSON."""
    id: int
    nombre: str
    estado: str
    codigo: str
    asignatura: str
    destino: str
    semestre: str
    profesor_id: Optional[int]
    profesor_nombre: Optional[str]
    fecha_inicio: Optional[str]
    fecha_fin: Optional[str]
    num_estudiantes: int
    programa_id: Optional[int]
    justificacion: str
    costo_estimado: float
    resumen: str
    objetivo_general: str
    ultima_revision: Optional[RevisionDTO] = None

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
            'profesor_nombre': self.profesor_nombre,
            'fecha_inicio': self.fecha_inicio,
            'fecha_fin': self.fecha_fin,
            'num_estudiantes': self.num_estudiantes,
            'programa_id': self.programa_id,
            'justificacion': self.justificacion,
            'costo_estimado': self.costo_estimado,
            'resumen': self.resumen,
            'objetivo_general': self.objetivo_general,
            'ultima_revision': self.ultima_revision.to_dict() if self.ultima_revision else None,
        }
