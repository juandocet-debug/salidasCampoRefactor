# infraestructura/parametros/repositorio_django.py
from typing import Optional, Any
from aplicaciones.parametros.modelos import ParametrosSistema, Facultad, Programa, VentanaProgramacion
from dominio.parametros.repositorios import (
    IParametrosRepositorio, IFacultadRepositorio, IProgramaRepositorio, IVentanaRepositorio
)

class ParametrosRepositorioDjango(IParametrosRepositorio):
    def obtener(self) -> Any:
        return ParametrosSistema.obtener()

    def guardar(self, datos: dict, actualizado_por: Any) -> Any:
        params = self.obtener()
        for key, value in datos.items():
            if hasattr(params, key):
                setattr(params, key, value)
        if actualizado_por:
            params.actualizado_por = actualizado_por
        params.save()
        return params

class FacultadRepositorioDjango(IFacultadRepositorio):
    def listar_todas(self) -> list:
        return list(Facultad.objects.all())

    def listar_activas(self) -> list:
        return list(Facultad.objects.filter(activa=True))

    def crear(self, datos: dict) -> Any:
        facultad = Facultad(**datos)
        facultad.save()
        return facultad

    def obtener_por_id(self, pk: int) -> Any:
        return Facultad.objects.filter(pk=pk).first()

    def guardar(self, facultad: Any) -> Any:
        facultad.save()
        return facultad

    def eliminar(self, pk: int) -> None:
        Facultad.objects.filter(pk=pk).delete()

    def sincronizar_programas(self, facultad_id: int, activa: bool) -> None:
        Programa.objects.filter(facultad_id=facultad_id).update(activo=activa)

class ProgramaRepositorioDjango(IProgramaRepositorio):
    def listar(self, facultad_id: Optional[int] = None) -> list:
        qs = Programa.objects.select_related('facultad').all()
        if facultad_id:
            qs = qs.filter(facultad_id=facultad_id)
        return list(qs)

    def listar_activos(self) -> list:
        return list(Programa.objects.filter(activo=True).select_related('facultad'))

    def crear(self, datos: dict) -> Any:
        programa = Programa(**datos)
        programa.save()
        return programa

    def obtener_por_id(self, pk: int) -> Any:
        return Programa.objects.filter(pk=pk).first()

    def guardar(self, programa: Any) -> Any:
        programa.save()
        return programa

    def eliminar(self, pk: int) -> None:
        Programa.objects.filter(pk=pk).delete()

class VentanaRepositorioDjango(IVentanaRepositorio):
    def listar_todas(self) -> list:
        return list(VentanaProgramacion.objects.all())

    def listar_activas(self) -> list:
        return list(VentanaProgramacion.objects.filter(activa=True))

    def crear(self, datos: dict) -> Any:
        ventana = VentanaProgramacion(**datos)
        ventana.save()
        return ventana

    def obtener_por_id(self, pk: int) -> Any:
        return VentanaProgramacion.objects.filter(pk=pk).first()

    def guardar(self, ventana: Any) -> Any:
        ventana.save()
        return ventana

    def eliminar(self, pk: int) -> None:
        VentanaProgramacion.objects.filter(pk=pk).delete()
