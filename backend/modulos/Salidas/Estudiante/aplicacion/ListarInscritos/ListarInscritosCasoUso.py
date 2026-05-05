"""
ListarInscritosCasoUso
──────────────────────
Para uso del profesor. Retorna la lista completa de estudiantes inscritos
en una salida específica, incluyendo sus datos de perfil, foto, firma y estado.
"""
from modulos.Salidas.Estudiante.dominio.IEstudianteRepository import IEstudianteRepository


class ListarInscritosCasoUso:
    def __init__(self, repo: IEstudianteRepository):
        self.repo = repo

    def ejecutar(self, salida_id: int) -> list:
        return self.repo.listar_inscritos(salida_id)
