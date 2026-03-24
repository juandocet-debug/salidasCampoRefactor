# CAPA: Aplicación
# QUÉ HACE: Caso de uso para eliminar una salida (solo si está en borrador y es del profesor)
# NO DEBE CONTENER: imports de Django, ORM, serializadores, lógica HTTP

from dominio.salidas.excepciones import SalidaNoEncontrada, SalidaSinPermiso
from dominio.salidas.puerto import ISalidaRepositorio


class EliminarSalidaCasoUso:
    def __init__(self, repositorio: ISalidaRepositorio):
        self.repo = repositorio

    def ejecutar(self, salida_id: int, profesor_id: int) -> None:
        salida = self.repo.obtener_por_id(salida_id)
        if not salida:
            raise SalidaNoEncontrada(salida_id)
        salida.verificar_acceso(profesor_id)

        if not salida.puede_eliminarse:
            raise SalidaSinPermiso(profesor_id, 'eliminar salida')

        self.repo.eliminar(salida_id)
