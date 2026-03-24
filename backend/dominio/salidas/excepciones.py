# CAPA: Dominio
# QUÉ HACE: Define las excepciones de negocio del módulo Salidas
# NO DEBE CONTENER: imports de Django, ORM, HTTP, códigos de estado REST


class SalidaNoEncontrada(Exception):
    def __init__(self, identificador=None):
        msg = f'Salida no encontrada: {identificador}' if identificador else 'Salida no encontrada'
        super().__init__(msg)


class TransicionNoPermitida(Exception):
    def __init__(self, estado_actual, estado_destino):
        super().__init__(
            f'No se puede pasar de "{estado_actual}" a "{estado_destino}"'
        )


class SalidaSinPermiso(Exception):
    def __init__(self, usuario_id, accion):
        super().__init__(
            f'El usuario {usuario_id} no tiene permiso para: {accion}'
        )
