# CAPA: Aplicación
# QUÉ HACE: Caso de uso para obtener el detalle de una salida por su ID
# NO DEBE CONTENER: imports de Django, ORM, serializadores, lógica HTTP

from dominio.salidas.entidad import Salida
from dominio.salidas.excepciones import SalidaNoEncontrada
from dominio.salidas.puerto import ISalidaRepositorio


class ObtenerSalidaCasoUso:
    def __init__(self, repositorio: ISalidaRepositorio):
        self.repo = repositorio

    def ejecutar(self, salida_id: int, profesor_id: int) -> Salida:
        salida = self.repo.obtener_por_id(salida_id)
        if not salida:
            raise SalidaNoEncontrada(salida_id)
        salida.verificar_acceso(profesor_id)
        return salida
