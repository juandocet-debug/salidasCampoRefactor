# CAPA: Aplicación
# QUÉ HACE: Caso de uso para actualizar parámetros del sistema
# NO DEBE CONTENER: Django, ORM

from dominio.parametros.entidad import ParametrosSistema
from dominio.parametros.puerto import IParametrosRepositorio


class ActualizarParametrosCasoUso:
    def __init__(self, repositorio: IParametrosRepositorio):
        self.repo = repositorio

    def ejecutar(self, datos: dict) -> ParametrosSistema:
        parametros = self.repo.obtener()
        for campo, valor in datos.items():
            if hasattr(parametros, campo):
                setattr(parametros, campo, valor)
        return self.repo.actualizar(parametros)
