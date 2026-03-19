# aplicaciones/usuarios/vistas/autenticacion.py
# Vistas de autenticación: login JWT y búsqueda de profesores.
from django.contrib.auth import authenticate
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from aplicaciones.nucleo.constantes import Roles
from ..modelos import Usuario
from ..serializadores import LoginSerializador, UsuarioResumenSerializador


class LoginVista(APIView):
    """
    POST /api/auth/login/
    Recibe { correo, contrasena } → devuelve tokens JWT + datos del usuario.
    """
    permission_classes = []

    def post(self, request):
        serializador = LoginSerializador(data=request.data)
        if not serializador.is_valid():
            return Response({'ok': False, 'error': 'Datos inválidos'}, status=400)

        correo     = serializador.validated_data['correo']
        contrasena = serializador.validated_data['contrasena']
        usuario = authenticate(request, username=correo, password=contrasena)

        if not usuario:
            return Response({'ok': False, 'error': 'Correo o contraseña incorrectos'}, status=401)
        if not usuario.is_active:
            return Response({'ok': False, 'error': 'Usuario inactivo'}, status=403)

        refresh = RefreshToken.for_user(usuario)
        return Response({
            'ok': True,
            'datos': {
                'access':  str(refresh.access_token),
                'refresh': str(refresh),
                'usuario': UsuarioResumenSerializador(usuario).data,
            }
        })


class BuscarProfesoresVista(APIView):
    """
    GET /api/usuarios/buscar-profesores/?q=...
    Busca profesores por nombre, apellido, email o cédula. Devuelve máx 10.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        q = request.query_params.get('q', '').strip()
        if len(q) < 2:
            return Response([])

        profesores = (
            Usuario.objects
            .filter(rol=Roles.PROFESOR, is_active=True)
            .filter(
                Q(first_name__icontains=q) | Q(last_name__icontains=q)
                | Q(email__icontains=q)   | Q(username__icontains=q)
            )
            .exclude(pk=request.user.pk)
            .values('id', 'email', 'first_name', 'last_name')
            [:10]
        )
        return Response(list(profesores))
