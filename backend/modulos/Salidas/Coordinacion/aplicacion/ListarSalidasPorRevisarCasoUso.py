from typing import List
from modulos.Salidas.Core.dominio.Salida import Salida
from modulos.Salidas.Core.dominio.SalidaRepository import SalidaRepository
from modulos.Salidas.Core.dominio.EstadoSalida import EstadoSalida

class ListarSalidasPorRevisarCasoUso:
    """
    Caso de Uso: Obtiene la lista de salidas que están a la espera
    de la revisión pedagógica por parte del Coordinador Académico.
    """
    def __init__(self, salida_repo: SalidaRepository):
        self.salida_repo = salida_repo

    def ejecutar(self) -> List[Salida]:
        todas_las_salidas = self.salida_repo.get_all()
        
        # Incluimos ENVIADA y EN_REVISION: el coordinador puede ver todo lo que le llegó
        estados_pendientes = [EstadoSalida.ENVIADA, EstadoSalida.EN_REVISION]
        por_revisar = [s for s in todas_las_salidas if s.estado in estados_pendientes]
        
        return por_revisar
