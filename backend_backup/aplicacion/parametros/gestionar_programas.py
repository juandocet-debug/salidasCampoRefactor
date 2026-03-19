# aplicacion/parametros/gestionar_programas.py
from typing import Any, Dict
from dominio.parametros.repositorios import IProgramaRepositorio

class CrearProgramaCasoUso:
    def __init__(self, repositorio: IProgramaRepositorio):
        self.repo = repositorio

    def ejecutar(self, datos: Dict[str, Any]) -> Any:
        return self.repo.crear(datos)

class ActualizarProgramaCasoUso:
    def __init__(self, repositorio: IProgramaRepositorio):
        self.repo = repositorio

    def ejecutar(self, pk: int, datos: Dict[str, Any]) -> Any:
        programa = self.repo.obtener_por_id(pk)
        if not programa:
            raise ValueError("Programa no encontrado")
        
        for key, val in datos.items():
            setattr(programa, key, val)
        
        return self.repo.guardar(programa)

class EliminarProgramaCasoUso:
    def __init__(self, repositorio: IProgramaRepositorio):
        self.repo = repositorio

    def ejecutar(self, pk: int) -> None:
        self.repo.eliminar(pk)
