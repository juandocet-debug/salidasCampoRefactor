from typing import List, Optional
from ..dominio.Facultad import Facultad
from ..dominio.FacultadId import FacultadId
from ..dominio.FacultadNombre import FacultadNombre
from ..dominio.FacultadEstado import FacultadEstado
from ..dominio.FacultadRepository import FacultadRepository
from .models import FacultadModel

class DjangoFacultadRepository(FacultadRepository):
    def save(self, facultad: Facultad) -> None:
        if facultad.id.value is None:
            # CREATE
            modelo = FacultadModel.objects.create(
                nombre=facultad.nombre.value,
                activa=facultad.activa.value
            )
            # Acoplamos el ID auto-generado a la entidad en memoria (opcional pero buena práctica)
            facultad.id = FacultadId(modelo.pk)
        else:
            # UPDATE
            try:
                modelo = FacultadModel.objects.get(pk=facultad.id.value)
                modelo.nombre = facultad.nombre.value
                modelo.activa = facultad.activa.value
                modelo.save()
            except FacultadModel.DoesNotExist:
                raise ValueError(f"Facultad con ID {facultad.id.value} no encontrada")

    def get_all(self) -> List[Facultad]:
        objs = FacultadModel.objects.all()
        return [
            Facultad(
                id=FacultadId(value=o.id),
                nombre=FacultadNombre(value=o.nombre),
                activa=FacultadEstado(value=o.activa)
            ) for o in objs
        ]

    def get_by_id(self, id: FacultadId) -> Optional[Facultad]:
        try:
            obj = FacultadModel.objects.get(id=id.value)
            return Facultad(
                id=FacultadId(value=obj.id),
                nombre=FacultadNombre(value=obj.nombre),
                activa=FacultadEstado(value=obj.activa)
            )
        except FacultadModel.DoesNotExist:
            return None

    def delete(self, id: FacultadId) -> None:
        try:
            obj = FacultadModel.objects.get(id=id.value)
            obj.delete()
        except FacultadModel.DoesNotExist:
            pass
