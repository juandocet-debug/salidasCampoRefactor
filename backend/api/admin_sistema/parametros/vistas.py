# CAPA: API — BFF Admin Sistema
# QUÉ HACE: Endpoint para obtener parámetros del sistema
# NO DEBE CONTENER: lógica de negocio, ORM directo

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from aplicacion.parametros.inyeccion import proveer_obtener_parametros

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_parametros(request):
    caso_uso = proveer_obtener_parametros()
    parametros = caso_uso.ejecutar()
    return Response({
        'ok': True,
        'datos': {
            'precio_galon':          parametros.precio_galon,
            'rendimiento_bus':       parametros.rendimiento_bus,
            'rendimiento_buseta':    parametros.rendimiento_buseta,
            'rendimiento_camioneta': parametros.rendimiento_camioneta,
            'costo_noche':           parametros.costo_noche,
            'costo_hora_extra':      parametros.costo_hora_extra,
            'costo_hora_extra_2':    parametros.costo_hora_extra_2,
            'max_horas_viaje':       parametros.max_horas_viaje,
            'horas_buffer':          parametros.horas_buffer,
        }
    }, status=status.HTTP_200_OK)
