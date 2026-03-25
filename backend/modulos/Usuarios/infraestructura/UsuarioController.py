from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .DjangoUsuarioRepository import DjangoUsuarioRepository
from ..aplicacion.UsuarioCreate.UsuarioCreate import UsuarioCreate
from ..aplicacion.UsuarioLogin.UsuarioLogin import UsuarioLogin
from ..aplicacion.UsuarioEdit.UsuarioEdit import UsuarioEdit
from ..aplicacion.UsuarioDelete.UsuarioDelete import UsuarioDelete
from ..aplicacion.UsuarioGetAll.UsuarioGetAll import UsuarioGetAll
from ..aplicacion.UsuarioGetById.UsuarioGetById import UsuarioGetById

class UsuarioController(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request):
        repo = DjangoUsuarioRepository()
        caso_uso = UsuarioGetAll(repository=repo)
        data = caso_uso.run()
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        repo = DjangoUsuarioRepository()
        caso_uso = UsuarioCreate(repository=repo)
        try:
            nombre = request.data.get("nombre")
            apellido = request.data.get("apellido")
            email = request.data.get("email")
            password = request.data.get("password")
            foto = request.FILES.get("foto") # Se extrae el archivo multipart, si existe
            
            caso_uso.run(
                nombre=nombre,
                apellido=apellido,
                email=email,
                password=password,
                foto=foto
            )
            return Response({"message": "Usuario creado con éxito"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UsuarioDetailController(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request, pk):
        repo = DjangoUsuarioRepository()
        caso_uso = UsuarioGetById(repository=repo)
        try:
            data = caso_uso.run(pk)
            return Response(data, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        repo = DjangoUsuarioRepository()
        caso_uso = UsuarioEdit(repository=repo)
        try:
            nombre = request.data.get("nombre")
            apellido = request.data.get("apellido")
            email = request.data.get("email")
            foto = request.FILES.get("foto")
            
            caso_uso.run(
                id_val=pk,
                nombre=nombre,
                apellido=apellido,
                email=email,
                foto=foto
            )
            return Response({"message": "Usuario actualizado con éxito"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        repo = DjangoUsuarioRepository()
        caso_uso = UsuarioDelete(repository=repo)
        try:
            caso_uso.run(pk)
            return Response({"message": "Usuario eliminado con éxito"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

from rest_framework.permissions import AllowAny

class UsuarioLoginController(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        repo = DjangoUsuarioRepository()
        caso_uso = UsuarioLogin(repository=repo)
        try:
            email = request.data.get("email") or request.data.get("correo")
            password = request.data.get("password") or request.data.get("contrasena")

            data = caso_uso.run(email=email, password_raw=password)
            
            # Generar token JWT para el usuario
            from rest_framework_simplejwt.tokens import RefreshToken
            class DummyUser:
                def __init__(self, user_id):
                    self.id = user_id
            
            token = RefreshToken.for_user(DummyUser(data["id"]))
            
            response_payload = {
                "ok": True,
                "datos": {
                    "usuario": {
                        "id": data["id"],
                        "first_name": data["nombre"],
                        "last_name": data["apellido"],
                        "email": data["email"],
                        "foto": data["foto"]
                    },
                    "access": str(token.access_token)
                }
            }
            return Response(response_payload, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)

