"""
InscribirEstudianteCasoUso
──────────────────────────
Registra formalmente a un estudiante en una salida de campo.
Recibe los paths de foto y firma (ya guardados por el controlador).
Regla de negocio: un estudiante no puede inscribirse dos veces en la misma salida.
"""
from modulos.Salidas.Estudiante.dominio.IEstudianteRepository import IEstudianteRepository
from modulos.Salidas.Estudiante.dominio.EstudianteInscripcion import EstudianteInscripcion
from modulos.Salidas.Estudiante.dominio.EstudianteInscripcionId import EstudianteInscripcionId
from modulos.Salidas.Estudiante.dominio.EstudianteEstado import EstudianteEstado


class InscribirEstudianteCasoUso:
    def __init__(self, repo: IEstudianteRepository):
        self.repo = repo

    def ejecutar(self, salida_id: int, usuario_id: int, foto_path: str, firma_path: str) -> dict:
        # Regla: no puede inscribirse dos veces
        existente = self.repo.buscar_inscripcion(salida_id, usuario_id)
        if existente:
            raise ValueError("Ya estás inscrito en esta salida.")

        inscripcion = EstudianteInscripcion(
            id=EstudianteInscripcionId(None),
            salida_id=salida_id,
            usuario_id=usuario_id,
            foto_ficha=foto_path,
            firma_digital=firma_path,
            estado=EstudianteEstado('pendiente'),
        )
        guardada = self.repo.guardar_inscripcion(inscripcion)
        return {
            "id":     guardada.id.value,
            "estado": guardada.estado.value,
            "mensaje": "Inscripción enviada. Pendiente de autorización por tu profesor."
        }
