from typing import List, Optional
from ..dominio.ConductorExterno import ConductorExterno
from ..dominio.ConductorExternoRepository import ConductorExternoRepository
from .models import ConductorExternoModel


class DjangoConductorExternoRepository(ConductorExternoRepository):

    def _to_domain(self, model: ConductorExternoModel) -> ConductorExterno:
        return ConductorExterno(
            id=model.id,
            empresa_id=model.empresa_id,
            nombre=model.nombre,
            cedula=model.cedula,
            telefono=model.telefono,
            licencia=model.licencia,
            activo=model.activo,
        )

    def save(self, conductor: ConductorExterno) -> ConductorExterno:
        obj, _ = ConductorExternoModel.objects.update_or_create(
            cedula=conductor.cedula,
            defaults={
                'empresa_id': conductor.empresa_id,
                'nombre': conductor.nombre,
                'telefono': conductor.telefono,
                'licencia': conductor.licencia,
                'activo': conductor.activo,
            }
        )
        return self._to_domain(obj)

    def get_all_by_empresa(self, empresa_id: int) -> List[ConductorExterno]:
        return [
            self._to_domain(c)
            for c in ConductorExternoModel.objects.filter(empresa_id=empresa_id, activo=True).order_by('nombre')
        ]

    def get_by_id(self, conductor_id: int) -> Optional[ConductorExterno]:
        try:
            return self._to_domain(ConductorExternoModel.objects.get(pk=conductor_id))
        except ConductorExternoModel.DoesNotExist:
            return None

    def update(self, conductor: ConductorExterno) -> ConductorExterno:
        ConductorExternoModel.objects.filter(pk=conductor.id).update(
            nombre=conductor.nombre,
            cedula=conductor.cedula,
            telefono=conductor.telefono,
            licencia=conductor.licencia,
        )
        return self._to_domain(ConductorExternoModel.objects.get(pk=conductor.id))

    def delete(self, conductor_id: int) -> None:
        # Soft delete: marcar como inactivo
        ConductorExternoModel.objects.filter(pk=conductor_id).update(activo=False)
