# CAPA: Aplicación
# QUÉ HACE: Caso de uso para enviar una salida (cambia estado de BORRADOR → ENVIADA)
# NO DEBE CONTENER: imports de Django, ORM, serializadores, lógica HTTP

from dominio.salidas.entidad import Salida
from dominio.salidas.excepciones import SalidaNoEncontrada
from dominio.salidas.puerto import ISalidaRepositorio


class EnviarSalidaCasoUso:
    def __init__(self, repositorio: ISalidaRepositorio):
        self.repo = repositorio

    def ejecutar(self, salida_id: int, profesor_id: int) -> Salida:
        salida = self.repo.obtener_por_id(salida_id)
        if not salida:
            raise SalidaNoEncontrada(salida_id)

        # La entidad valida acceso + transición internamente
        salida.enviar(profesor_id)

        return self.repo.guardar(salida)
