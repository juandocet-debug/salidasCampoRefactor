# api/profesor/vistas_salidas.py
# ─────────────────────────────────────────────────────────────────────────────
# BFF Profesor: vistas específicas para el rol de Profesor.
# Thin views que delegan toda lógica a los Casos de Uso.
# ─────────────────────────────────────────────────────────────────────────────
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from aplicaciones.nucleo.permisos import EsProfesor
from aplicaciones.salidas.serializadores import (
    SalidaListaSerializador,
    SalidaDetalleSerializador,
    CrearSalidaSerializador,
)

from aplicacion.salidas.casos_uso.gestionar_salidas_profesor import (
    ListarSalidasProfesorCasoUso,
    CrearSalidaCasoUso,
    ObtenerSalidaCasoUso,
    ActualizarSalidaCasoUso,
    EliminarSalidaCasoUso,
)
from aplicacion.salidas.enviar_salida import EnviarSolicitudCasoUso, EnviarSolicitudComando
from infraestructura.salidas.repositorio_django import SalidaRepositorioDjango
from dominio.salidas.excepciones import SalidaNoEncontrada, TransicionNoPermitida, SalidaSinPermiso

class ProfesorListaSalidasVista(APIView):
    """
    GET  /api/profesor/salidas/  → lista filtrada por rol de profesor
    POST /api/profesor/salidas/  → crear borrador (solo profesor)
    """
    permission_classes = [EsProfesor]

    def get(self, request):
        caso_uso = ListarSalidasProfesorCasoUso(SalidaRepositorioDjango())
        salidas = caso_uso.ejecutar(profesor_id=request.user.id)
        return Response(SalidaListaSerializador(salidas, many=True).data)

    def post(self, request):
        ser = CrearSalidaSerializador(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=400)
            
        caso_uso = CrearSalidaCasoUso(SalidaRepositorioDjango())
        salida = caso_uso.ejecutar(datos=ser.validated_data, profesor_id=request.user.id)
        return Response(SalidaDetalleSerializador(salida).data, status=201)


class ProfesorDetalleSalidaVista(APIView):
    """
    GET    /api/profesor/salidas/:id/  → detalle completo
    PATCH  /api/profesor/salidas/:id/  → editar campos (solo profesor dueño, solo borrador)
    DELETE /api/profesor/salidas/:id/  → eliminar permanente (solo profesor dueño, solo borrador)
    """
    permission_classes = [EsProfesor]

    def get(self, request, pk):
        caso_uso = ObtenerSalidaCasoUso(SalidaRepositorioDjango())
        try:
            salida = caso_uso.ejecutar(salida_id=pk, profesor_id=request.user.id)
            return Response(SalidaDetalleSerializador(salida).data)
        except SalidaNoEncontrada:
            return Response({'error': 'Salida no encontrada'}, status=404)

    def put(self, request, pk):
        return self.patch(request, pk)

    def patch(self, request, pk):
        ser = CrearSalidaSerializador(data=request.data, partial=True)
        if not ser.is_valid():
            return Response(ser.errors, status=400)
            
        caso_uso = ActualizarSalidaCasoUso(SalidaRepositorioDjango())
        try:
            salida = caso_uso.ejecutar(salida_id=pk, profesor_id=request.user.id, datos=ser.validated_data)
            return Response(SalidaDetalleSerializador(salida).data)
        except SalidaNoEncontrada:
            return Response({'error': 'Salida no encontrada'}, status=404)
        except TransicionNoPermitida as e:
            return Response({'error': str(e)}, status=400)

    def delete(self, request, pk):
        caso_uso = EliminarSalidaCasoUso(SalidaRepositorioDjango())
        try:
            caso_uso.ejecutar(salida_id=pk, profesor_id=request.user.id)
            return Response(status=204)
        except SalidaNoEncontrada:
            return Response({'error': 'Salida no encontrada'}, status=404)
        except TransicionNoPermitida as e:
            return Response({'error': str(e)}, status=400)


class ProfesorEnviarSalidaVista(APIView):
    """
    POST /api/profesor/salidas/:id/enviar/
    Cambia el estado de 'borrador' a 'enviada'.
    """
    permission_classes = [EsProfesor]

    def post(self, request, pk):
        comando = EnviarSolicitudComando(
            salida_id=pk,
            solicitante_id=request.user.id
        )
        repo = SalidaRepositorioDjango()
        caso_uso = EnviarSolicitudCasoUso(repo)
        
        try:
            salida_dom = caso_uso.ejecutar(comando)
            return Response({'ok': True, 'datos': {'estado': salida_dom.estado.value if hasattr(salida_dom.estado, 'value') else salida_dom.estado}})
        except SalidaNoEncontrada:
            return Response({'ok': False, 'error': 'Salida no encontrada'}, status=404)
        except (TransicionNoPermitida, SalidaSinPermiso) as e:
            return Response({'ok': False, 'error': str(e)}, status=400)
