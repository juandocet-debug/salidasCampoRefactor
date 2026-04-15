"""
Puerto (Port) secundario para consultar metadatos de presentación
de una Salida que no residen en la Entidad de Dominio pura
(datos de la ficha extendida: iconos, colores, resumen, destino, objetivos…).

Este puerto es implementado por un Adaptador de Infraestructura y
permite que los Casos de Uso accedan a estos datos sin acoplarse al ORM.
"""
from abc import ABC, abstractmethod
from typing import Optional, Dict, Any


class SalidaMetadataRepository(ABC):

    @abstractmethod
    def obtener_metadata(self, salida_id: int) -> Dict[str, Any]:
        """
        Retorna un diccionario con campos de UI/ficha extendida:
            - icono, color, resumen, objetivo_general, punto_partida,
              parada_max (destino textual legible).
        Retorna {} si no existen datos de metadatos para esa salida.
        """
        pass
