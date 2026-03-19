# aplicacion/parametros/gestionar_facultades.py
from typing import Any, Dict
from dominio.parametros.repositorios import IFacultadRepositorio

class CrearFacultadCasoUso:
    def __init__(self, repositorio: IFacultadRepositorio):
        self.repo = repositorio

    def ejecutar(self, datos: Dict[str, Any]) -> Any:
        return self.repo.crear(datos)

class ActualizarFacultadCasoUso:
    def __init__(self, repositorio: IFacultadRepositorio):
        self.repo = repositorio

    def ejecutar(self, pk: int, datos: Dict[str, Any]) -> Any:
        facultad = self.repo.obtener_por_id(pk)
        if not facultad:
            raise ValueError("Facultad no encontrada")
        
        for key, val in datos.items():
            setattr(facultad, key, val)
        
        facultad_actualizada = self.repo.guardar(facultad)

        if 'activa' in datos:
            self.repo.sincronizar_programas(pk, datos['activa'])
            
        return facultad_actualizada

class EliminarFacultadCasoUso:
    def __init__(self, repositorio: IFacultadRepositorio):
        self.repo = repositorio

    def ejecutar(self, pk: int) -> None:
        self.repo.eliminar(pk)
