# CAPA: Aplicación
# QUÉ HACE: Caso de uso para actualizar un vehículo
# NO DEBE CONTENER: Django, ORM, lógica de vistas

from dominio.transporte.entidad import Vehiculo
from dominio.transporte.excepciones import VehiculoNoEncontrado
from dominio.transporte.puerto import IVehiculoRepositorio


class ActualizarVehiculoCasoUso:
    def __init__(self, repo: IVehiculoRepositorio):
        self.repo = repo

    def ejecutar(self, vehiculo: Vehiculo, foto=None) -> Vehiculo:
        """foto: archivo binario separado de la Entidad de Dominio."""
        existente = self.repo.obtener_por_id(vehiculo.id)
        if not existente:
            raise VehiculoNoEncontrado(vehiculo.id)
        return self.repo.actualizar(vehiculo, foto=foto)
