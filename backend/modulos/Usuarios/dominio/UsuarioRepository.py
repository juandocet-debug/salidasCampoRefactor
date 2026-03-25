from abc import ABC, abstractmethod
from typing import List, Optional
from .Usuario import Usuario
from .UsuarioId import UsuarioId
from .UsuarioEmail import UsuarioEmail

class UsuarioRepository(ABC):
    @abstractmethod
    def save(self, usuario: Usuario) -> None:
        pass

    @abstractmethod
    def get_by_id(self, id: UsuarioId) -> Optional[Usuario]:
        pass

    @abstractmethod
    def get_by_email(self, email: UsuarioEmail) -> Optional[Usuario]:
        pass

    @abstractmethod
    def get_all(self) -> List[Usuario]:
        pass

    @abstractmethod
    def delete(self, id: UsuarioId) -> None:
        pass

    @abstractmethod
    def verify_password(self, id: UsuarioId, raw_password: str) -> bool:
        pass
