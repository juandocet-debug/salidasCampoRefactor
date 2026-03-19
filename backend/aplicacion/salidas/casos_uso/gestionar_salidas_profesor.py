# aplicacion/salidas/casos_uso/gestionar_salidas_profesor.py
from typing import List, Dict, Any
from dominio.salidas.entidades import Salida
from dominio.salidas.excepciones import SalidaNoEncontrada, TransicionNoPermitida, SalidaSinPermiso
from aplicacion.salidas.puertos.repositorio import ISalidaRepositorio

class ListarSalidasProfesorCasoUso:
    def __init__(self, repositorio: ISalidaRepositorio):
        self.repo = repositorio

    def ejecutar(self, profesor_id: int) -> List[Salida]:
        return self.repo.listar_por_profesor(profesor_id)

class CrearSalidaCasoUso:
    def __init__(self, repositorio: ISalidaRepositorio):
        self.repo = repositorio

    def ejecutar(self, datos: Dict[str, Any], profesor_id: int) -> Salida:
        datos['profesor_id'] = profesor_id
        return self.repo.crear(datos)

class ObtenerSalidaCasoUso:
    def __init__(self, repositorio: ISalidaRepositorio):
        self.repo = repositorio

    def ejecutar(self, salida_id: int, profesor_id: int) -> Salida:
        salida = self.repo.obtener_por_id(salida_id)
        if not salida or salida.profesor_id != profesor_id:
            raise SalidaNoEncontrada()
        return salida

class ActualizarSalidaCasoUso:
    def __init__(self, repositorio: ISalidaRepositorio):
        self.repo = repositorio

    def ejecutar(self, salida_id: int, profesor_id: int, datos: Dict[str, Any]) -> Salida:
        salida = self.repo.obtener_por_id(salida_id)
        if not salida or salida.profesor_id != profesor_id:
            raise SalidaNoEncontrada()
        
        if not salida.puede_editarse:
            raise TransicionNoPermitida(salida.estado, "EDITAR")
            
        return self.repo.actualizar(salida_id, datos)

class EliminarSalidaCasoUso:
    def __init__(self, repositorio: ISalidaRepositorio):
        self.repo = repositorio

    def ejecutar(self, salida_id: int, profesor_id: int) -> None:
        salida = self.repo.obtener_por_id(salida_id)
        if not salida or salida.profesor_id != profesor_id:
            raise SalidaNoEncontrada()
            
        if not salida.puede_eliminarse:
            raise TransicionNoPermitida(salida.estado, "ELIMINAR")
            
        self.repo.eliminar(salida_id)
