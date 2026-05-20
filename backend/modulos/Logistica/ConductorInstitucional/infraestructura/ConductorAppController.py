from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .DjangoConductorAppRepository import DjangoConductorAppRepository
from ..aplicacion.ConductorLoginCasoUso import ConductorLoginCasoUso
from ..aplicacion.ConductorMisViajesCasoUso import ConductorMisViajesCasoUso
from ..aplicacion.ConductorReportarNovedadCasoUso import ConductorReportarNovedadCasoUso
from ..aplicacion.ConductorNotificarLlegadaCasoUso import ConductorNotificarLlegadaCasoUso
import uuid
import jwt
from django.conf import settings

# Usaremos una clave secreta simple o la de settings para firmar el token del conductor
SECRET_KEY = getattr(settings, 'SECRET_KEY', 'conductor_secret_123')

class ConductorLoginController(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    
    def post(self, request):
        repo = DjangoConductorAppRepository()
        caso_uso = ConductorLoginCasoUso(repository=repo)
        try:
            cedula = request.data.get("cedula")
            telefono = request.data.get("telefono")
            
            datos_conductor = caso_uso.run(cedula=cedula, telefono=telefono)
            
            # Generar token JWT simple para el conductor
            token = jwt.encode({
                'conductor_id': datos_conductor['id'],
                'rol': 'conductor'
            }, SECRET_KEY, algorithm='HS256')
            
            return Response({
                "ok": True,
                "datos": datos_conductor,
                "access": token
            }, status=status.HTTP_200_OK)
            
        except ValueError as e:
            return Response({"ok": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"ok": False, "error": "Error interno del servidor"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ConductorMisViajesController(APIView):
    # Idealmente requeriríamos token, pero por rapidez y demo permitimos consultar por ID
    authentication_classes = []
    permission_classes = [AllowAny]
    
    def get(self, request):
        conductor_id = request.query_params.get("conductor_id")
        
        # Validar el token JWT
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
                conductor_claim = str(payload.get('conductor_id') or payload.get('usuario_id'))
                if payload.get('rol') != 'conductor' or conductor_claim != str(conductor_id):
                    return Response({"ok": False, "error": "Token inválido o no corresponde al conductor."}, status=status.HTTP_401_UNAUTHORIZED)
            except Exception as e:
                import traceback
                traceback.print_exc()
                print("ERROR MIS VIAJES:", str(e))
                return Response({"ok": False, "error": "Token expirado o inválido."}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"ok": False, "error": "Autenticación requerida."}, status=status.HTTP_401_UNAUTHORIZED)

        repo = DjangoConductorAppRepository()
        caso_uso = ConductorMisViajesCasoUso(repository=repo)
        try:
            viajes = caso_uso.run(conductor_id=conductor_id)
            return Response({"ok": True, "datos": viajes}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"ok": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            traceback.print_exc()
            print("ERROR MIS VIAJES INTERNAL:", str(e))
            return Response({"ok": False, "error": "Error interno del servidor"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ConductorComentarParadaController(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    
    def post(self, request):
        auth_header = request.headers.get('Authorization', '')
        conductor_id = None
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
                conductor_id = str(payload.get('conductor_id') or payload.get('usuario_id'))
            except:
                return Response({"ok": False, "error": "Token inválido."}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"ok": False, "error": "Autenticación requerida."}, status=status.HTTP_401_UNAUTHORIZED)

        parada_id = request.data.get('parada_id')
        comentario = request.data.get('comentario')
        
        repo = DjangoConductorAppRepository()
        caso_uso = ConductorComentarParadaCasoUso(repository=repo)
        try:
            caso_uso.run(conductor_id, parada_id, comentario)
            return Response({"ok": True, "mensaje": "Comentario guardado exitosamente."}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"ok": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"ok": False, "error": "Error interno del servidor"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ConductorReportarNovedadController(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    
    def post(self, request):
        auth_header = request.headers.get('Authorization', '')
        conductor_id = None
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
                conductor_id = str(payload.get('conductor_id') or payload.get('usuario_id'))
            except:
                return Response({"ok": False, "error": "Token inválido."}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"ok": False, "error": "Autenticación requerida."}, status=status.HTTP_401_UNAUTHORIZED)

        salida_id = request.data.get('salida_id')
        nivel = request.data.get('nivel', 'media')
        mensaje = request.data.get('mensaje')
        foto = request.data.get('foto')
        
        repo = DjangoConductorAppRepository()
        caso_uso = ConductorReportarNovedadCasoUso(repository=repo)
        try:
            caso_uso.run(conductor_id, salida_id, nivel, mensaje, foto)
            return Response({"ok": True, "mensaje": "Novedad reportada exitosamente."}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"ok": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"ok": False, "error": "Error interno del servidor"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ConductorNotificarLlegadaController(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    
    def post(self, request):
        auth_header = request.headers.get('Authorization', '')
        conductor_id = None
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
                conductor_id = str(payload.get('conductor_id') or payload.get('usuario_id'))
            except:
                return Response({"ok": False, "error": "Token inválido."}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"ok": False, "error": "Autenticación requerida."}, status=status.HTTP_401_UNAUTHORIZED)

        salida_id = request.data.get('salida_id')
        if not salida_id:
            return Response({"ok": False, "error": "Se requiere salida_id."}, status=status.HTTP_400_BAD_REQUEST)
        
        repo = DjangoConductorAppRepository()
        caso_uso = ConductorNotificarLlegadaCasoUso(repository=repo)
        try:
            caso_uso.run(conductor_id, salida_id)
            return Response({"ok": True, "mensaje": "Llegada notificada exitosamente."}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"ok": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"ok": False, "error": "Error interno del servidor"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ConductorFinalizarViajeController(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    
    def post(self, request):
        auth_header = request.headers.get('Authorization', '')
        conductor_id = None
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
                conductor_id = str(payload.get('conductor_id') or payload.get('usuario_id'))
            except:
                return Response({"ok": False, "error": "Token inválido."}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"ok": False, "error": "Autenticación requerida."}, status=status.HTTP_401_UNAUTHORIZED)

        salida_id = request.data.get("salida_id")
        if not salida_id:
            return Response({"ok": False, "error": "Se requiere salida_id."}, status=status.HTTP_400_BAD_REQUEST)
            
        repo = DjangoConductorAppRepository()
        try:
            repo.finalizar_viaje(conductor_id=conductor_id, salida_id=salida_id)
            return Response({"ok": True, "mensaje": "Viaje finalizado exitosamente."}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"ok": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"ok": False, "error": "Error interno del servidor"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
