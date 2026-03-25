from ...dominio.VentanaId import VentanaId
from ...dominio.VentanaRepository import VentanaRepository

class VentanaDelete:
    def __init__(self, repository: VentanaRepository):
        self.repository = repository

    def run(self, id_val: int) -> None:
        ventana_id = VentanaId(value=id_val)
        ventana = self.repository.get_by_id(ventana_id)
        
        if not ventana:
            raise ValueError(f"Ventana con ID {id_val} no encontrada")

        self.repository.delete(ventana_id)
