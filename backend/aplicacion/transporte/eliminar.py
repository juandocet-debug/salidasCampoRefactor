# CAPA: Aplicación
# QUÉ HACE: Caso de uso para eliminar un vehículo
# NO DEBE CONTENER: Django, ORM, lógica de vistas

from dominio.transporte.excepciones import VehiculoNoEncontrado
from dominio.transporte.puerto import IVehiculoRepositorio


class EliminarVehiculoCasoUso:
    def __init__(self, repo: IVehiculoRepositorio):
        self.repo = repo

    def ejecutar(self, vehiculo_id: int) -> None:
        vehiculo = self.repo.obtener_por_id(vehiculo_id)
        if not vehiculo:
            raise VehiculoNoEncontrado(vehiculo_id)
        self.repo.eliminar(vehiculo_id)
