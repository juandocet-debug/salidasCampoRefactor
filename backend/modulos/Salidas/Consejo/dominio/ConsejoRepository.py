# backend/modulos/Salidas/Consejo/dominio/ConsejoRepository.py
from abc import ABC, abstractmethod
from typing import List
from .DecisionConsejo import DecisionConsejo

class ConsejoRepository(ABC):
    """Puerto Secundario (Interface) para la persistencia de las decisiones del Consejo."""
    
    @abstractmethod
    def guardar(self, decision: DecisionConsejo) -> DecisionConsejo:
        """Persiste la decisión tomada por el Consejo."""
        pass
        
    @abstractmethod
    def obtener_por_salida(self, salida_id: int) -> DecisionConsejo:
        """Obtiene la decisión asociada a una salida específica."""
        pass
