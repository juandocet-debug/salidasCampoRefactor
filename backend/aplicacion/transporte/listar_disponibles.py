# CAPA: Aplicación
# QUÉ HACE: Caso de uso para listar vehículos disponibles
# NO DEBE CONTENER: Django, ORM, lógica de vistas

from typing import List
from dominio.transporte.entidad import Vehiculo
from dominio.transporte.puerto import IVehiculoRepositorio


class ListarVehiculosDisponiblesCasoUso:
    def __init__(self, repo: IVehiculoRepositorio):
        self.repo = repo

    def ejecutar(self) -> List[Vehiculo]:
        return self.repo.listar_disponibles()
