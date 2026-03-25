from typing import List, Optional
from django.contrib.auth.hashers import make_password, check_password
from ..dominio.Usuario import Usuario
from ..dominio.UsuarioId import UsuarioId
from ..dominio.UsuarioNombre import UsuarioNombre
from ..dominio.UsuarioApellido import UsuarioApellido
from ..dominio.UsuarioEmail import UsuarioEmail
from ..dominio.UsuarioPassword import UsuarioPassword
from ..dominio.UsuarioFoto import UsuarioFoto
from ..dominio.UsuarioRepository import UsuarioRepository
from .models import UsuarioModel

class DjangoUsuarioRepository(UsuarioRepository):
    def save(self, usuario: Usuario) -> None:
        if usuario.id.value is None:
            modelo = UsuarioModel.objects.create(
                nombre=usuario.nombre.value,
                apellido=usuario.apellido.value,
                email=usuario.email.value,
                password_hash=make_password(usuario.password.value), # Hash en la capa sucia (infraestructura)
                foto=usuario.foto.value # Permite pasar objeto archivo o None
            )
            usuario.id = UsuarioId(modelo.pk)
        else:
            try:
                modelo = UsuarioModel.objects.get(pk=usuario.id.value)
                modelo.nombre = usuario.nombre.value
                modelo.apellido = usuario.apellido.value
                modelo.email = usuario.email.value
                if usuario.foto.value is not None:
                    modelo.foto = usuario.foto.value
                modelo.save()
            except UsuarioModel.DoesNotExist:
                raise ValueError(f"Usuario con ID {usuario.id.value} no encontrado")

    def get_by_id(self, id: UsuarioId) -> Optional[Usuario]:
        try:
            modelo = UsuarioModel.objects.get(pk=id.value)
            return self._map_to_domain(modelo)
        except UsuarioModel.DoesNotExist:
            return None

    def get_by_email(self, email: UsuarioEmail) -> Optional[Usuario]:
        try:
            modelo = UsuarioModel.objects.get(email=email.value)
            return self._map_to_domain(modelo)
        except UsuarioModel.DoesNotExist:
            return None

    def delete(self, id: UsuarioId) -> None:
        UsuarioModel.objects.filter(pk=id.value).delete()

    def get_all(self) -> List[Usuario]:
        return [self._map_to_domain(m) for m in UsuarioModel.objects.all()]

    def verify_password(self, id: UsuarioId, raw_password: str) -> bool:
        try:
            modelo = UsuarioModel.objects.get(pk=id.value)
            return check_password(raw_password, modelo.password_hash)
        except UsuarioModel.DoesNotExist:
            return False

    def _map_to_domain(self, modelo: UsuarioModel) -> Usuario:
        foto_url = modelo.foto.url if bool(modelo.foto) else None
        return Usuario(
            id=UsuarioId(modelo.pk),
            nombre=UsuarioNombre(modelo.nombre),
            apellido=UsuarioApellido(modelo.apellido),
            email=UsuarioEmail(modelo.email),
            password=UsuarioPassword("********"), # Dummy pasword, dominio nunca manipula hashes expuestos
            foto=UsuarioFoto(foto_url)
        )
