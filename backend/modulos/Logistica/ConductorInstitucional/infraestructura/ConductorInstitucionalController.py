from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import ConductorInstitucionalModel

class ConductorInstitucionalController(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, pk=None):
        if pk:
            c = get_object_or_404(ConductorInstitucionalModel, id=pk)
            return Response(self._serialize(request, c), status=200)

        incluir_inactivos = request.query_params.get('incluir_inactivos', 'false').lower() == 'true'
        if incluir_inactivos:
            conductores = ConductorInstitucionalModel.objects.all().order_by('nombre')
        else:
            conductores = ConductorInstitucionalModel.objects.filter(activo=True).order_by('nombre')
        
        return Response([self._serialize(request, c) for c in conductores], status=200)

    def post(self, request):
        data = request.data
        activo_val = data.get('activo', 'true')
        if isinstance(activo_val, str):
            activo = activo_val.lower() == 'true'
        else:
            activo = bool(activo_val)

        conductor = ConductorInstitucionalModel.objects.create(
            nombre=data.get('nombre'),
            cedula=data.get('cedula'),
            email=data.get('email'),
            telefono=data.get('telefono'),
            tipo_licencia=data.get('licencia'),
            foto=request.FILES.get('foto'),
            activo=activo
        )
        return Response(self._serialize(request, conductor), status=201)

    def patch(self, request, pk):
        conductor = get_object_or_404(ConductorInstitucionalModel, id=pk)
        data = request.data
        if 'nombre' in data: conductor.nombre = data['nombre']
        if 'cedula' in data: conductor.cedula = data['cedula']
        if 'email' in data: conductor.email = data['email']
        if 'telefono' in data: conductor.telefono = data['telefono']
        if 'licencia' in data: conductor.tipo_licencia = data['licencia']
        if 'activo' in data: 
            val = data['activo']
            conductor.activo = (val.lower() == 'true') if isinstance(val, str) else bool(val)
        if 'foto' in request.FILES:
            conductor.foto = request.FILES['foto']
        
        conductor.save()
        return Response(self._serialize(request, conductor), status=200)

    def delete(self, request, pk):
        conductor = get_object_or_404(ConductorInstitucionalModel, id=pk)
        conductor.activo = False
        conductor.save()
        return Response({'message': 'Conductor desactivado correctamente'}, status=200)

    def _serialize(self, request, c):
        return {
            'id': str(c.id),
            'nombre': c.nombre,
            'cedula': c.cedula,
            'email': c.email,
            'telefono': c.telefono,
            'licencia': c.tipo_licencia,
            'activo': c.activo,
            'foto': request.build_absolute_uri(c.foto.url) if c.foto else None
        }

