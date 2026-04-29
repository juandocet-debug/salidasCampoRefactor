from ...dominio.ConductorExternoRepository import ConductorExternoRepository


class ConductorDelete:
    def __init__(self, repository: ConductorExternoRepository):
        self.repository = repository

    def run(self, conductor_id: int) -> dict:
        self.repository.delete(conductor_id)
        return {"eliminado": True, "id": conductor_id}
