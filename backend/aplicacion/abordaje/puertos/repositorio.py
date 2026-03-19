# aplicacion/abordaje/puertos/repositorio.py
# ─────────────────────────────────────────────────────────────────────────────
# PUERTO DE SALIDA — IAbordajeRepositorio
# Contrato de persistencia para el slice Abordaje.
# ⚠️  Cero imports de Django.
# ─────────────────────────────────────────────────────────────────────────────

from abc import ABC, abstractmethod
from dominio.abordaje.entidades import RegistroAbordaje, DocumentoEstudiante
from dominio.abordaje.valor_objetos import TipoDocumento


class IAbordajeRepositorio(ABC):

    @abstractmethod
    def guardar(self, registro: RegistroAbordaje) -> RegistroAbordaje: ...

    @abstractmethod
    def obtener(self, salida_id: int, estudiante_id: int) -> RegistroAbordaje:
        """Lanza AbordajeNoEncontrado si no existe."""
        ...

    @abstractmethod
    def obtener_por_codigo(self, salida_id: int, codigo: str) -> RegistroAbordaje:
        """Busca el registro por código de 6 chars. Lanza CodigoInvalido si no existe."""
        ...

    @abstractmethod
    def listar_por_salida(self, salida_id: int) -> list[RegistroAbordaje]:
        """Todos los estudiantes registrados en una salida."""
        ...

    @abstractmethod
    def contar_abordados(self, salida_id: int) -> int:
        """Retorna cuántos estudiantes ya abordaron."""
        ...


class IDocumentoRepositorio(ABC):

    @abstractmethod
    def guardar(self, doc: DocumentoEstudiante) -> DocumentoEstudiante: ...

    @abstractmethod
    def listar_por_estudiante(self, estudiante_id: int) -> list[DocumentoEstudiante]: ...

    @abstractmethod
    def obtener(self, estudiante_id: int, tipo: TipoDocumento) -> DocumentoEstudiante: ...
