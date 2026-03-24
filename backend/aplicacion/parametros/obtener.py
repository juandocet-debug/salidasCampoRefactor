# CAPA: Aplicación
# QUÉ HACE: Caso de uso para obtener parámetros del sistema
# NO DEBE CONTENER: Django, ORM

from dominio.parametros.entidad import ParametrosSistema
from dominio.parametros.puerto import IParametrosRepositorio


class ObtenerParametrosCasoUso:
    def __init__(self, repositorio: IParametrosRepositorio):
        self.repo = repositorio

    def ejecutar(self) -> ParametrosSistema:
        return self.repo.obtener()
