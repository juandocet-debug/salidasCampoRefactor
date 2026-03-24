# CAPA: Aplicación
# QUÉ HACE: Caso de uso para crear un vehículo
# NO DEBE CONTENER: Django, ORM, lógica de vistas

from dominio.transporte.entidad import Vehiculo
from dominio.transporte.puerto import IVehiculoRepositorio


class CrearVehiculoCasoUso:
    def __init__(self, repo: IVehiculoRepositorio):
        self.repo = repo

    def ejecutar(self, vehiculo: Vehiculo, foto=None) -> Vehiculo:
        """foto: archivo binario separado de la Entidad de Dominio."""
        return self.repo.crear(vehiculo, foto=foto)
