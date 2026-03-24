# CAPA: API — BFF Admin Sistema
# QUÉ HACE: Endpoint público de catálogos (facultades, programas, ventanas)
# NO DEBE CONTENER: lógica de negocio, ORM directo

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from aplicacion.parametros.inyeccion import proveer_obtener_catalogos


@api_view(['GET'])
@permission_classes([AllowAny])
def catalogos_publicos(request):
    caso_uso = proveer_obtener_catalogos()
    datos = caso_uso.ejecutar()
    
    facultades = datos['facultades']
    programas = datos['programas']
    ventanas = datos['ventanas']

    return Response({
        'ok': True,
        'datos': {
            'facultades': [{'id': f.id, 'nombre': f.nombre, 'activa': getattr(f, 'activa', True)} for f in facultades],
            'programas':  [{'id': p.id, 'nombre': p.nombre, 'facultad_id': p.facultad_id, 'activo': getattr(p, 'activo', True)} for p in programas],
            'ventanas':   [{'id': v.id, 'nombre': v.nombre, 'fecha_apertura': v.fecha_apertura, 'fecha_cierre': v.fecha_cierre} for v in ventanas],
        }
    }, status=status.HTTP_200_OK)
