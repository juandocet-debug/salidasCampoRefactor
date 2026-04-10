from typing import List
from modulos.Salidas.Core.dominio.Salida import Salida
from modulos.Salidas.Core.dominio.SalidaRepository import SalidaRepository
from modulos.Salidas.Core.dominio.EstadoSalida import EstadoSalida

class ListarSalidasAprobadasCasoUso:
    """
    Caso de Uso: Obtiene la lista de salidas que ya pasaron
    el filtro (Favorable / Aprobada) y ahora deben ser gestionadas
    por el Coordinador de Salidas (Logística / Operativa).
    """
    def __init__(self, salida_repo: SalidaRepository):
        self.salida_repo = salida_repo

    def ejecutar(self) -> List[Salida]:
        todas_las_salidas = self.salida_repo.get_all()
        
        # Filtramos las que ya tienen aprobación académica
        estados_aprobados = [EstadoSalida.FAVORABLE, EstadoSalida.APROBADA]
        aprobadas = [s for s in todas_las_salidas if s.estado in estados_aprobados]
        
        return aprobadas
