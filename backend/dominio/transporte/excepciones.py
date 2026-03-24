# CAPA: Dominio
# QUÉ HACE: Excepciones del módulo transporte
# NO DEBE CONTENER: Django, ORM, HTTP


class VehiculoNoEncontrado(Exception):
    def __init__(self, identificador=None):
        msg = f'Vehículo no encontrado: {identificador}' if identificador else 'Vehículo no encontrado'
        super().__init__(msg)


class VehiculoNoDisponible(Exception):
    def __init__(self, placa):
        super().__init__(f'El vehículo {placa} no está disponible')


class CapacidadInsuficiente(Exception):
    def __init__(self, capacidad, requerida):
        super().__init__(f'Capacidad {capacidad} insuficiente, se requieren {requerida} puestos')


class AsignacionNoEncontrada(Exception):
    def __init__(self, identificador=None):
        msg = f'Asignación no encontrada: {identificador}' if identificador else 'Asignación no encontrada'
        super().__init__(msg)
