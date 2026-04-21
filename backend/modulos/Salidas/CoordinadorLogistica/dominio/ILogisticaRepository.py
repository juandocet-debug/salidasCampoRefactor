from abc import ABC, abstractmethod
from typing import List
from .ValueObjectsLogistica import AsignacionLogisticaResumen

class ILogisticaRepository(ABC):
    @abstractmethod
    def obtener_salidas_por_estado(self, estado: str) -> List[AsignacionLogisticaResumen]:
        """
        Obtiene un listado resumido de salidas que se encuentren en un estado
        operativo específico (ej. aprobada_consejo_facultad)
        """
        pass
        
    @abstractmethod
    def actualizar_estado_operativo(self, salida_id: str, nuevo_estado: str) -> bool:
        """
        Cambia el estado operativo de una salida
        """
        pass

    @abstractmethod
    def guardar_asignacion_vehiculo(self, dto: 'AsignacionVehiculoDTO') -> bool:
        """Guarda los datos logísticos de un vehículo y conductor"""
        pass

    @abstractmethod
    def guardar_novedad_operativa(self, dto: 'NovedadOperativaDTO') -> bool:
        """Registra una novedad ocurrida durante el viaje"""
        pass

    @abstractmethod
    def guardar_cierre_operativo(self, dto: 'CierreOperativoDTO') -> bool:
        """Registra el checklist de recibo del vehículo"""
        pass
