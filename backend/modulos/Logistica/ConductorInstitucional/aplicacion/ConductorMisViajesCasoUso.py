from ..dominio.IConductorAppRepository import IConductorAppRepository

class ConductorMisViajesCasoUso:
    def __init__(self, repository: IConductorAppRepository):
        self.repository = repository

    def run(self, conductor_id: str) -> list:
        if not conductor_id:
            raise ValueError("El ID del conductor es requerido.")
        return self.repository.get_mis_viajes(conductor_id)
