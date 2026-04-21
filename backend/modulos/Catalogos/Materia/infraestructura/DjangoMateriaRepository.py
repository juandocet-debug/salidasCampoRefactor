from typing import List, Optional
from ..dominio.Materia import Materia
from ..dominio.MateriaId import MateriaId
from ..dominio.MateriaNombre import MateriaNombre
from ..dominio.MateriaCodigo import MateriaCodigo
from ..dominio.MateriaEstado import MateriaEstado
from ..dominio.MateriaRepository import MateriaRepository
from .models import MateriaModel

class DjangoMateriaRepository(MateriaRepository):

    def _to_domain(self, obj: MateriaModel) -> Materia:
        return Materia(
            id=MateriaId(value=obj.id),
            nombre=MateriaNombre(value=obj.nombre),
            codigo=MateriaCodigo(value=obj.codigo),
            activa=MateriaEstado(value=obj.activa),
            programa_id=obj.programa_id,
            programa_nombre=obj.programa.nombre if obj.programa else None,
        )

    def save(self, materia: Materia) -> None:
        if materia.id.value is None:
            # CREATE
            obj = MateriaModel.objects.create(
                nombre=materia.nombre.value,
                codigo=materia.codigo.value,
                activa=materia.activa.value,
                programa_id=materia.programa_id,
            )
            materia.id = MateriaId(value=obj.id)
        else:
            # UPDATE
            try:
                obj = MateriaModel.objects.get(id=materia.id.value)
                obj.nombre = materia.nombre.value
                obj.codigo = materia.codigo.value
                obj.activa = materia.activa.value
                obj.programa_id = materia.programa_id
                obj.save()
            except MateriaModel.DoesNotExist:
                raise ValueError(f"Materia con ID {materia.id.value} no encontrada")

    def get_by_id(self, id: MateriaId) -> Optional[Materia]:
        try:
            obj = MateriaModel.objects.select_related('programa').get(id=id.value)
            return self._to_domain(obj)
        except MateriaModel.DoesNotExist:
            return None

    def get_all(self) -> List[Materia]:
        objs = MateriaModel.objects.select_related('programa').all().order_by('programa_id', 'nombre')
        return [self._to_domain(o) for o in objs]

    def get_by_programa_id(self, programa_id: int) -> List[Materia]:
        objs = MateriaModel.objects.filter(programa_id=programa_id).select_related('programa')
        return [self._to_domain(o) for o in objs]

    def delete(self, id: MateriaId) -> None:
        MateriaModel.objects.filter(id=id.value).delete()
