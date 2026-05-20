from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ..aplicacion.ConductorCreate.ConductorCreate import ConductorCreate
from ..aplicacion.ConductorGetAll.ConductorGetAll import ConductorGetAll
from ..aplicacion.ConductorDelete.ConductorDelete import ConductorDelete
from ..aplicacion.ConductorUpdate.ConductorUpdate import ConductorUpdate
from .DjangoConductorExternoRepository import DjangoConductorExternoRepository
from .models import ConductorExternoModel


class ConductorExternoController(APIView):
    """
    GET  /api/transporte/conductores/?empresa_id=X → listar conductores de empresa
    POST /api/transporte/conductores/              → crear nuevo conductor
    DELETE /api/transporte/conductores/<pk>/       → desactivar conductor (soft delete)
    """

    def get(self, request):
        try:
            empresa_id = request.query_params.get('empresa_id')
            if not empresa_id:
                return Response({"error": "Se requiere el parámetro empresa_id"}, status=status.HTTP_400_BAD_REQUEST)
            repo = DjangoConductorExternoRepository()
            resultado = ConductorGetAll(repo).run(empresa_id=int(empresa_id))
            # Enrich with email and foto
            for c in resultado:
                db_model = ConductorExternoModel.objects.get(id=c['id'])
                c['email'] = db_model.email
                c['foto'] = request.build_absolute_uri(db_model.foto.url) if db_model.foto else None
            return Response(resultado, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            repo = DjangoConductorExternoRepository()
            resultado = ConductorCreate(repo).run(
                empresa_id=int(request.data.get('empresa_id')),
                nombre=request.data.get('nombre', ''),
                cedula=request.data.get('cedula', ''),
                telefono=request.data.get('telefono'),
                licencia=request.data.get('licencia'),
            )
            
            # Add email and photo after domain creation
            db_model = ConductorExternoModel.objects.get(id=resultado['id'])
            if request.data.get('email'):
                db_model.email = request.data.get('email')
            if 'foto' in request.FILES:
                db_model.foto = request.FILES.get('foto')
            db_model.save()
            
            resultado['email'] = db_model.email
            resultado['foto'] = request.build_absolute_uri(db_model.foto.url) if db_model.foto else None
            
            return Response(resultado, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        try:
            repo = DjangoConductorExternoRepository()
            resultado = ConductorUpdate(repo).run(
                conductor_id=pk,
                nombre=request.data.get('nombre', ''),
                cedula=request.data.get('cedula', ''),
                telefono=request.data.get('telefono'),
                licencia=request.data.get('licencia'),
            )
            
            # Update email and photo
            db_model = ConductorExternoModel.objects.get(id=resultado['id'])
            if 'email' in request.data:
                db_model.email = request.data.get('email')
            if 'foto' in request.FILES:
                db_model.foto = request.FILES.get('foto')
            if 'activo' in request.data:
                db_model.activo = str(request.data.get('activo')).lower() == 'true'
            db_model.save()
            
            resultado['email'] = db_model.email
            resultado['foto'] = request.build_absolute_uri(db_model.foto.url) if db_model.foto else None
            resultado['activo'] = db_model.activo
            
            return Response(resultado, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            repo = DjangoConductorExternoRepository()
            resultado = ConductorDelete(repo).run(conductor_id=pk)
            return Response(resultado, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
