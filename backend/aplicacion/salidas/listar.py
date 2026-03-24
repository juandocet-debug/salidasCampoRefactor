# CAPA: Aplicación
# QUÉ HACE: Caso de uso para listar las salidas de un profesor
# NO DEBE CONTENER: imports de Django, ORM, serializadores, lógica HTTP

from typing import List

from dominio.salidas.entidad import Salida
from dominio.salidas.puerto import ISalidaRepositorio


class ListarSalidasProfesorCasoUso:
    def __init__(self, repositorio: ISalidaRepositorio):
        self.repo = repositorio

    def ejecutar(self, profesor_id: int) -> List[Salida]:
        return self.repo.listar_por_profesor(profesor_id)
