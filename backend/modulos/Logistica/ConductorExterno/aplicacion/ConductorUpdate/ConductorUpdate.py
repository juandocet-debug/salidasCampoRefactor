from typing import Optional
from ...dominio.ConductorExternoRepository import ConductorExternoRepository
from ...dominio.ConductorExterno import ConductorExterno


class ConductorUpdate:
    def __init__(self, repository: ConductorExternoRepository):
        self.repository = repository

    def run(self, conductor_id: int, nombre: str, cedula: str,
            telefono: Optional[str] = None, licencia: Optional[str] = None) -> dict:

        conductor = self.repository.get_by_id(conductor_id)
        if not conductor:
            raise ValueError(f"Conductor con id {conductor_id} no encontrado.")

        actualizado = ConductorExterno(
            id=conductor.id,
            empresa_id=conductor.empresa_id,
            nombre=nombre,
            cedula=cedula,
            telefono=telefono,
            licencia=licencia,
            activo=conductor.activo,
        )

        guardado = self.repository.update(actualizado)

        return {
            "id": guardado.id,
            "empresa_id": guardado.empresa_id,
            "nombre": guardado.nombre,
            "cedula": guardado.cedula,
            "telefono": guardado.telefono,
            "licencia": guardado.licencia,
            "activo": guardado.activo,
        }
