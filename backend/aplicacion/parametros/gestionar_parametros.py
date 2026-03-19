# aplicacion/parametros/gestionar_parametros.py
from typing import Any
from dominio.parametros.repositorios import IParametrosRepositorio

class ActualizarParametrosCasoUso:
    def __init__(self, repositorio: IParametrosRepositorio, recalcular_costos):
        self.repo = repositorio
        self.recalcular_costos = recalcular_costos

    def ejecutar(self, datos: dict, actualizado_por: Any):
        parametros = self.repo.guardar(datos, actualizado_por)
        salidas_afectadas = self.recalcular_costos()
        return parametros, salidas_afectadas
