from ...dominio.EmpresaTransporte import EmpresaTransporte
from ...dominio.EmpresaTransporteRepository import EmpresaTransporteRepository


class EmpresaCreate:
    def __init__(self, repository: EmpresaTransporteRepository):
        self.repository = repository

    def run(self, nit: str, razon_social: str, telefono: str = None,
            correo: str = None, contacto: str = None) -> dict:

        empresa = EmpresaTransporte(
            id=0,  # asignado por BD
            nit=nit,
            razon_social=razon_social,
            telefono=telefono,
            correo=correo,
            contacto=contacto,
            activa=True
        )

        guardada = self.repository.save(empresa)

        return {
            "id": guardada.id,
            "nit": guardada.nit,
            "razon_social": guardada.razon_social,
            "telefono": guardada.telefono,
            "correo": guardada.correo,
            "contacto": guardada.contacto,
            "activa": guardada.activa,
        }
