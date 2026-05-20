"""
ConductorCheckpointController — Adaptador de entrada.
Permite al conductor (o profesor) marcar una parada del itinerario como completada.
La confirmación queda registrada y es visible para el coordinador de salidas.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone

from modulos.Salidas.Core.infraestructura.models import CheckpointParada


class ConductorCheckpointController(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Marca una parada como completada.
        Body: { salida_id, parada_id, parada_nombre, reportado_por, usuario_id?, notas? }
        """
        salida_id     = request.data.get('salida_id')
        parada_id     = request.data.get('parada_id')
        parada_nombre = request.data.get('parada_nombre', '')
        reportado_por = request.data.get('reportado_por', 'conductor')
        usuario_id    = request.data.get('usuario_id')
        notas         = request.data.get('notas', '')

        if not salida_id or not parada_id:
            return Response({'error': 'salida_id y parada_id son requeridos.'}, status=400)

        try:
            cp, created = CheckpointParada.objects.get_or_create(
                salida_id=int(salida_id),
                parada_id=int(parada_id),
                reportado_por=reportado_por,
                defaults={
                    'parada_nombre': parada_nombre,
                    'usuario_id': usuario_id,
                    'notas': notas,
                }
            )
            if not created:
                # Ya existía — actualizar notas si se envían
                if notas:
                    cp.notas = notas
                    cp.save()

            return Response({
                'ok': True,
                'id': cp.id,
                'parada_id': parada_id,
                'reportado_por': reportado_por,
                'timestamp': cp.timestamp.isoformat(),
                'created': created,
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    def delete(self, request):
        """
        Desmarca una parada (quitar el check).
        Body: { salida_id, parada_id, reportado_por }
        """
        salida_id     = request.data.get('salida_id')
        parada_id     = request.data.get('parada_id')
        reportado_por = request.data.get('reportado_por', 'conductor')

        if not salida_id or not parada_id:
            return Response({'error': 'salida_id y parada_id son requeridos.'}, status=400)

        deleted, _ = CheckpointParada.objects.filter(
            salida_id=int(salida_id),
            parada_id=int(parada_id),
            reportado_por=reportado_por,
        ).delete()

        return Response({'ok': True, 'deleted': deleted > 0})

    def get(self, request):
        """
        Lista todos los checkpoints de una salida.
        Query: ?salida_id=X
        """
        salida_id = request.query_params.get('salida_id')
        if not salida_id:
            return Response({'error': 'salida_id requerido.'}, status=400)

        checkpoints = CheckpointParada.objects.filter(salida_id=int(salida_id))
        data = [{
            'id':           cp.id,
            'parada_id':    cp.parada_id,
            'parada_nombre':cp.parada_nombre,
            'reportado_por':cp.reportado_por,
            'usuario_id':   cp.usuario_id,
            'notas':        cp.notas,
            'timestamp':    cp.timestamp.isoformat(),
        } for cp in checkpoints]
        return Response(data)
