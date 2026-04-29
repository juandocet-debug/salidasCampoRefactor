from ...dominio.ConductorExterno import ConductorExterno
from ...dominio.ConductorExternoRepository import ConductorExternoRepository


class ConductorCreate:
    def __init__(self, repository: ConductorExternoRepository):
        self.repository = repository

    def run(self, empresa_id: int, nombre: str, cedula: str,
            telefono: str = None, licencia: str = None) -> dict:

        conductor = ConductorExterno(
            id=0,  # asignado por BD
            empresa_id=empresa_id,
            nombre=nombre,
            cedula=cedula,
            telefono=telefono,
            licencia=licencia,
            activo=True
        )

        guardado = self.repository.save(conductor)

        return {
            "id": guardado.id,
            "empresa_id": guardado.empresa_id,
            "nombre": guardado.nombre,
            "cedula": guardado.cedula,
            "telefono": guardado.telefono,
            "licencia": guardado.licencia,
            "activo": guardado.activo,
        }
