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

from modulos.Salidas.Core.infraestructura.models import SalidaModelo
from modulos.Salidas.Estudiante.aplicacion.LoginEstudiante.LoginEstudianteCasoUso import LoginEstudianteCasoUso
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from modulos.Salidas.Estudiante.aplicacion.LoginEstudiante.LoginEstudianteCasoUso import LoginEstudianteCasoUso
from modulos.Salidas.Estudiante.aplicacion.InscribirEstudiante.InscribirEstudianteCasoUso import InscribirEstudianteCasoUso
from .DjangoEstudianteRepository import DjangoEstudianteRepository


class EstudianteCodigoController(APIView):
    """
    Público. Recibe un PIN y retorna el ID de la salida y su nombre, si existe y está aprobada.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, pin):
        try:
            # Buscamos por PIN, ignorando mayúsculas/minúsculas
            salida = SalidaModelo.objects.get(pin_acceso__iexact=pin)
            return Response({
                'salida_id': salida.id,
                'nombre': salida.nombre,
                'codigo': salida.codigo
            }, status=200)
        except SalidaModelo.DoesNotExist:
            return Response({'error': 'PIN de acceso inválido o salida no encontrada.'}, status=404)

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

        from modulos.Usuarios.infraestructura.models import UsuarioModel
        from django.contrib.auth.hashers import check_password, make_password
        
        # 1. Intentar Login local (UsuarioModel) primero (para Conductores y Estudiantes ya cacheados)
        usuario_local = UsuarioModel.objects.filter(email=correo).first()
        if usuario_local and check_password(password_raw, usuario_local.password_hash):
            datos = {
                'nombre': usuario_local.nombre,
                'apellido': usuario_local.apellido,
                'facultad': getattr(usuario_local, 'facultad', ''), # Podría no tener facultad
                'programa': getattr(usuario_local, 'programa', ''),
                'rol': usuario_local.rol,
                'debe_cambiar_password': usuario_local.debe_cambiar_password
            }
            usuario_obj = usuario_local
        else:
            # 2. Si falla localmente, intentar en el Directorio Activo (CSV) para estudiantes nuevos
            repo = DjangoEstudianteRepository()
            try:
                datos = LoginEstudianteCasoUso(repo).ejecutar(correo, password_raw)
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)
            
            # Crear/obtener UsuarioModel local con rol='estudiante'
            usuario_obj, created = UsuarioModel.objects.get_or_create(
                email=correo,
                defaults={
                    'nombre':   datos['nombre'],
                    'apellido': datos['apellido'],
                    'cedula': datos.get('cedula'),
                    'telefono': datos.get('telefono'),
                    'password_hash': make_password(password_raw),  # Guardamos la contraseña para futuros logins locales
                    'rol': datos.get('rol', 'estudiante'),
                    'debe_cambiar_password': False
                }
            )
            
            if not created:
                # Actualizar contraseña y datos si ya existía pero falló el login local (ej: cambio en AD)
                usuario_obj.nombre = datos['nombre']
                usuario_obj.apellido = datos['apellido']
                if 'cedula' in datos and datos['cedula']:
                    usuario_obj.cedula = datos['cedula']
                if 'telefono' in datos and datos['telefono']:
                    usuario_obj.telefono = datos['telefono']
                usuario_obj.password_hash = make_password(password_raw)
                if 'rol' in datos:
                    usuario_obj.rol = datos['rol']
                usuario_obj.save()
        # Ya actualizado arriba

        # Estudiantes usan credenciales institucionales, no necesitan cambiar su contraseña
        if usuario_obj.rol == 'estudiante' and usuario_obj.debe_cambiar_password:
            usuario_obj.debe_cambiar_password = False
            usuario_obj.save()

        # Generar Token JWT
        import jwt
        from django.conf import settings
        secret = getattr(settings, 'SECRET_KEY', 'default_secret')
        token = jwt.encode({
            'usuario_id': usuario_obj.id,
            'rol': usuario_obj.rol,
            'debe_cambiar_password': usuario_obj.debe_cambiar_password
        }, secret, algorithm='HS256')
        
        # Si es conductor, intentar buscar sus datos adicionales
        licencia = ''
        cedula = usuario_obj.cedula or ''
        telefono = usuario_obj.telefono or ''
        tipo_conductor = 'Conductor'
        foto = None
        if usuario_obj.foto:
            foto = request.build_absolute_uri(usuario_obj.foto.url)
        
        if usuario_obj.rol == 'conductor':
            try:
                from modulos.Logistica.ConductorExterno.infraestructura.models import ConductorExternoModel
                cond = ConductorExternoModel.objects.filter(email=usuario_obj.email).first()
                if not cond:
                    from modulos.Logistica.ConductorInstitucional.infraestructura.models import ConductorInstitucionalModel
                    cond = ConductorInstitucionalModel.objects.filter(email=usuario_obj.email).first()
                    tipo_conductor = 'Conductor Institucional' if cond else 'Conductor'
                else:
                    tipo_conductor = 'Conductor Externo'
                
                if cond:
                    licencia = getattr(cond, 'licencia', getattr(cond, 'tipo_licencia', ''))
                    cedula = cond.cedula or cedula
                    telefono = cond.telefono or telefono
                    if getattr(cond, 'foto', None):
                        foto = request.build_absolute_uri(cond.foto.url)
            except Exception as e:
                print("Error buscando datos extra de conductor:", e)
                
        # Devolver datos
        return Response({
            'datos': {
                'usuario': {
                    'id': usuario_obj.id,
                    'nombre': usuario_obj.nombre,
                    'apellido': usuario_obj.apellido,
                    'correo': usuario_obj.email,
                    'facultad': getattr(usuario_obj, 'facultad', ''),
                    'programa': getattr(usuario_obj, 'programa', ''),
                    'rol': usuario_obj.rol,
                    'cedula': cedula,
                    'telefono': telefono,
                    'licencia': licencia,
                    'foto': foto,
                    'tipo_conductor': tipo_conductor,
                    'debe_cambiar_password': usuario_obj.debe_cambiar_password
                },
                'access': token
            }
        }, status=200)


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
        usuario_id = getattr(getattr(request, 'user', None), 'id', None) \
                     or request.data.get('usuario_id')
        if not usuario_id:
            return Response({'error': 'No autenticado.'}, status=401)

        # Resolver salida: acepta PK, codigo o pin_acceso
        from modulos.Salidas.Core.infraestructura.models import SalidaModelo
        salida_obj = None
        try:
            salida_obj = SalidaModelo.objects.get(pk=int(salida_id))
        except (SalidaModelo.DoesNotExist, ValueError, TypeError):
            pass
        if salida_obj is None:
            salida_obj = SalidaModelo.objects.filter(codigo=str(salida_id)).first()
        if salida_obj is None:
            salida_obj = SalidaModelo.objects.filter(pin_acceso__iexact=str(salida_id)).first()
        if salida_obj is None:
            return Response({'error': f'No existe una salida con el código {salida_id}. Verifica con tu profesor.'}, status=404)

        real_salida_id = salida_obj.id

        # Verificar primero si ya está inscrito (antes de cualquier otra validación)
        repo = DjangoEstudianteRepository()
        ya_inscrito = repo.buscar_inscripcion(real_salida_id, int(usuario_id))
        if ya_inscrito:
            return Response({'error': 'Ya estás inscrito en esta salida.'}, status=400)

        foto  = request.FILES.get('foto_ficha')
        firma = request.FILES.get('firma_digital')

        # Revisar si faltan documentos obligatorios primero para abortar rápido
        if hasattr(repo, 'tiene_documentos_obligatorios'):
            if not repo.tiene_documentos_obligatorios(usuario_id):
                return Response({'error': 'Debes subir tu Certificado EPS y Documento de Identidad en la pestaña \'Mis Documentos\' antes de inscribirte.'}, status=400)

        # Si no hay firma, exigirla siempre (ya no se recicla)
        if not firma:
            from .models import EstudianteSalida
            prev_inscripcion = EstudianteSalida.objects.filter(
                usuario_id=usuario_id
            ).exclude(foto_ficha='').first()
            
            return Response({
                'error': 'Firma requerida.', 
                'requiere_foto': not bool(prev_inscripcion)
            }, status=400)

        # Si no envían foto, reciclar la foto anterior
        if not foto:
            from .models import EstudianteSalida
            prev_inscripcion = EstudianteSalida.objects.filter(
                usuario_id=usuario_id
            ).exclude(foto_ficha='').first()

            if not prev_inscripcion:
                return Response({'error': 'Foto de identificación requerida.'}, status=400)

            foto = prev_inscripcion.foto_ficha

        try:
            resultado = InscribirEstudianteCasoUso(repo).ejecutar(
                salida_id=real_salida_id,
                usuario_id=int(usuario_id),
                foto_path=foto,
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

    def delete(self, request):
        usuario_id = request.data.get('usuario_id') or request.query_params.get('usuario_id')
        tipo_documento = request.data.get('tipo_documento') or request.query_params.get('tipo_documento')

        if not usuario_id or not tipo_documento:
            return Response({'error': 'usuario_id y tipo_documento son requeridos.'}, status=400)

        repo = DjangoEstudianteRepository()
        try:
            repo.eliminar_documento(int(usuario_id), tipo_documento)
            return Response({'ok': True}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
