# infraestructura/abordaje/vistas.py
# ─────────────────────────────────────────────────────────────────────────────
# ADAPTADOR DE ENTRADA HTTP — Vistas DRF del slice Abordaje
# ─────────────────────────────────────────────────────────────────────────────

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from dominio.abordaje.excepciones import (
    AbordajeNoEncontrado, CodigoInvalido,
    EstudianteYaAbordado, FotoRequeridaParaCodigo,
)
from dominio.abordaje.valor_objetos import RolVerificador
from aplicacion.abordaje.casos_uso.confirmar_abordaje import (
    ActivarCodigoCasoUso, ActivarCodigoComando,
    ConfirmarAbordajeCasoUso, ConfirmarAbordajeComando,
    ObtenerListaAbordajeCasoUso,
)
from .repositorio_django import AbordajeRepositorioDjango


def _repo():
    return AbordajeRepositorioDjango()


class ActivarCodigoVista(APIView):
    """
    POST /api/estudiante/salidas/{salida_id}/activar-codigo/
    Body: { "foto_url": "https://..." }
    El estudiante genera su código de 6 caracteres para el día de la salida.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, salida_id: int):
        cmd = ActivarCodigoComando(
            salida_id=     salida_id,
            estudiante_id= request.user.id,
            foto_url=      request.data.get('foto_url', ''),
        )
        try:
            registro = ActivarCodigoCasoUso(_repo()).ejecutar(cmd)
            return Response({'codigo': registro.codigo, 'expira_en': registro.codigo_expira_en})
        except FotoRequeridaParaCodigo as e:
            return Response({'error': str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except AbordajeNoEncontrado as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)


class ConfirmarAbordajeVista(APIView):
    """
    POST /api/conductor/salidas/{salida_id}/confirmar-abordaje/
    POST /api/profesor/salidas/{salida_id}/confirmar-abordaje/
    Body: { "codigo": "A1B2C3" }
    Conductor o Profesor verifican el código del estudiante.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, salida_id: int):
        # El rol del usuario determina quién verificó
        rol_str = getattr(request.user, 'rol', '')
        try:
            rol = RolVerificador('conductor' if 'conductor' in rol_str else 'profesor')
        except ValueError:
            rol = RolVerificador.PROFESOR

        cmd = ConfirmarAbordajeComando(
            salida_id=      salida_id,
            codigo=         request.data.get('codigo', '').upper(),
            verificador_id= request.user.id,
            rol_verificador=rol,
        )
        try:
            registro = ConfirmarAbordajeCasoUso(_repo()).ejecutar(cmd)
            return Response({
                'abordado':       registro.abordado,
                'estudiante_id':  registro.estudiante_id,
                'verificado_en':  registro.verificado_en,
            })
        except (CodigoInvalido, EstudianteYaAbordado) as e:
            return Response({'error': str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except AbordajeNoEncontrado as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)


class ListaAbordajeVista(APIView):
    """
    GET /api/coordinador/salidas/{salida_id}/abordaje/
    Retorna la lista completa de abordaje con estadísticas.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, salida_id: int):
        resultado = ObtenerListaAbordajeCasoUso(_repo()).ejecutar(salida_id)
        return Response({
            'total':      resultado['total'],
            'abordados':  resultado['abordados'],
            'pendientes': resultado['pendientes'],
            'porcentaje': round(resultado['abordados'] / resultado['total'] * 100, 1)
                          if resultado['total'] > 0 else 0,
        })
