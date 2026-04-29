from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from .DjangoVehiculoRepository import DjangoVehiculoRepository
from ....Logistica.Vehiculo.aplicacion.VehiculoCreate.VehiculoCreate import VehiculoCreate
from ....Logistica.Vehiculo.aplicacion.VehiculoEdit.VehiculoEdit import VehiculoEdit
from ....Logistica.Vehiculo.aplicacion.VehiculoDelete.VehiculoDelete import VehiculoDelete
from ....Logistica.Vehiculo.aplicacion.VehiculoGetAll.VehiculoGetAll import VehiculoGetAll

class VehiculoController(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, pk=None, *args, **kwargs):
        repo = DjangoVehiculoRepository()
        if pk:
            pass # Para detalle (no obligatorio de momento)
        else:
            from datetime import date
            filtros = {}
            if 'tipo' in request.GET: filtros['tipo'] = request.GET['tipo']
            if 'propietario' in request.GET: filtros['propietario'] = request.GET['propietario']
            
            # ─── Filtro de disponibilidad por fechas ──────────────────────────
            if 'fecha_inicio' in request.GET and 'fecha_fin' in request.GET:
                try:
                    filtros['fecha_inicio'] = date.fromisoformat(request.GET['fecha_inicio'])
                    filtros['fecha_fin'] = date.fromisoformat(request.GET['fecha_fin'])
                except ValueError:
                    pass  # Si el formato es inválido, simplemente no filtramos por fecha
            if 'salida_id' in request.GET:
                try:
                    filtros['salida_id'] = int(request.GET['salida_id'])
                except ValueError:
                    pass
            
            caso_uso = VehiculoGetAll(repository=repo)
            return Response(caso_uso.run(filtros))

    def post(self, request, *args, **kwargs):
        repo = DjangoVehiculoRepository()
        caso_uso = VehiculoCreate(repository=repo)
        try:
            foto = request.FILES.get('foto_vehiculo', None)
            
            data = caso_uso.run(
                placa=request.POST.get('placa'),
                tipo=request.POST.get('tipo', 'bus'),
                marca=request.POST.get('marca', ''),
                modelo=request.POST.get('modelo', ''),
                anio=int(request.POST.get('anio', 0)),
                color=request.POST.get('color', ''),
                numero_interno=request.POST.get('numero_interno', ''),
                capacidad=int(request.POST.get('capacidad', 0)),
                rendimiento_kmgal=float(request.POST.get('rendimiento_kmgal', 0.0)),
                tipo_combustible=request.POST.get('tipo_combustible', 'diesel'),
                propietario=request.POST.get('propietario', 'institucional'),
                estado_tecnico=request.POST.get('estado_tecnico', 'disponible'),
                notas=request.POST.get('notas', ''),
                foto_url=foto
            )
            return Response(data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, *args, **kwargs):
        repo = DjangoVehiculoRepository()
        caso_uso = VehiculoEdit(repository=repo)
        try:
            foto = request.FILES.get('foto_vehiculo', None)
            # Manejo particular: si el form no envía 'foto_vehiculo' como file, pero manda string vacío, se borra.
            if 'foto_vehiculo' in request.POST and request.POST['foto_vehiculo'] == '':
                foto = ""

            data = caso_uso.run(
                id_val=pk,
                placa=request.POST.get('placa'),
                tipo=request.POST.get('tipo'),
                marca=request.POST.get('marca'),
                modelo=request.POST.get('modelo'),
                anio=int(request.POST.get('anio')) if request.POST.get('anio') else None,
                color=request.POST.get('color'),
                numero_interno=request.POST.get('numero_interno'),
                capacidad=int(request.POST.get('capacidad')) if request.POST.get('capacidad') else None,
                rendimiento_kmgal=float(request.POST.get('rendimiento_kmgal')) if request.POST.get('rendimiento_kmgal') else None,
                tipo_combustible=request.POST.get('tipo_combustible'),
                propietario=request.POST.get('propietario'),
                estado_tecnico=request.POST.get('estado_tecnico'),
                notas=request.POST.get('notas'),
                foto_url=foto
            )
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        repo = DjangoVehiculoRepository()
        caso_uso = VehiculoDelete(repository=repo)
        try:
            caso_uso.run(id_val=pk)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
