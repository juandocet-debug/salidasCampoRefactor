from dataclasses import dataclass
from typing import Optional

@dataclass
class VehiculoIAPort:
    """
    Puerto (Dominio) para el Asistente de IA de Vehículos.
    Define el contrato estricto sin conocer cómo funciona la API por debajo.
    """
    def consultar_datos_tecnicos(self, consulta: str) -> Optional[str]:
        raise NotImplementedError
