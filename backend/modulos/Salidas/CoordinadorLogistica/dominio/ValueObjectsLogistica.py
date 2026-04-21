from enum import Enum
from dataclasses import dataclass
from typing import Optional

class EstadoOperativoSalida(Enum):
    APROBADA_CONSEJO = "aprobada_consejo_facultad"
    ASIGNACION_RECURSOS = "asignacion_recursos"
    LISTA_EJECUCION = "lista_ejecucion"
    EJECUTANDOSE = "ejecutandose"
    EJECUTADA = "ejecutada"

class CategoriaLogisticaSalida(Enum):
    URBANA = "urbana"
    REGIONAL = "regional"
    LARGA = "larga"
    LARGA_ESTANCIA = "larga_estancia"

class TipoTransporte(Enum):
    FLOTA_PROPIA = "flota_propia"
    CONTRATADO = "contratado"

class NivelNovedad(Enum):
    BAJA = "baja"
    MEDIA = "media"
    ALTA = "alta"
    CRITICA = "critica"

@dataclass
class AsignacionLogisticaResumen:
    salida_id: str
    codigo: str
    nombre: str
    facultad: str
    estado_operativo: EstadoOperativoSalida
    categoria: CategoriaLogisticaSalida
    # Datos Operativos y Logísticos
    fecha_inicio: str = None
    fecha_fin: str = None
    hora_inicio: str = None
    hora_fin: str = None
    destino_principal: str = None
    num_estudiantes: int = 0
    num_docentes: int = 0
    costo_estimado: float = 0.0
    viaticos_estimados: float = 0.0
    distancia_km: float = 0.0
    duracion_dias: float = 1.0
    horas_viaje: float = 0.0
    
    def to_dict(self):
        return {
            "id": self.salida_id,
            "codigo": self.codigo,
            "nombre": self.nombre,
            "facultad": self.facultad,
            "estado": self.estado_operativo.value,
            "categoria": self.categoria.value,
            "fecha_inicio": self.fecha_inicio,
            "fecha_fin": self.fecha_fin,
            "hora_inicio": self.hora_inicio,
            "hora_fin": self.hora_fin,
            "destino": self.destino_principal,
            "num_estudiantes": self.num_estudiantes,
            "num_docentes": self.num_docentes,
            "costo_estimado": float(self.costo_estimado),
            "viaticos_estimados": float(self.viaticos_estimados),
            "distancia_km": float(self.distancia_km),
            "duracion_dias": float(self.duracion_dias),
            "horas_viaje": float(self.horas_viaje)
        }

@dataclass
class AsignacionVehiculoDTO:
    salida_id: str
    tipo_transporte: TipoTransporte
    placa_o_empresa: str
    conductor_o_contacto: str
    costo_proyectado: float
    
@dataclass
class NovedadOperativaDTO:
    salida_id: str
    nivel: NivelNovedad
    mensaje: str
    
@dataclass
class CierreOperativoDTO:
    salida_id: str
    km_final: int
    checklist_limpieza: bool
    checklist_llantas: bool
    checklist_luces: bool
    observaciones: str
