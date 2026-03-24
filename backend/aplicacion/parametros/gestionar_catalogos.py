# CAPA: Aplicación
# QUÉ HACE: Casos de uso transaccionales para creación, edición y borrado de catálogos
# NO DEBE CONTENER: Django, Models, Views

from dominio.parametros.entidad import Facultad, Programa
from dominio.parametros.puerto import IFacultadRepositorio, IProgramaRepositorio

class CasoUsoFacultad:
    def __init__(self, repo: IFacultadRepositorio):
        self.repo = repo

    def crear(self, datos: dict) -> Facultad:
        f = Facultad(
            nombre=datos.get('nombre'), 
            activa=datos.get('activa', True)
        )
        return self.repo.guardar(f)

    def actualizar(self, id: int, datos: dict) -> Facultad:
        # En una arquitectura estricta se debería primero instanciar u obtener por id.
        # Por robustez simulamos la entidad con los datos actualizados.
        f = Facultad(
            id=int(id), 
            nombre=datos.get('nombre'), 
            activa=datos.get('activa', True)
        )
        return self.repo.guardar(f)

    def eliminar(self, id: int) -> None:
        self.repo.eliminar(int(id))


class CasoUsoPrograma:
    def __init__(self, repo: IProgramaRepositorio):
        self.repo = repo

    def crear(self, datos: dict) -> Programa:
        p = Programa(
            nombre=datos.get('nombre'), 
            facultad_id=int(datos.get('facultad')), 
            activo=datos.get('activo', True)
        )
        return self.repo.guardar(p)

    def actualizar(self, id: int, datos: dict) -> Programa:
        # El frontend pasa "facultad" pero puede pasar otros valores omitidos.
        p = Programa(
            id=int(id), 
            nombre=datos.get('nombre'), 
            facultad_id=int(datos.get('facultad')) if datos.get('facultad') else None, 
            activo=datos.get('activo', True)
        )
        return self.repo.guardar(p)

    def eliminar(self, id: int) -> None:
        self.repo.eliminar(int(id))
