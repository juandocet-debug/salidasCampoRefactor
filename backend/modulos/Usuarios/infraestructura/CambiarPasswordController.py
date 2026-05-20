from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from modulos.Usuarios.infraestructura.models import UsuarioModel
import jwt
from django.conf import settings

class CambiarPasswordController(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return Response({'error': 'No autorizado'}, status=status.HTTP_401_UNAUTHORIZED)
        
        token = auth_header.split(' ')[1]
        try:
            secret = getattr(settings, 'SECRET_KEY', 'default_secret')
            payload = jwt.decode(token, secret, algorithms=['HS256'])
            # Support simplejwt (user_id) or my custom jwt (usuario_id)
            usuario_id = payload.get('usuario_id') or payload.get('user_id') 
            
            usuario = UsuarioModel.objects.get(id=usuario_id)
        except Exception as e:
            import traceback
            traceback.print_exc()
            print("ERROR IN CAMBIAR PASSWORD:", str(e))
            return Response({'error': 'Token inválido o expirado'}, status=status.HTTP_401_UNAUTHORIZED)

        nueva_password = request.data.get('nueva_password')
        if not nueva_password or len(nueva_password) < 4:
            return Response({'error': 'La contraseña debe tener al menos 4 caracteres'}, status=status.HTTP_400_BAD_REQUEST)

        usuario.password_hash = make_password(nueva_password)
        usuario.debe_cambiar_password = False
        usuario.save()

        # Generate a new token with updated claims
        nuevo_token = jwt.encode({
            'usuario_id': usuario.id,
            'rol': usuario.rol,
            'debe_cambiar_password': False
        }, secret, algorithm='HS256')

        return Response({
            'message': 'Contraseña actualizada correctamente',
            'access': nuevo_token,
            'usuario': {
                'id': usuario.id,
                'nombre': usuario.nombre,
                'apellido': usuario.apellido,
                'correo': usuario.email,
                'rol': usuario.rol,
                'debe_cambiar_password': False
            }
        }, status=status.HTTP_200_OK)
