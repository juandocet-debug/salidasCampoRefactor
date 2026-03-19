# infraestructura/transporte/repositorio_django.py  (~130 líneas)

from dominio.transporte.entidades import Vehiculo, Asignacion
from dominio.transporte.valor_objetos import (
    TipoVehiculo, EstadoVehiculo, Propietario,
    TipoCombustible, TipoTransporte,
)
from aplicacion.transporte.puertos import IVehiculoRepositorio, IAsignacionRepositorio

from aplicaciones.transporte.modelos import (
    Vehiculo as VehiculoORM,
    Asignacion as AsignacionORM,
)


class VehiculoRepositorioDjango(IVehiculoRepositorio):

    def guardar(self, v: Vehiculo) -> Vehiculo:
        if v.id:
            orm = VehiculoORM.objects.get(pk=v.id)
        else:
            orm = VehiculoORM()
        self._aplicar(v, orm)
        orm.save()
        return self._a_entidad(orm)

    def obtener(self, vehiculo_id: int) -> Vehiculo:
        return self._a_entidad(VehiculoORM.objects.get(pk=vehiculo_id))

    def listar_disponibles(self) -> list[Vehiculo]:
        qs = VehiculoORM.objects.filter(estado_tecnico=EstadoVehiculo.DISPONIBLE.value)
        return [self._a_entidad(o) for o in qs]

    def listar_todos(self) -> list[Vehiculo]:
        return [self._a_entidad(o) for o in VehiculoORM.objects.all().order_by('placa')]

    @staticmethod
    def _a_entidad(orm: VehiculoORM) -> Vehiculo:
        return Vehiculo(
            id=orm.pk, placa=orm.placa,
            tipo=TipoVehiculo(orm.tipo) if orm.tipo else None,
            marca=orm.marca, modelo=orm.modelo, anio=orm.anio,
            capacidad=orm.capacidad,
            rendimiento_kmgal=orm.rendimiento_kmgal,
            tipo_combustible=TipoCombustible(orm.tipo_combustible),
            propietario=Propietario(orm.propietario),
            estado_tecnico=EstadoVehiculo(orm.estado_tecnico),
            foto_url=orm.foto_url, notas=orm.notas,
        )

    @staticmethod
    def _aplicar(v: Vehiculo, orm: VehiculoORM) -> None:
        orm.placa=v.placa; orm.tipo=v.tipo.value if v.tipo else ''
        orm.marca=v.marca; orm.modelo=v.modelo; orm.anio=v.anio
        orm.capacidad=v.capacidad
        orm.rendimiento_kmgal=v.rendimiento_kmgal
        orm.tipo_combustible=v.tipo_combustible.value
        orm.propietario=v.propietario.value
        orm.estado_tecnico=v.estado_tecnico.value
        orm.foto_url=v.foto_url; orm.notas=v.notas


class AsignacionRepositorioDjango(IAsignacionRepositorio):

    def guardar(self, a: Asignacion) -> Asignacion:
        if a.id:
            orm = AsignacionORM.objects.get(pk=a.id)
        else:
            orm = AsignacionORM(salida_id=a.salida_id)
        orm.vehiculo_id=a.vehiculo_id; orm.conductor_id=a.conductor_id
        orm.tipo_transporte=a.tipo_transporte.value
        orm.empresa_externa=a.empresa_externa
        orm.confirmado_en=a.confirmado_en
        orm.save()
        return self._a_entidad(orm)

    def obtener(self, asignacion_id: int) -> Asignacion:
        return self._a_entidad(AsignacionORM.objects.get(pk=asignacion_id))

    def listar_por_salida(self, salida_id: int) -> list[Asignacion]:
        return [self._a_entidad(o)
                for o in AsignacionORM.objects.filter(salida_id=salida_id)]

    @staticmethod
    def _a_entidad(orm: AsignacionORM) -> Asignacion:
        return Asignacion(
            id=orm.pk, salida_id=orm.salida_id,
            vehiculo_id=orm.vehiculo_id, conductor_id=orm.conductor_id,
            tipo_transporte=TipoTransporte(orm.tipo_transporte),
            empresa_externa=orm.empresa_externa or '',
            confirmado_en=orm.confirmado_en,
        )
