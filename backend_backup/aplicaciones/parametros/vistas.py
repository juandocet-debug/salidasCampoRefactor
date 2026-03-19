# aplicaciones/parametros/vistas.py
# ─────────────────────────────────────────────────────────────────────────────
# VISTAS DE PARÁMETROS Y CALCULADORA DE COSTO
# ─────────────────────────────────────────────────────────────────────────────

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from aplicaciones.nucleo.permisos import EsCoordinadorSalidas
from aplicaciones.nucleo.calcular_costo import calcular_costo_salida
from .modelos import ParametrosSistema
from .serializadores import ParametrosSerializador, CalcularCostoSerializador


class ParametrosVista(APIView):
    """
    GET /api/parametros/  → Lee los parámetros actuales (cualquier usuario autenticado)
    PUT /api/parametros/  → Actualiza los parámetros (solo Coordinador de Salidas)
    """

    def get_permissions(self):
        if self.request.method == 'PUT':
            return [EsCoordinadorSalidas()]
        return []  # GET: cualquier usuario autenticado

    def get(self, request):
        params       = ParametrosSistema.obtener()
        serializador = ParametrosSerializador(params)
        return Response({'ok': True, 'datos': serializador.data})

    def put(self, request):
        params       = ParametrosSistema.obtener()
        serializador = ParametrosSerializador(params, data=request.data, partial=True)

        if not serializador.is_valid():
            return Response({'ok': False, 'error': serializador.errors}, status=400)

        # Registrar quién hizo el cambio
        serializador.save(actualizado_por=request.user)

        return Response({'ok': True, 'datos': serializador.data})


class CalcularCostoVista(APIView):
    """
    POST /api/parametros/calcular/
    Recibe { distancia_km, duracion_dias, horas_totales }
    Devuelve el desglose de costo usando los parámetros actuales del sistema.
    """

    def post(self, request):
        serializador = CalcularCostoSerializador(data=request.data)

        if not serializador.is_valid():
            return Response({'ok': False, 'error': serializador.errors}, status=400)

        datos  = serializador.validated_data
        params = ParametrosSistema.obtener()

        resultado = calcular_costo_salida(
            distancia_km     = datos['distancia_km'],
            duracion_dias    = datos['duracion_dias'],
            horas_totales    = datos['horas_totales'],
            precio_galon     = params.precio_galon,
            rendimiento      = params.rendimiento,
            costo_noche      = params.costo_noche,
            costo_hora_extra = params.costo_hora_extra,
            costo_hora_extra_2 = params.costo_hora_extra_2,
            max_horas_viaje  = params.max_horas_viaje,
            horas_buffer     = params.horas_buffer,
        )

        return Response({
            'ok': True,
            'datos': {
                'total':                resultado.total,
                'combustible':          resultado.combustible,
                'viaticos_conductor':   resultado.viaticos_conductor,
                'horas_extra_total':    resultado.horas_extra_total,
                'horas_extra_1_costo':  resultado.horas_extra_1_costo,
                'horas_extra_2_costo':  resultado.horas_extra_2_costo,
                'viaticos_cantidad':    resultado.viaticos_cantidad,
                'horas_extra_1_cantidad': resultado.horas_extra_1_cantidad,
                'horas_extra_2_cantidad': resultado.horas_extra_2_cantidad,
                # Legacy aliases
                'hospedaje':            resultado.hospedaje,
                'horas_extra':          resultado.horas_extra,
                'noches':               resultado.noches,
                'horas_extra_cantidad': resultado.horas_extra_cantidad,
                'parametros_usados': {
                    'precio_galon':       params.precio_galon,
                    'rendimiento':        params.rendimiento,
                    'costo_noche':        params.costo_noche,
                    'costo_hora_extra':   params.costo_hora_extra,
                    'costo_hora_extra_2': params.costo_hora_extra_2,
                }
            }
        })
