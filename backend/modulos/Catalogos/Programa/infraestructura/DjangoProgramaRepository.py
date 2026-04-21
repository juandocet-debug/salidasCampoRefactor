from typing import List, Optional
from ..dominio.Programa import Programa
from ..dominio.ProgramaId import ProgramaId
from ..dominio.ProgramaNombre import ProgramaNombre
from ..dominio.ProgramaEstado import ProgramaEstado
from ..dominio.ProgramaFacultadId import ProgramaFacultadId
from ..dominio.ProgramaRepository import ProgramaRepository
from .models import ProgramaModel

class DjangoProgramaRepository(ProgramaRepository):
    def save(self, programa: Programa) -> None:
        if programa.id.value is None:
            # CREATE
            model = ProgramaModel.objects.create(
                nombre=programa.nombre.value,
                activo=programa.activo.value,
                facultad_id=programa.facultad_id.value
            )
            programa.id = ProgramaId(value=model.id)
        else:
            # UPDATE
            try:
                model = ProgramaModel.objects.get(id=programa.id.value)
                model.nombre = programa.nombre.value
                model.activo = programa.activo.value
                model.facultad_id = programa.facultad_id.value
                model.save()
            except ProgramaModel.DoesNotExist:
                raise ValueError(f"Programa con ID {programa.id.value} no encontrado")

    def get_by_id(self, id: ProgramaId) -> Optional[Programa]:
        try:
            model = ProgramaModel.objects.select_related('facultad').get(id=id.value)
            return Programa(
                id=ProgramaId(value=model.id),
                nombre=ProgramaNombre(value=model.nombre),
                activo=ProgramaEstado(value=model.activo),
                facultad_id=ProgramaFacultadId(value=model.facultad_id),
                facultad_nombre=model.facultad.nombre if model.facultad else "Sin Facultad"
            )
        except ProgramaModel.DoesNotExist:
            return None

    def get_all(self) -> List[Programa]:
        models = ProgramaModel.objects.select_related('facultad').all()
        return [
            Programa(
                id=ProgramaId(value=model.id),
                nombre=ProgramaNombre(value=model.nombre),
                activo=ProgramaEstado(value=model.activo),
                facultad_id=ProgramaFacultadId(value=model.facultad_id),
                facultad_nombre=model.facultad.nombre if model.facultad else "Sin Facultad"
            )
            for model in models
        ]

    def delete(self, id: ProgramaId) -> None:
        ProgramaModel.objects.filter(id=id.value).delete()

    def get_by_facultad_id(self, facultad_id: int) -> List[Programa]:
        models = ProgramaModel.objects.filter(facultad_id=facultad_id).select_related('facultad')
        return [
            Programa(
                id=ProgramaId(value=m.id),
                nombre=ProgramaNombre(value=m.nombre),
                activo=ProgramaEstado(value=m.activo),
                facultad_id=ProgramaFacultadId(value=m.facultad_id),
                facultad_nombre=m.facultad.nombre if m.facultad else "Sin Facultad"
            )
            for m in models
        ]
