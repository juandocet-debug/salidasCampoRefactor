# CAPA: Aplicación
# QUÉ HACE: Caso de uso para actualizar una salida existente (solo si está en borrador)
# NO DEBE CONTENER: imports de Django, ORM, serializadores, lógica HTTP

from dominio.salidas.entidad import Salida
from dominio.salidas.excepciones import SalidaNoEncontrada, SalidaSinPermiso
from dominio.salidas.puerto import ISalidaRepositorio


class ActualizarSalidaCasoUso:
    def __init__(self, repositorio: ISalidaRepositorio):
        self.repo = repositorio

    def ejecutar(self, salida_id: int, profesor_id: int, datos: dict) -> Salida:
        salida = self.repo.obtener_por_id(salida_id)
        if not salida:
            raise SalidaNoEncontrada(salida_id)
        salida.verificar_acceso(profesor_id)

        if not salida.puede_editarse:
            raise SalidaSinPermiso(profesor_id, 'editar salida')

        # Merge — aplica solo los campos enviados
        for campo, valor in datos.items():
            if hasattr(salida, campo):
                setattr(salida, campo, valor)

        return self.repo.actualizar(salida)
