from typing import Optional
from modulos.Logistica.Vehiculo.dominio.VehiculoIAPort import VehiculoIAPort

class VehiculoIAConsultar:
    """
    Caso de Uso (Aplicación) para consultar a la IA.
    Depende de la abstracción (VehiculoIAPort), no de la implementación específica.
    """
    def __init__(self, ia_port: VehiculoIAPort):
        self.ia_port = ia_port

    def ejecutar(self, consulta: str) -> Optional[str]:
        if not consulta or not consulta.strip():
            return None
        return self.ia_port.consultar_datos_tecnicos(consulta)
