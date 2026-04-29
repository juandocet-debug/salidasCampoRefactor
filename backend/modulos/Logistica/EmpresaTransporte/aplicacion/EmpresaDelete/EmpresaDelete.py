from ...dominio.EmpresaTransporteRepository import EmpresaTransporteRepository


class EmpresaDelete:
    def __init__(self, repository: EmpresaTransporteRepository):
        self.repository = repository

    def run(self, empresa_id: int) -> dict:
        self.repository.delete(empresa_id)
        return {"eliminado": True, "id": empresa_id}
