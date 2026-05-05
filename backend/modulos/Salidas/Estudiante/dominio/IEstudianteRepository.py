"""
IEstudianteRepository — Puerto (interface) del dominio.
Define el CONTRATO que debe cumplir cualquier implementación
de persistencia (Django, mock, etc.).
El dominio solo conoce esta interface, nunca la implementación concreta.
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from .EstudianteInscripcion import EstudianteInscripcion
from .DirectorioEstudianteEntidad import DirectorioEstudianteEntidad

class IEstudianteRepository(ABC):

    # ── Directorio (autenticación) ───────────────────────────────────────────

    @abstractmethod
    def buscar_en_directorio(self, correo: str) -> Optional[DirectorioEstudianteEntidad]:
        """Busca un estudiante por correo en el directorio CSV activo."""
        pass

    @abstractmethod
    def verificar_password_directorio(self, correo: str, password_raw: str) -> bool:
        """Verifica si la contraseña coincide con el hash del directorio."""
        pass

    @abstractmethod
    def cargar_directorio_csv(self, filas: List[dict], nombre_archivo: str, admin_id: int) -> dict:
        """
        Recibe lista de dicts [{correo, password, facultad, programa, nombre, apellido}]
        Guarda masivamente en DirectorioEstudiante y crea registro CargaDirectorio.
        Retorna: { cargados, duplicados, errores }
        """
        pass

    @abstractmethod
    def listar_historial_cargas(self) -> List[dict]:
        """Retorna el historial de todas las cargas de CSV."""
        pass

    @abstractmethod
    def eliminar_carga(self, carga_id: int) -> None:
        """Elimina una carga y todos sus estudiantes asociados."""
        pass

    # ── Inscripciones ────────────────────────────────────────────────────────

    @abstractmethod
    def guardar_inscripcion(self, inscripcion: EstudianteInscripcion) -> EstudianteInscripcion:
        """Crea o actualiza una inscripción."""
        pass

    @abstractmethod
    def buscar_inscripcion(self, salida_id: int, usuario_id: int) -> Optional[EstudianteInscripcion]:
        """Busca si un usuario ya está inscrito en una salida."""
        pass

    @abstractmethod
    def listar_inscritos(self, salida_id: int) -> List[dict]:
        """Retorna todos los inscritos de una salida con sus datos de perfil."""
        pass

    @abstractmethod
    def cambiar_estado(self, inscripcion_id: int, nuevo_estado: str) -> EstudianteInscripcion:
        """Cambia el estado de una inscripción (autorizar/rechazar)."""
        pass

    # ── Dashboard Estudiante ──────────────────────────────────────────────────

    @abstractmethod
    def listar_salidas_estudiante(self, usuario_id: int) -> List[dict]:
        """Retorna el histórico de salidas en las que el estudiante está inscrito."""
        pass

    @abstractmethod
    def subir_documento(self, usuario_id: int, tipo_documento: str, archivo) -> dict:
        """Guarda o actualiza un documento del estudiante."""
        pass

    @abstractmethod
    def obtener_documentos(self, usuario_id: int) -> List[dict]:
        """Retorna los documentos actuales subidos por el estudiante."""
        pass
