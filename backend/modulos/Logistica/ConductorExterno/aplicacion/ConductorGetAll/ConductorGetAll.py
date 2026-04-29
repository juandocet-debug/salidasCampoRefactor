from typing import List
from ...dominio.ConductorExternoRepository import ConductorExternoRepository


class ConductorGetAll:
    def __init__(self, repository: ConductorExternoRepository):
        self.repository = repository

    def run(self, empresa_id: int) -> List[dict]:
        conductores = self.repository.get_all_by_empresa(empresa_id)
        return [
            {
                "id": c.id,
                "empresa_id": c.empresa_id,
                "nombre": c.nombre,
                "cedula": c.cedula,
                "telefono": c.telefono,
                "licencia": c.licencia,
                "activo": c.activo,
            }
            for c in conductores
        ]
