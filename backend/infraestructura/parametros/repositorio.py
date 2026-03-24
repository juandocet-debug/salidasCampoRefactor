# CAPA: Infraestructura
# QUÉ HACE: Implementa repositorios de parámetros y catálogos usando Django ORM
# NO DEBE CONTENER: lógica de negocio

from dominio.parametros.entidad import ParametrosSistema, Facultad, Programa, Ventana
from dominio.parametros.puerto import (
    IParametrosRepositorio, IFacultadRepositorio,
    IProgramaRepositorio, IVentanaRepositorio,
)
from infraestructura.parametros.modelo import (
    ParametrosModelo, FacultadModelo, ProgramaModelo, VentanaModelo,
)


class ParametrosRepositorioDjango(IParametrosRepositorio):

    @staticmethod
    def _a_entidad(m: ParametrosModelo) -> ParametrosSistema:
        return ParametrosSistema(
            id=m.id,
            precio_galon=m.precio_galon,
            rendimiento_bus=m.rendimiento_bus,
            rendimiento_buseta=m.rendimiento_buseta,
            rendimiento_camioneta=m.rendimiento_camioneta,
            costo_noche=m.costo_noche,
            costo_hora_extra=m.costo_hora_extra,
            costo_hora_extra_2=m.costo_hora_extra_2,
            max_horas_viaje=m.max_horas_viaje,
            horas_buffer=m.horas_buffer,
        )

    def obtener(self) -> ParametrosSistema:
        modelo, _ = ParametrosModelo.objects.get_or_create(id=1)
        return self._a_entidad(modelo)

    def actualizar(self, parametros: ParametrosSistema) -> ParametrosSistema:
        ParametrosModelo.objects.filter(id=1).update(
            precio_galon=parametros.precio_galon,
            rendimiento_bus=parametros.rendimiento_bus,
            rendimiento_buseta=parametros.rendimiento_buseta,
            rendimiento_camioneta=parametros.rendimiento_camioneta,
            costo_noche=parametros.costo_noche,
            costo_hora_extra=parametros.costo_hora_extra,
            costo_hora_extra_2=parametros.costo_hora_extra_2,
            max_horas_viaje=parametros.max_horas_viaje,
            horas_buffer=parametros.horas_buffer,
        )
        return self.obtener()


class FacultadRepositorioDjango(IFacultadRepositorio):
    def listar_activas(self):
        return [
            Facultad(id=m.id, nombre=m.nombre, activa=m.activa)
            for m in FacultadModelo.objects.filter(activa=True)
        ]

    def guardar(self, facultad: Facultad) -> Facultad:
        if facultad.id:
            FacultadModelo.objects.filter(id=facultad.id).update(
                nombre=facultad.nombre, activa=facultad.activa
            )
            return facultad
        else:
            m = FacultadModelo.objects.create(
                nombre=facultad.nombre, activa=facultad.activa
            )
            facultad.id = m.id
            return facultad

    def eliminar(self, id: int) -> None:
        FacultadModelo.objects.filter(id=id).delete()


class ProgramaRepositorioDjango(IProgramaRepositorio):
    def listar_activos(self):
        return [
            Programa(id=m.id, nombre=m.nombre, facultad_id=m.facultad_id, activo=m.activo)
            for m in ProgramaModelo.objects.filter(activo=True)
        ]

    def guardar(self, programa: Programa) -> Programa:
        if programa.id:
            ProgramaModelo.objects.filter(id=programa.id).update(
                nombre=programa.nombre, facultad_id=programa.facultad_id, activo=programa.activo
            )
            return programa
        else:
            m = ProgramaModelo.objects.create(
                nombre=programa.nombre, facultad_id=programa.facultad_id, activo=programa.activo
            )
            programa.id = m.id
            return programa

    def eliminar(self, id: int) -> None:
        ProgramaModelo.objects.filter(id=id).delete()


class VentanaRepositorioDjango(IVentanaRepositorio):
    def listar_activas(self):
        return [
            Ventana(id=m.id, nombre=m.nombre,
                    fecha_apertura=m.fecha_apertura,
                    fecha_cierre=m.fecha_cierre,
                    activa=m.activa)
            for m in VentanaModelo.objects.filter(activa=True)
        ]
