# aplicacion/parametros/gestionar_ventanas.py
from typing import Any, Dict
from dominio.parametros.repositorios import IVentanaRepositorio

class CrearVentanaCasoUso:
    def __init__(self, repositorio: IVentanaRepositorio):
        self.repo = repositorio

    def ejecutar(self, datos: Dict[str, Any]) -> Any:
        return self.repo.crear(datos)

class ActualizarVentanaCasoUso:
    def __init__(self, repositorio: IVentanaRepositorio):
        self.repo = repositorio

    def ejecutar(self, pk: int, datos: Dict[str, Any]) -> Any:
        ventana = self.repo.obtener_por_id(pk)
        if not ventana:
            raise ValueError("Ventana de programación no encontrada")
        
        for key, val in datos.items():
            setattr(ventana, key, val)
        
        return self.repo.guardar(ventana)

class EliminarVentanaCasoUso:
    def __init__(self, repositorio: IVentanaRepositorio):
        self.repo = repositorio

    def ejecutar(self, pk: int) -> None:
        self.repo.eliminar(pk)
