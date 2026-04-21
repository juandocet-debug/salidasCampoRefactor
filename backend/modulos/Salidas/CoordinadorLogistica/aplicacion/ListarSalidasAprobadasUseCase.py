from typing import List, Dict
from ..dominio.ILogisticaRepository import ILogisticaRepository
from ..dominio.ValueObjectsLogistica import EstadoOperativoSalida

class ListarSalidasAprobadasUseCase:
    def __init__(self, repository: ILogisticaRepository):
        self.repository = repository

    def ejecutar(self) -> List[Dict]:
        """
        Retorna la lista de salidas que ya pasaron por consejo 
        y están listas para que logística asigne recursos.
        """
        salidas_resumen = self.repository.obtener_salidas_por_estado(
            EstadoOperativoSalida.APROBADA_CONSEJO.value
        )
        
        # Mapeamos a diccionario para devolverlo a la capa HTTP
        return [s.to_dict() for s in salidas_resumen]
