# CAPA: Infraestructura
# QUÉ HACE: Implementa repositorios de transporte con Django ORM
# NO DEBE CONTENER: lógica de negocio

from typing import List, Optional
from dominio.transporte.entidad import Vehiculo, Asignacion
from dominio.transporte.valor_objetos import (
    TipoVehiculo, TipoCombustible, Propietario,
    EstadoVehiculo, TipoTransporte
)
from dominio.transporte.puerto import IVehiculoRepositorio, IAsignacionRepositorio
from infraestructura.transporte.modelo import VehiculoModelo, AsignacionModelo


class VehiculoRepositorioDjango(IVehiculoRepositorio):

    @staticmethod
    def _a_entidad(m: VehiculoModelo) -> Vehiculo:
        return Vehiculo(
            id=m.id,
            placa=m.placa,
            tipo=TipoVehiculo(m.tipo),
            marca=m.marca,
            modelo=m.modelo,
            anio=m.anio,
            color=m.color,
            numero_interno=m.numero_interno,
            capacidad=m.capacidad,
            rendimiento_kmgal=m.rendimiento_kmgal,
            tipo_combustible=TipoCombustible(m.tipo_combustible),
            propietario=Propietario(m.propietario),
            estado_tecnico=EstadoVehiculo(m.estado_tecnico),
            foto_url=m.foto_url.url if m.foto_url else '',
            notas=m.notas,
            created_at=m.created_at,
            updated_at=m.updated_at,
        )

    def listar(self) -> List[Vehiculo]:
        return [self._a_entidad(m) for m in VehiculoModelo.objects.all()]

    def listar_disponibles(self) -> List[Vehiculo]:
        return [self._a_entidad(m) for m in
                VehiculoModelo.objects.filter(estado_tecnico='disponible')]

    def obtener_por_id(self, vehiculo_id: int) -> Optional[Vehiculo]:
        try:
            return self._a_entidad(VehiculoModelo.objects.get(id=vehiculo_id))
        except VehiculoModelo.DoesNotExist:
            return None

    def crear(self, vehiculo: Vehiculo, foto=None) -> Vehiculo:
        """foto: archivo binario (InMemoryUploadedFile) o None. Separado de la Entidad."""
        m = VehiculoModelo(
            placa=vehiculo.placa,
            tipo=vehiculo.tipo.value,
            marca=vehiculo.marca,
            modelo=vehiculo.modelo,
            anio=vehiculo.anio,
            color=vehiculo.color,
            numero_interno=vehiculo.numero_interno,
            capacidad=vehiculo.capacidad,
            rendimiento_kmgal=vehiculo.rendimiento_kmgal,
            tipo_combustible=vehiculo.tipo_combustible.value,
            propietario=vehiculo.propietario.value,
            estado_tecnico=vehiculo.estado_tecnico.value,
            notas=vehiculo.notas,
        )
        if foto and hasattr(foto, 'read'):
            m.foto_url = foto
        m.save()
        return self._a_entidad(m)

    def actualizar(self, vehiculo: Vehiculo, foto=None) -> Vehiculo:
        """foto: archivo binario (InMemoryUploadedFile) o None. Separado de la Entidad."""
        m = VehiculoModelo.objects.get(id=vehiculo.id)
        m.placa             = vehiculo.placa
        m.tipo              = vehiculo.tipo.value
        m.marca             = vehiculo.marca
        m.modelo            = vehiculo.modelo
        m.anio              = vehiculo.anio
        m.color             = vehiculo.color
        m.numero_interno    = vehiculo.numero_interno
        m.capacidad         = vehiculo.capacidad
        m.rendimiento_kmgal = vehiculo.rendimiento_kmgal
        m.tipo_combustible  = vehiculo.tipo_combustible.value
        m.propietario       = vehiculo.propietario.value
        m.estado_tecnico    = vehiculo.estado_tecnico.value
        m.notas             = vehiculo.notas
        # La foto llega como parámetro separado, no en la Entidad
        if foto and hasattr(foto, 'read'):
            m.foto_url = foto
        m.save()
        return self._a_entidad(m)

    def eliminar(self, vehiculo_id: int) -> None:
        VehiculoModelo.objects.filter(id=vehiculo_id).delete()


class AsignacionRepositorioDjango(IAsignacionRepositorio):

    @staticmethod
    def _a_entidad(m: AsignacionModelo) -> Asignacion:
        return Asignacion(
            id=m.id,
            salida_id=m.salida_id,
            vehiculo_id=m.vehiculo_id,
            conductor_id=m.conductor_id,
            tipo_transporte=TipoTransporte(m.tipo_transporte),
            empresa_externa=m.empresa_externa,
            confirmado_en=m.confirmado_en,
            created_at=m.created_at,
        )

    def obtener_por_salida(self, salida_id: int) -> Optional[Asignacion]:
        try:
            return self._a_entidad(
                AsignacionModelo.objects.get(salida_id=salida_id)
            )
        except AsignacionModelo.DoesNotExist:
            return None

    def crear(self, asignacion: Asignacion) -> Asignacion:
        m = AsignacionModelo.objects.create(
            salida_id=asignacion.salida_id,
            vehiculo_id=asignacion.vehiculo_id,
            conductor_id=asignacion.conductor_id,
            tipo_transporte=asignacion.tipo_transporte.value,
            empresa_externa=asignacion.empresa_externa,
        )
        return self._a_entidad(m)

    def actualizar(self, asignacion: Asignacion) -> Asignacion:
        AsignacionModelo.objects.filter(id=asignacion.id).update(
            vehiculo_id=asignacion.vehiculo_id,
            conductor_id=asignacion.conductor_id,
            tipo_transporte=asignacion.tipo_transporte.value,
            empresa_externa=asignacion.empresa_externa,
            confirmado_en=asignacion.confirmado_en,
        )
        return self.obtener_por_salida(asignacion.salida_id)
