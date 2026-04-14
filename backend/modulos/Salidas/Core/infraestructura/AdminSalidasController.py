from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from modulos.Salidas.Core.infraestructura.DjangoSalidaRepository import DjangoSalidaRepository
from modulos.Salidas.Core.aplicacion.SalidaDelete.SalidaDelete import SalidaDelete


class AdminSalidasController(APIView):
    permission_classes = [AllowAny]  # En prod: IsAdminUser

    def get(self, request):
        """Lista todas las salidas del sistema independientemente del estado."""
        repo = DjangoSalidaRepository()
        salidas = repo.get_all()
        data = [{
            'id': s.id.value,
            'codigo': s.codigo.value,
            'nombre': s.nombre.value,
            'asignatura': s.asignatura.value if s.asignatura else '',
            'semestre': s.semestre.value if s.semestre else '',
            'estado': s.estado.value,
            'profesor_id': s.profesor_id.value if s.profesor_id else None,
            'fecha_inicio': str(s.fecha_inicio.value) if s.fecha_inicio and s.fecha_inicio.value else None,
            'fecha_fin': str(s.fecha_fin.value) if s.fecha_fin and s.fecha_fin.value else None,
            'num_estudiantes': s.num_estudiantes.value if s.num_estudiantes else 0,
            'costo_estimado': float(s.costo_estimado.value or 0) if s.costo_estimado else 0,
        } for s in salidas]
        return Response(data, status=status.HTTP_200_OK)

    def delete(self, request, pk=None):
        """Elimina una salida y todos sus datos relacionados (itinerario, paradas)."""
        if not pk:
            return Response({'error': 'ID requerido'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            # Borrar en cascada: paradas → itinerario → salida
            from modulos.Salidas.Itinerario.infraestructura.models import ItinerarioModelo
            from modulos.Salidas.Itinerario.Parada.infraestructura.models import ParadaModelo

            itinerarios = ItinerarioModelo.objects.filter(salida_id=pk)
            for itin in itinerarios:
                ParadaModelo.objects.filter(itinerario_id=itin.id).delete()
            itinerarios.delete()

            repo = DjangoSalidaRepository()
            uso = SalidaDelete(repository=repo)
            uso.run(pk)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CleanupHuerfanosController(APIView):
    """Endpoint temporal — limpia itinerarios y paradas huérfanos (sin salida asociada)."""
    permission_classes = [AllowAny]

    def get(self, request):
        from modulos.Salidas.Core.infraestructura.models import SalidaModelo
        from modulos.Salidas.Itinerario.infraestructura.models import ItinerarioModelo
        from modulos.Salidas.Itinerario.Parada.infraestructura.models import ParadaModelo

        salida_ids = set(SalidaModelo.objects.values_list('id', flat=True))
        huerfanos  = ItinerarioModelo.objects.exclude(salida_id__in=salida_ids)

        count_paradas = 0
        for itin in huerfanos:
            count_paradas += ParadaModelo.objects.filter(itinerario_id=itin.id).delete()[0]

        count_itin = huerfanos.delete()[0]
        return Response({
            'ok': True,
            'itinerarios_eliminados': count_itin,
            'paradas_eliminadas': count_paradas,
            'mensaje': 'Base de datos limpia. Puedes crear nuevas salidas sin errores.'
        })
