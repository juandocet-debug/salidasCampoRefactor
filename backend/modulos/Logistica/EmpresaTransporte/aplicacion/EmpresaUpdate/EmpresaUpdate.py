from typing import Optional
from ...dominio.EmpresaTransporteRepository import EmpresaTransporteRepository
from ...dominio.EmpresaTransporte import EmpresaTransporte


class EmpresaUpdate:
    def __init__(self, repository: EmpresaTransporteRepository):
        self.repository = repository

    def run(self, empresa_id: int, razon_social: str, nit: str,
            telefono: Optional[str] = None, correo: Optional[str] = None,
            contacto: Optional[str] = None) -> dict:

        empresa = self.repository.get_by_id(empresa_id)
        if not empresa:
            raise ValueError(f"Empresa con id {empresa_id} no encontrada.")

        actualizada = EmpresaTransporte(
            id=empresa.id,
            nit=nit,
            razon_social=razon_social,
            telefono=telefono,
            correo=correo,
            contacto=contacto,
            activa=empresa.activa,
        )

        guardada = self.repository.update(actualizada)

        return {
            "id": guardada.id,
            "nit": guardada.nit,
            "razon_social": guardada.razon_social,
            "telefono": guardada.telefono,
            "correo": guardada.correo,
            "contacto": guardada.contacto,
            "activa": guardada.activa,
        }
