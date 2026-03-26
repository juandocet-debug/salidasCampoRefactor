from ...dominio.VehiculoId import VehiculoId
from ...dominio.VehiculoRepository import VehiculoRepository

class VehiculoDelete:
    def __init__(self, repository: VehiculoRepository):
        self.repository = repository

    def run(self, id_val: str) -> bool:
        id_obj = VehiculoId(id_val)
        vehiculo_existente = self.repository.get_by_id(id_obj)

        if not vehiculo_existente:
            raise ValueError("El vehículo no existe.")

        self.repository.delete(id_obj)
        return True
