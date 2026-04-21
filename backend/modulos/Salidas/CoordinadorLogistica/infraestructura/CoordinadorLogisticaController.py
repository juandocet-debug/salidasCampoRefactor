from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ..aplicacion.ListarSalidasAprobadasUseCase import ListarSalidasAprobadasUseCase
from .DjangoLogisticaRepository import DjangoLogisticaRepository

class PendientesLogisticaController(APIView):
    """
    Endpoint: GET /api/logistica/pendientes/
    Retorna a la interfaz del Coordinador Logístico las salidas que están 
    listas para asignación de buses.
    """
    def get(self, request):
        try:
            # 1. Instanciamos dependencias (Inyección de dependencias manual por ahora)
            # En inyecciones complejas usaríamos un contenedor tiple Injector.
            repositorio = DjangoLogisticaRepository()
            caso_uso = ListarSalidasAprobadasUseCase(repositorio)
            
            # 2. Ejecutar caso de uso (Totalmente agnóstico de que esto es web)
            datos_respuesta = caso_uso.ejecutar()
            
            # 3. Responder en JSON
            return Response(datos_respuesta, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": "Fallo al obtener salidas logísticas", "detalle": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

from ..aplicacion.OperacionesLogisticaUseCases import AsignarVehiculoUseCase, RegistrarNovedadUseCase, RegistrarCierreOperativoUseCase
from ..dominio.ValueObjectsLogistica import AsignacionVehiculoDTO, NovedadOperativaDTO, CierreOperativoDTO, TipoTransporte, NivelNovedad

class AsignarTransporteController(APIView):
    def post(self, request):
        try:
            dto = AsignacionVehiculoDTO(
                salida_id=request.data.get('salida_id'),
                tipo_transporte=TipoTransporte(request.data.get('tipo_transporte')),
                placa_o_empresa=request.data.get('placa_o_empresa'),
                conductor_o_contacto=request.data.get('conductor_o_contacto'),
                costo_proyectado=float(request.data.get('costo_proyectado', 0))
            )
            exito = AsignarVehiculoUseCase(DjangoLogisticaRepository()).ejecutar(dto)
            return Response({"success": exito, "mensaje": "Vehículo Asignado"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class MonitorNovedadesController(APIView):
    def post(self, request):
        try:
            dto = NovedadOperativaDTO(
                salida_id=request.data.get('salida_id'),
                nivel=NivelNovedad(request.data.get('nivel')),
                mensaje=request.data.get('mensaje')
            )
            exito = RegistrarNovedadUseCase(DjangoLogisticaRepository()).ejecutar(dto)
            return Response({"success": exito, "mensaje": "Novedad Registrada"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CerrarOperacionController(APIView):
    def post(self, request):
        try:
            dto = CierreOperativoDTO(
                salida_id=request.data.get('salida_id'),
                km_final=int(request.data.get('km_final', 0)),
                checklist_limpieza=bool(request.data.get('checklist_limpieza', False)),
                checklist_llantas=bool(request.data.get('checklist_llantas', False)),
                checklist_luces=bool(request.data.get('checklist_luces', False)),
                observaciones=request.data.get('observaciones', '')
            )
            exito = RegistrarCierreOperativoUseCase(DjangoLogisticaRepository()).ejecutar(dto)
            return Response({"success": exito, "mensaje": "Cierre Logístico Completado"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

