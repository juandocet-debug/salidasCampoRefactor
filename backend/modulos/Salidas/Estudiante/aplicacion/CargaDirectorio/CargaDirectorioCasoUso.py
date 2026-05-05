"""
CargaDirectorioCasoUso
───────────────────────
Para uso del Admin del Sistema. Recibe la lista de filas parseadas del CSV/Excel
y las guarda masivamente en el directorio estudiantil.
Al cargar nuevo CSV: la carga anterior queda inactiva automáticamente.
"""
from modulos.Salidas.Estudiante.dominio.IEstudianteRepository import IEstudianteRepository


class CargaDirectorioCasoUso:
    def __init__(self, repo: IEstudianteRepository):
        self.repo = repo

    def ejecutar(self, filas: list, nombre_archivo: str, admin_id: int) -> dict:
        """
        filas: lista de dicts con claves {correo, password, nombre, apellido, facultad, programa}
        Retorna: { cargados, duplicados, errores, total }
        """
        if not filas:
            raise ValueError("El archivo no contiene registros válidos.")
        return self.repo.cargar_directorio_csv(filas, nombre_archivo, admin_id)


class ListarHistorialCargasCasoUso:
    def __init__(self, repo: IEstudianteRepository):
        self.repo = repo

    def ejecutar(self) -> list:
        return self.repo.listar_historial_cargas()


class EliminarCargaCasoUso:
    def __init__(self, repo: IEstudianteRepository):
        self.repo = repo

    def ejecutar(self, carga_id: int) -> None:
        self.repo.eliminar_carga(carga_id)
