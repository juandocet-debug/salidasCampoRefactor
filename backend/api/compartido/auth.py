# CAPA: API — Compartido
# QUÉ HACE: Endpoint login compatible con el frontend
# NO DEBE CONTENER: lógica de negocio, ORM directo

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from aplicacion.compartido.inyeccion import proveer_autenticar_usuario


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    correo     = request.data.get('correo')
    contrasena = request.data.get('contrasena')

    if not correo or not contrasena:
        return Response(
            {'ok': False, 'error': 'Correo y contraseña requeridos'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        resultado = proveer_autenticar_usuario().ejecutar(correo, contrasena)
    except Exception:
        return Response(
            {'ok': False, 'error': 'Credenciales incorrectas'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    return Response({
        'ok': True,
        'datos': {
            'access':  resultado['tokens']['access'],
            'refresh': resultado['tokens']['refresh'],
            'usuario': resultado['usuario']
        }
    }, status=status.HTTP_200_OK)
