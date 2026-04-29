from typing import List, Optional
from ..dominio.EmpresaTransporte import EmpresaTransporte
from ..dominio.EmpresaTransporteRepository import EmpresaTransporteRepository
from .models import EmpresaTransporteModel


class DjangoEmpresaTransporteRepository(EmpresaTransporteRepository):

    def _to_domain(self, model: EmpresaTransporteModel) -> EmpresaTransporte:
        return EmpresaTransporte(
            id=model.id,
            nit=model.nit,
            razon_social=model.razon_social,
            telefono=model.telefono,
            correo=model.correo,
            contacto=model.contacto,
            activa=model.activa,
        )

    def save(self, empresa: EmpresaTransporte) -> EmpresaTransporte:
        obj, _ = EmpresaTransporteModel.objects.update_or_create(
            nit=empresa.nit,
            defaults={
                'razon_social': empresa.razon_social,
                'telefono': empresa.telefono,
                'correo': empresa.correo,
                'contacto': empresa.contacto,
                'activa': empresa.activa,
            }
        )
        return self._to_domain(obj)

    def get_all(self) -> List[EmpresaTransporte]:
        return [self._to_domain(e) for e in EmpresaTransporteModel.objects.filter(activa=True).order_by('razon_social')]

    def get_by_id(self, empresa_id: int) -> Optional[EmpresaTransporte]:
        try:
            return self._to_domain(EmpresaTransporteModel.objects.get(pk=empresa_id))
        except EmpresaTransporteModel.DoesNotExist:
            return None

    def update(self, empresa: EmpresaTransporte) -> EmpresaTransporte:
        EmpresaTransporteModel.objects.filter(pk=empresa.id).update(
            nit=empresa.nit,
            razon_social=empresa.razon_social,
            telefono=empresa.telefono,
            correo=empresa.correo,
            contacto=empresa.contacto,
        )
        return self._to_domain(EmpresaTransporteModel.objects.get(pk=empresa.id))

    def delete(self, empresa_id: int) -> None:
        # Soft delete: marcar como inactiva
        EmpresaTransporteModel.objects.filter(pk=empresa_id).update(activa=False)
