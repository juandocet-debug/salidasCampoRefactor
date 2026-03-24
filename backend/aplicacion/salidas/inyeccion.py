from infraestructura.salidas.repositorio import SalidaRepositorioDjango
from infraestructura.parametros.repositorio import ParametrosRepositorioDjango
from aplicacion.salidas.listar import ListarSalidasProfesorCasoUso
from aplicacion.salidas.crear import CrearSalidaCasoUso
from aplicacion.salidas.obtener import ObtenerSalidaCasoUso
from aplicacion.salidas.actualizar import ActualizarSalidaCasoUso
from aplicacion.salidas.eliminar import EliminarSalidaCasoUso
from aplicacion.salidas.enviar import EnviarSalidaCasoUso
from aplicacion.salidas.calcular_costo import CalcularCostoSalidaCasoUso

def proveer_listar_salidas():
    return ListarSalidasProfesorCasoUso(SalidaRepositorioDjango())

def proveer_crear_salida():
    return CrearSalidaCasoUso(SalidaRepositorioDjango())

def proveer_obtener_salida():
    return ObtenerSalidaCasoUso(SalidaRepositorioDjango())

def proveer_actualizar_salida():
    return ActualizarSalidaCasoUso(SalidaRepositorioDjango())

def proveer_eliminar_salida():
    return EliminarSalidaCasoUso(SalidaRepositorioDjango())

def proveer_enviar_salida():
    return EnviarSalidaCasoUso(SalidaRepositorioDjango())

def proveer_calcular_costo():
    return CalcularCostoSalidaCasoUso(SalidaRepositorioDjango(), ParametrosRepositorioDjango())
