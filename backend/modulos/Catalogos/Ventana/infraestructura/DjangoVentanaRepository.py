from typing import List, Optional
from ..dominio.Ventana import Ventana
from ..dominio.VentanaId import VentanaId
from ..dominio.VentanaNombre import VentanaNombre
from ..dominio.FechaApertura import FechaApertura
from ..dominio.FechaCierre import FechaCierre
from ..dominio.VentanaEstado import VentanaEstado
from ..dominio.VentanaRepository import VentanaRepository
from .models import VentanaModel

class DjangoVentanaRepository(VentanaRepository):
    def save(self, ventana: Ventana) -> None:
        if ventana.id.value is None:
            # CREATE
            modelo = VentanaModel.objects.create(
                nombre=ventana.nombre.value,
                fecha_apertura=ventana.fecha_apertura.value,
                fecha_cierre=ventana.fecha_cierre.value,
                activa=ventana.activa.value
            )
            # Link entity back
            ventana.id = VentanaId(value=modelo.pk)
        else:
            # UPDATE
            try:
                modelo = VentanaModel.objects.get(pk=ventana.id.value)
                modelo.nombre = ventana.nombre.value
                modelo.fecha_apertura = ventana.fecha_apertura.value
                modelo.fecha_cierre = ventana.fecha_cierre.value
                modelo.activa = ventana.activa.value
                modelo.save()
            except VentanaModel.DoesNotExist:
                raise ValueError(f"Ventana con ID {ventana.id.value} no encontrada")

    def get_all(self) -> List[Ventana]:
        objs = VentanaModel.objects.all()
        return [
            Ventana(
                id=VentanaId(value=o.id),
                nombre=VentanaNombre(value=o.nombre),
                fecha_apertura=FechaApertura(value=str(o.fecha_apertura)),
                fecha_cierre=FechaCierre(value=str(o.fecha_cierre)),
                activa=VentanaEstado(value=o.activa)
            ) for o in objs
        ]

    def get_by_id(self, id: VentanaId) -> Optional[Ventana]:
        try:
            obj = VentanaModel.objects.get(pk=id.value)
            return Ventana(
                id=VentanaId(value=obj.id),
                nombre=VentanaNombre(value=obj.nombre),
                fecha_apertura=FechaApertura(value=str(obj.fecha_apertura)),
                fecha_cierre=FechaCierre(value=str(obj.fecha_cierre)),
                activa=VentanaEstado(value=obj.activa)
            )
        except VentanaModel.DoesNotExist:
            return None

    def delete(self, id: VentanaId) -> None:
        try:
            obj = VentanaModel.objects.get(pk=id.value)
            obj.delete()
        except VentanaModel.DoesNotExist:
            pass

