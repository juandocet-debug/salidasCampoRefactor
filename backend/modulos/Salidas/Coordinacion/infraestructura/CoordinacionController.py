from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from modulos.Salidas.Core.infraestructura.DjangoSalidaRepository import DjangoSalidaRepository
from .DjangoRevisionPedagogicaRepository import DjangoRevisionPedagogicaRepository
from modulos.Salidas.Coordinacion.aplicacion.RegistrarRevisionCasoUso import RegistrarRevisionCasoUso
from modulos.Salidas.Coordinacion.aplicacion.ListarSalidasPorRevisarCasoUso import ListarSalidasPorRevisarCasoUso
from modulos.Salidas.Coordinacion.aplicacion.ListarSalidasAprobadasCasoUso import ListarSalidasAprobadasCasoUso


class DebugSalidasController(APIView):
    """Endpoint temporal para debuggear el estado de todas las salidas."""
    permission_classes = [AllowAny]

    def get(self, request):
        repo = DjangoSalidaRepository()
        todas = repo.get_all()
        data = [{
            'id': s.id.value,
            'codigo': s.codigo.value,
            'nombre': s.nombre.value,
            'estado': s.estado.value,
        } for s in todas]
        return Response(data, status=status.HTTP_200_OK)

class SalidasPendientesCoordinadorController(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        salida_repo = DjangoSalidaRepository()
        caso_uso = ListarSalidasPorRevisarCasoUso(salida_repo)
        salidas = caso_uso.ejecutar()
        data = [{
            'id': s.id.value, 
            'nombre': s.nombre.value, 
            'estado': s.estado.value, 
            'codigo': s.codigo.value,
            'asignatura': s.asignatura.value if s.asignatura else '',
            'semestre': s.semestre.value if s.semestre else '',
            'profesor_id': s.profesor_id.value if s.profesor_id else None,
            'profesor_nombre': None,  # Se puede enriquecer con el nombre del usuario
            'fecha_inicio': str(s.fecha_inicio.value) if s.fecha_inicio and s.fecha_inicio.value else None,
            'fecha_fin': str(s.fecha_fin.value) if s.fecha_fin and s.fecha_fin.value else None,
            'num_estudiantes': s.num_estudiantes.value if s.num_estudiantes else 0,
            'programa_id': s.programa_id.value if s.programa_id else None,
            'justificacion': s.justificacion.value if s.justificacion else '',
            'costo_estimado': s.costo_estimado.value if hasattr(s, 'costo_estimado') and s.costo_estimado else 0,
        } for s in salidas]
        return Response(data, status=status.HTTP_200_OK)

class SalidasAprobadasCoordinadorController(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        salida_repo = DjangoSalidaRepository()
        caso_uso = ListarSalidasAprobadasCasoUso(salida_repo)
        salidas = caso_uso.ejecutar()
        data = [{
            'id': s.id.value, 
            'nombre': s.nombre.value, 
            'estado': s.estado.value, 
            'codigo': s.codigo.value,
            'asignatura': s.asignatura.value if s.asignatura else '',
            'semestre': s.semestre.value if s.semestre else '',
            'profesor_id': s.profesor_id.value if s.profesor_id else None,
            'profesor_nombre': None,
            'fecha_inicio': str(s.fecha_inicio.value) if s.fecha_inicio and s.fecha_inicio.value else None,
            'fecha_fin': str(s.fecha_fin.value) if s.fecha_fin and s.fecha_fin.value else None,
            'num_estudiantes': s.num_estudiantes.value if s.num_estudiantes else 0,
            'programa_id': s.programa_id.value if s.programa_id else None,
            'justificacion': s.justificacion.value if hasattr(s, 'justificacion') and s.justificacion else '',
            'costo_estimado': s.costo_estimado.value if hasattr(s, 'costo_estimado') and s.costo_estimado else 0,
        } for s in salidas]
        return Response(data, status=status.HTTP_200_OK)

class RegistrarRevisionController(APIView):
    permission_classes = [AllowAny]

    def post(self, request, salida_id):
        salida_repo = DjangoSalidaRepository()
        revision_repo = DjangoRevisionPedagogicaRepository()
        caso_uso = RegistrarRevisionCasoUso(revision_repo, salida_repo)
        
        try:
            # Asignamos ID de Coordinador (en prod vendría de request.user)
            coordinador_id = request.data.get('coordinador_id', 1) 
            caso_uso.ejecutar(salida_id, coordinador_id, request.data)
            return Response({"mensaje": "Revisión pedagógica registrada exitosamente."}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
