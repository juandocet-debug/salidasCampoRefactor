"""
GestionarEstadoCasoUso
───────────────────────
Para uso del profesor. Cambia el estado de una inscripción
(autoriza o rechaza al estudiante para la salida).
Regla: solo se puede cambiar si el estado actual es 'pendiente'.
"""
from modulos.Salidas.Estudiante.dominio.IEstudianteRepository import IEstudianteRepository
from modulos.Salidas.Estudiante.dominio.EstudianteEstado import EstudianteEstado


class GestionarEstadoCasoUso:
    def __init__(self, repo: IEstudianteRepository):
        self.repo = repo

    def ejecutar(self, inscripcion_id: int, nuevo_estado: str) -> dict:
        # Validar que el estado nuevo es válido (lo hace el Value Object)
        EstudianteEstado(nuevo_estado)  # lanza ValueError si es inválido

        actualizada = self.repo.cambiar_estado(inscripcion_id, nuevo_estado)
        return {
            "id":     actualizada.id.value,
            "estado": actualizada.estado.value,
        }
