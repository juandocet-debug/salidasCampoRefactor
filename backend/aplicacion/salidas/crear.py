# CAPA: Aplicación
# QUÉ HACE: Caso de uso para crear una nueva salida en estado borrador
# NO DEBE CONTENER: imports de Django, ORM, serializadores, lógica HTTP

from dominio.salidas.entidad import Salida
from dominio.salidas.puerto import ISalidaRepositorio
from dominio.salidas.servicios import generar_codigo_salida


class CrearSalidaCasoUso:
    def __init__(self, repositorio: ISalidaRepositorio):
        self.repo = repositorio

    def ejecutar(self, salida: Salida) -> Salida:
        salida.codigo = generar_codigo_salida()
        return self.repo.crear(salida)

