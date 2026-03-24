# CAPA: Aplicación
# QUÉ HACE: Caso de uso para asignar transporte a una salida
# NO DEBE CONTENER: Django, ORM, lógica de vistas

from dominio.transporte.entidad import Asignacion
from dominio.transporte.excepciones import (
    VehiculoNoEncontrado, VehiculoNoDisponible, CapacidadInsuficiente
)
from dominio.transporte.puerto import IVehiculoRepositorio, IAsignacionRepositorio


class AsignarTransporteCasoUso:
    def __init__(
        self,
        repo_vehiculo: IVehiculoRepositorio,
        repo_asignacion: IAsignacionRepositorio,
    ):
        self.repo_vehiculo   = repo_vehiculo
        self.repo_asignacion = repo_asignacion

    def ejecutar(
        self,
        salida_id:       int,
        vehiculo_id:     int,
        conductor_id:    int,
        num_estudiantes: int,
    ) -> Asignacion:
        vehiculo = self.repo_vehiculo.obtener_por_id(vehiculo_id)
        if not vehiculo:
            raise VehiculoNoEncontrado(vehiculo_id)
        if not vehiculo.esta_disponible:
            raise VehiculoNoDisponible(vehiculo.placa)
        if vehiculo.capacidad < num_estudiantes:
            raise CapacidadInsuficiente(vehiculo.capacidad, num_estudiantes)

        asignacion = Asignacion(
            salida_id=salida_id,
            vehiculo_id=vehiculo_id,
            conductor_id=conductor_id,
        )
        return self.repo_asignacion.crear(asignacion)
