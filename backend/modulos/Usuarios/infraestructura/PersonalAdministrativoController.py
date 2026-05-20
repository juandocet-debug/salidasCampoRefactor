from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from modulos.Usuarios.infraestructura.models import UsuarioModel

class PersonalAdministrativoController(APIView):
    """
    CRUD para Personal Administrativo (Conductores, Profesores, Coordinadores, etc.)
    Excluye explícitamente a los 'estudiantes'.
    """
    
    def get(self, request):
        from modulos.Logistica.ConductorInstitucional.infraestructura.models import ConductorInstitucionalModel
        from modulos.Logistica.ConductorExterno.infraestructura.models import ConductorExternoModel
        
        # 1. Sincronizar Conductores Institucionales y Externos a Usuarios
        conductores_inst = list(ConductorInstitucionalModel.objects.all())
        conductores_ext = list(ConductorExternoModel.objects.all())
        conductores = conductores_inst + conductores_ext
        for c in conductores:
            if not c.cedula: continue
            
            nombres_parts = c.nombre.split(' ', 1)
            nombre = nombres_parts[0]
            apellido = nombres_parts[1] if len(nombres_parts) > 1 else ''
            correo_generado = c.email if c.email else f"{c.cedula}@conductor.upn.edu.co"
            
            usuario, created = UsuarioModel.objects.get_or_create(
                cedula=c.cedula,
                defaults={
                    'nombre': nombre,
                    'apellido': apellido,
                    'email': correo_generado,
                    'telefono': c.telefono,
                    'rol': 'conductor',
                    'password_hash': make_password(c.cedula),
                    'foto': c.foto if c.foto else None,
                    'debe_cambiar_password': True
                }
            )
            # Si ya existía
            if not created:
                changed = False
                if c.foto and not usuario.foto:
                    usuario.foto = c.foto
                    changed = True
                if c.email and usuario.email != c.email and ("@conductor.upn.edu.co" in usuario.email or not usuario.email):
                    usuario.email = c.email
                    changed = True
                if changed:
                    usuario.save()

        # 2. Listar todo el personal que no sea estudiante
        personal = UsuarioModel.objects.exclude(rol='estudiante').order_by('-id')
        data = []
        for p in personal:
            data.append({
                'id': p.id,
                'nombre': p.nombre,
                'apellido': p.apellido,
                'email': p.email,
                'cedula': p.cedula,
                'telefono': p.telefono,
                'rol': p.rol,
                'foto': request.build_absolute_uri(p.foto.url) if p.foto else None
            })
            
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        datos = request.data
        if UsuarioModel.objects.filter(email=datos.get('email')).exists():
            return Response({"error": "El correo ya está registrado."}, status=status.HTTP_400_BAD_REQUEST)

        nuevo_usuario = UsuarioModel.objects.create(
            nombre=datos.get('nombre'),
            apellido=datos.get('apellido'),
            email=datos.get('email'),
            cedula=datos.get('cedula'),
            telefono=datos.get('telefono'),
            rol=datos.get('rol', 'conductor'),
            password_hash=make_password(datos.get('password')),
            debe_cambiar_password=True
        )
        
        return Response({
            "id": nuevo_usuario.id,
            "nombre": nuevo_usuario.nombre,
            "apellido": nuevo_usuario.apellido,
            "email": nuevo_usuario.email,
            "cedula": nuevo_usuario.cedula,
            "telefono": nuevo_usuario.telefono,
            "rol": nuevo_usuario.rol
        }, status=status.HTTP_201_CREATED)

class PersonalAdministrativoDetailController(APIView):
    
    def put(self, request, pk):
        try:
            usuario = UsuarioModel.objects.get(id=pk)
        except UsuarioModel.DoesNotExist:
            return Response({"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        datos = request.data
        
        # Validar email único si cambió
        if 'email' in datos and datos['email'] != usuario.email:
            if UsuarioModel.objects.filter(email=datos['email']).exists():
                return Response({"error": "El correo ya está en uso por otro usuario."}, status=status.HTTP_400_BAD_REQUEST)
            usuario.email = datos['email']

        if 'nombre' in datos: usuario.nombre = datos['nombre']
        if 'apellido' in datos: usuario.apellido = datos['apellido']
        if 'cedula' in datos: usuario.cedula = datos['cedula']
        if 'telefono' in datos: usuario.telefono = datos['telefono']
        if 'rol' in datos: usuario.rol = datos['rol']
        
        if 'password' in datos and datos['password']:
            usuario.password_hash = make_password(datos['password'])

        usuario.save()
        
        return Response({
            "id": usuario.id,
            "nombre": usuario.nombre,
            "apellido": usuario.apellido,
            "email": usuario.email,
            "cedula": usuario.cedula,
            "telefono": usuario.telefono,
            "rol": usuario.rol
        }, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            usuario = UsuarioModel.objects.get(id=pk)
            usuario.delete()
            return Response({"message": "Usuario eliminado exitosamente."}, status=status.HTTP_204_NO_CONTENT)
        except UsuarioModel.DoesNotExist:
            return Response({"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)
