# CAPA: API — BFF Profesor
# QUÉ HACE: Vistas HTTP para el módulo de salidas del profesor
# NO DEBE CONTENER: lógica de negocio, ORM, queries a BD

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from dominio.salidas.excepciones import (
    SalidaNoEncontrada,
    SalidaSinPermiso,
    TransicionNoPermitida,
)
from dominio.salidas.entidad import Salida
from aplicacion.salidas.inyeccion import (
    proveer_listar_salidas,
    proveer_crear_salida,
    proveer_obtener_salida,
    proveer_actualizar_salida,
    proveer_eliminar_salida,
    proveer_enviar_salida,
    proveer_calcular_costo,
)
from api.profesor.salidas.serializers import (
    SalidaSerializer,
    CrearSalidaInputSerializer,
    ActualizarSalidaInputSerializer,
)
# ── GET | POST  /api/profesor/salidas/ ────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def salidas_list(request):
    if request.method == 'GET':
        caso_uso = proveer_listar_salidas()
        salidas = caso_uso.ejecutar(profesor_id=request.user.id)
        serializer = SalidaSerializer(salidas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        input_serializer = CrearSalidaInputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)

        salida = Salida(
            profesor_id=request.user.id,
            **input_serializer.validated_data,
        )

        caso_uso = proveer_crear_salida()
        salida_creada = caso_uso.ejecutar(salida)

        serializer = SalidaSerializer(salida_creada)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ── GET | PUT | DELETE  /api/profesor/salidas/<id>/ ───────────────────────

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def salida_detail(request, salida_id):
    try:
        if request.method == 'GET':
            caso_uso = proveer_obtener_salida()
            salida = caso_uso.ejecutar(salida_id=salida_id, profesor_id=request.user.id)
            serializer = SalidaSerializer(salida)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.method in ['PUT', 'PATCH']:
            input_serializer = ActualizarSalidaInputSerializer(data=request.data)
            input_serializer.is_valid(raise_exception=True)

            caso_uso = proveer_actualizar_salida()
            resultado = caso_uso.ejecutar(
                salida_id=salida_id,
                profesor_id=request.user.id,
                datos=input_serializer.validated_data,
            )
            serializer = SalidaSerializer(resultado)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.method == 'DELETE':
            caso_uso = proveer_eliminar_salida()
            caso_uso.ejecutar(salida_id=salida_id, profesor_id=request.user.id)
            return Response(status=status.HTTP_204_NO_CONTENT)

    except SalidaNoEncontrada as e:
        return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except SalidaSinPermiso as e:
        return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        import traceback; traceback.print_exc()
        return Response({'error': f'Error inesperado: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ── POST  /api/profesor/salidas/<id>/enviar/ ──────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enviar_salida(request, salida_id):
    try:
        caso_uso = proveer_enviar_salida()
        salida = caso_uso.ejecutar(salida_id=salida_id, profesor_id=request.user.id)
        serializer = SalidaSerializer(salida)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except SalidaNoEncontrada as e:
        return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except SalidaSinPermiso as e:
        return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)
    except TransicionNoPermitida as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ── POST  /api/profesor/salidas/<id>/calcular-costo/ ───────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def calcular_costo(request, salida_id):
    try:
        caso_uso = proveer_calcular_costo()
        resultado = caso_uso.ejecutar(
            salida_id=salida_id,
            profesor_id=request.user.id,
        )
        return Response({
            'total':       resultado.total,
            'combustible': resultado.combustible,
            'viaticos':    resultado.viaticos,
            'he_manana':   resultado.he_manana,
            'he_tarde':    resultado.he_tarde,
            'he_noche':    resultado.he_noche,
        }, status=status.HTTP_200_OK)
    except SalidaNoEncontrada as e:
        return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except SalidaSinPermiso as e:
        return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

