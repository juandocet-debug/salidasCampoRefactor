from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from modulos.Logistica.Vehiculo.infraestructura.DjangoVehiculoIAAdapter import DjangoVehiculoIAAdapter
from modulos.Logistica.Vehiculo.aplicacion.VehiculoIAConsultar.VehiculoIAConsultar import VehiculoIAConsultar

class VehiculoIAController(APIView):
    """
    Controlador (REST) para manejar consultas web al Asistente IA de Vehículos.
    Recibe un POST con { "consulta": "..." } y retorna la respuesta de la IA.
    """
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Inyección de Dependencias
        self.ia_port = DjangoVehiculoIAAdapter()
        self.consultar_ia = VehiculoIAConsultar(self.ia_port)

    def post(self, request):
        consulta = request.data.get('consulta', '').strip()
        
        if not consulta:
            return Response({'error': 'Se requiere una consulta JSON'}, status=status.HTTP_400_BAD_REQUEST)

        respuesta = self.consultar_ia.ejecutar(consulta)
        
        if respuesta:
            return Response({'ok': True, 'respuesta': respuesta.strip()}, status=status.HTTP_200_OK)
        else:
            return Response({'ok': False, 'error': 'IA no pudo procesar la solicitud o claves no configuradas'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
