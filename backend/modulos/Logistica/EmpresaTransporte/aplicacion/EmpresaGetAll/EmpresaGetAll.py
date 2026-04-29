from typing import List
from ...dominio.EmpresaTransporteRepository import EmpresaTransporteRepository


class EmpresaGetAll:
    def __init__(self, repository: EmpresaTransporteRepository):
        self.repository = repository

    def run(self) -> List[dict]:
        empresas = self.repository.get_all()
        return [
            {
                "id": e.id,
                "nit": e.nit,
                "razon_social": e.razon_social,
                "telefono": e.telefono,
                "correo": e.correo,
                "contacto": e.contacto,
                "activa": e.activa,
            }
            for e in empresas
        ]
