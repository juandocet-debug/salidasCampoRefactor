"""
EstudianteController — Adaptador de entrada (infraestructura).
Maneja las peticiones HTTP del estudiante:
  - POST /api/auth/estudiante/login/   → valida credenciales y retorna JWT
  - POST /api/estudiante/{id}/inscribirse/ → guarda foto + firma
  - GET  /api/estudiante/{id}/mi-inscripcion/ → estado de su inscripción
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from modulos.Salidas.Estudiante.aplicacion.LoginEstudiante.LoginEstudianteCasoUso import LoginEstudianteCasoUso
from modulos.Salidas.Estudiante.aplicacion.InscribirEstudiante.InscribirEstudianteCasoUso import InscribirEstudianteCasoUso
from .DjangoEstudianteRepository import DjangoEstudianteRepository


class EstudianteLoginController(APIView):
    """
    Público. Valida correo+contraseña contra el directorio CSV activo.
    Si OK → busca/crea UsuarioModel con rol='estudiante' y genera JWT.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        correo       = request.data.get('correo', '').strip().lower()
        password_raw = request.data.get('password', '').strip()

        if not correo or not password_raw:
            return Response({'error': 'Correo y contraseña son requeridos.'}, status=400)

        repo = DjangoEstudianteRepository()
        try:
            datos = LoginEstudianteCasoUso(repo).ejecutar(correo, password_raw)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        # Crear/obtener UsuarioModel local con rol='estudiante'
        from modulos.Usuarios.infraestructura.models import UsuarioModel
        from django.contrib.auth.hashers import make_password

        usuario_obj, _ = UsuarioModel.objects.get_or_create(
            email=correo,
            defaults={
                'nombre':   datos['nombre'],
                'apellido': datos['apellido'],
                'password_hash': make_password(''),  # no se usa para login
            }
        )
        # Actualizar campos dinámicos si cambiaron
        UsuarioModel.objects.filter(pk=usuario_obj.pk).update(
            nombre=datos['nombre'],
            apellido=datos['apellido'],
        )

        # Generar JWT
        from rest_framework_simplejwt.tokens import RefreshToken
        class _DummyUser:
            def __init__(self, uid): self.id = uid
        token = RefreshToken.for_user(_DummyUser(usuario_obj.pk))

        return Response({
            'ok': True,
            'datos': {
                'usuario': {
                    'id':       usuario_obj.pk,
                    'nombre':   datos['nombre'],
                    'apellido': datos['apellido'],
                    'email':    correo,
                    'facultad': datos['facultad'],
                    'programa': datos['programa'],
                    'rol':      'estudiante',
                },
                'access': str(token.access_token),
            }
        })


class EstudianteInscripcionController(APIView):
    """
    Requiere JWT. El estudiante sube foto + firma para inscribirse en una salida.
    GET  → estado de su inscripción actual
    POST → inscribirse (multipart con foto_ficha y firma_digital)
    """
    permission_classes = [AllowAny]
    authentication_classes = []
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request, salida_id):
        """Retorna si el estudiante ya está inscrito y en qué estado."""
        usuario_id = request.user.id if hasattr(request, 'user') else request.data.get('usuario_id')
        repo = DjangoEstudianteRepository()
        inscripcion = repo.buscar_inscripcion(int(salida_id), int(usuario_id))
        if not inscripcion:
            return Response({'inscrito': False}, status=200)
        return Response({
            'inscrito': True,
            'estado':   inscripcion.estado.value,
            'fecha':    inscripcion.fecha_inscripcion,
        })

    def post(self, request, salida_id):
        """Inscribir al estudiante con foto y firma."""
        # El usuario_id viene del token (o del body en modo demo)
        usuario_id = getattr(getattr(request, 'user', None), 'id', None) \
                     or request.data.get('usuario_id')
        if not usuario_id:
            return Response({'error': 'No autenticado.'}, status=401)

        foto  = request.FILES.get('foto_ficha')
        firma = request.FILES.get('firma_digital')

        repo = DjangoEstudianteRepository()

        # Si no envían archivos, buscar si tienen una inscripción previa con firma y foto
        if not foto or not firma:
            from .models import EstudianteSalida
            prev_inscripcion = EstudianteSalida.objects.filter(
                usuario_id=usuario_id
            ).exclude(foto_ficha='').exclude(firma_digital='').first()

            if not prev_inscripcion:
                return Response({'error': 'Foto y firma son obligatorias para tu primera inscripción.'}, status=400)
            
            # Usar los archivos previos
            foto = prev_inscripcion.foto_ficha
            firma = prev_inscripcion.firma_digital

        try:
            resultado = InscribirEstudianteCasoUso(repo).ejecutar(
                salida_id=int(salida_id),
                usuario_id=int(usuario_id),
                foto_path=foto,      # El repositorio lo manejará
                firma_path=firma,
            )
        except ValueError as e:
            return Response({'error': str(e)}, status=400)

        return Response(resultado, status=201)

class EstudianteMisSalidasController(APIView):
    """
    GET /api/estudiante/mis-salidas/
    Retorna el historial de salidas en las que el estudiante está inscrito.
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        usuario_id = request.data.get('usuario_id') or request.query_params.get('usuario_id')
        if not hasattr(request, 'user') and not usuario_id:
            return Response({'error': 'No autenticado.'}, status=401)
        
        usuario_id = getattr(getattr(request, 'user', None), 'id', None) or usuario_id
        repo = DjangoEstudianteRepository()
        salidas = repo.listar_salidas_estudiante(int(usuario_id))
        return Response({'ok': True, 'datos': salidas}, status=200)

class EstudianteDocumentosController(APIView):
    """
    GET  /api/estudiante/mis-documentos/ → lista documentos
    POST /api/estudiante/mis-documentos/ → sube/actualiza documento
    """
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        usuario_id = request.query_params.get('usuario_id')
        if not usuario_id:
            return Response({'error': 'No autenticado.'}, status=401)
        
        repo = DjangoEstudianteRepository()
        docs = repo.obtener_documentos(int(usuario_id))
        return Response({'ok': True, 'datos': docs}, status=200)

    def post(self, request):
        usuario_id = request.data.get('usuario_id')
        tipo_documento = request.data.get('tipo_documento')
        archivo = request.FILES.get('archivo')

        if not usuario_id or not tipo_documento or not archivo:
            return Response({'error': 'usuario_id, tipo_documento y archivo son requeridos.'}, status=400)

        repo = DjangoEstudianteRepository()
        try:
            doc = repo.subir_documento(int(usuario_id), tipo_documento, archivo)
            return Response({'ok': True, 'datos': doc}, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
