# api/admin_sistema/vistas_herramientas.py
# ─────────────────────────────────────────────────────────────────────────────
# BFF Admin Sistema: Herramientas de configuración del sistema.
# API REST (Adaptador Primario) — Lógica de negocio extraída a aplicacion/
# ─────────────────────────────────────────────────────────────────────────────
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from aplicaciones.nucleo.recalcular_costos import recalcular_costos_salidas
from aplicaciones.parametros.serializadores import (
    ParametrosSerializador, FacultadSerializador, ProgramaSerializador, VentanaSerializador
)

from aplicacion.parametros.gestionar_parametros import ActualizarParametrosCasoUso
from aplicacion.parametros.gestionar_facultades import CrearFacultadCasoUso, ActualizarFacultadCasoUso, EliminarFacultadCasoUso
from aplicacion.parametros.gestionar_programas import CrearProgramaCasoUso, ActualizarProgramaCasoUso, EliminarProgramaCasoUso
from aplicacion.parametros.gestionar_ventanas import CrearVentanaCasoUso, ActualizarVentanaCasoUso, EliminarVentanaCasoUso

from infraestructura.parametros.repositorio_django import (
    ParametrosRepositorioDjango, FacultadRepositorioDjango, ProgramaRepositorioDjango, VentanaRepositorioDjango
)

# ── Parámetros del Sistema (singleton) ───────────────────────────────────────

class AdminParametrosVista(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        params = ParametrosRepositorioDjango().obtener()
        return Response({'ok': True, 'datos': ParametrosSerializador(params).data})

    def put(self, request):
        repo = ParametrosRepositorioDjango()
        caso_uso = ActualizarParametrosCasoUso(repo, recalcular_costos_salidas)
        try:
            params, actualizadas = caso_uso.ejecutar(request.data, request.user)
            return Response({
                'ok': True,
                'datos': ParametrosSerializador(params).data,
                'salidas_actualizadas': actualizadas,
            })
        except Exception as e:
            return Response({'ok': False, 'error': str(e)}, status=400)

# ── Facultades (CRUD) ────────────────────────────────────────────────────────

class AdminFacultadesVista(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        facultades = FacultadRepositorioDjango().listar_todas()
        return Response(FacultadSerializador(facultades, many=True).data)

    def post(self, request):
        ser = FacultadSerializador(data=request.data)
        if ser.is_valid():
            caso_uso = CrearFacultadCasoUso(FacultadRepositorioDjango())
            facultad = caso_uso.ejecutar(ser.validated_data)
            return Response(FacultadSerializador(facultad).data, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminFacultadDetalleVista(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        facultad = FacultadRepositorioDjango().obtener_por_id(pk)
        if not facultad: return Response(status=404)
        return Response(FacultadSerializador(facultad).data)

    def put(self, request, pk):
        return self.patch(request, pk)

    def patch(self, request, pk):
        ser = FacultadSerializador(data=request.data, partial=True)
        if ser.is_valid():
            try:
                caso_uso = ActualizarFacultadCasoUso(FacultadRepositorioDjango())
                fac = caso_uso.ejecutar(pk, ser.validated_data)
                return Response(FacultadSerializador(fac).data)
            except ValueError:
                return Response(status=404)
        return Response(ser.errors, status=400)

    def delete(self, request, pk):
        EliminarFacultadCasoUso(FacultadRepositorioDjango()).ejecutar(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

# ── Programas (CRUD) ─────────────────────────────────────────────────────────

class AdminProgramasVista(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        fac_id = request.query_params.get('facultad')
        programas = ProgramaRepositorioDjango().listar(facultad_id=fac_id)
        return Response(ProgramaSerializador(programas, many=True).data)

    def post(self, request):
        ser = ProgramaSerializador(data=request.data)
        if ser.is_valid():
            caso_uso = CrearProgramaCasoUso(ProgramaRepositorioDjango())
            prog = caso_uso.ejecutar(ser.validated_data)
            return Response(ProgramaSerializador(prog).data, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminProgramaDetalleVista(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        prog = ProgramaRepositorioDjango().obtener_por_id(pk)
        if not prog: return Response(status=404)
        return Response(ProgramaSerializador(prog).data)

    def put(self, request, pk): return self.patch(request, pk)

    def patch(self, request, pk):
        ser = ProgramaSerializador(data=request.data, partial=True)
        if ser.is_valid():
            try:
                caso_uso = ActualizarProgramaCasoUso(ProgramaRepositorioDjango())
                prog = caso_uso.ejecutar(pk, ser.validated_data)
                return Response(ProgramaSerializador(prog).data)
            except ValueError:
                return Response(status=404)
        return Response(ser.errors, status=400)

    def delete(self, request, pk):
        EliminarProgramaCasoUso(ProgramaRepositorioDjango()).ejecutar(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

# ── Ventanas de Programación (CRUD) ──────────────────────────────────────────

class AdminVentanasVista(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ventanas = VentanaRepositorioDjango().listar_todas()
        return Response(VentanaSerializador(ventanas, many=True).data)

    def post(self, request):
        ser = VentanaSerializador(data=request.data)
        if ser.is_valid():
            caso_uso = CrearVentanaCasoUso(VentanaRepositorioDjango())
            ven = caso_uso.ejecutar(ser.validated_data)
            return Response(VentanaSerializador(ven).data, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminVentanaDetalleVista(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        ven = VentanaRepositorioDjango().obtener_por_id(pk)
        if not ven: return Response(status=404)
        return Response(VentanaSerializador(ven).data)

    def put(self, request, pk): return self.patch(request, pk)

    def patch(self, request, pk):
        ser = VentanaSerializador(data=request.data, partial=True)
        if ser.is_valid():
            try:
                caso_uso = ActualizarVentanaCasoUso(VentanaRepositorioDjango())
                ven = caso_uso.ejecutar(pk, ser.validated_data)
                return Response(VentanaSerializador(ven).data)
            except ValueError:
                return Response(status=404)
        return Response(ser.errors, status=400)

    def delete(self, request, pk):
        EliminarVentanaCasoUso(VentanaRepositorioDjango()).ejecutar(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

# ── Catálogos públicos (sin autenticación) ───────────────────────────────────

class CatalogosPublicosVista(APIView):
    permission_classes = []

    def get(self, request):
        facs = FacultadRepositorioDjango().listar_activas()
        progs = ProgramaRepositorioDjango().listar_activos()
        vens = VentanaRepositorioDjango().listar_activas()
        return Response({
            'ok': True,
            'datos': {
                'facultades': FacultadSerializador(facs, many=True).data,
                'programas':  ProgramaSerializador(progs, many=True).data,
                'ventanas':   VentanaSerializador(vens, many=True).data,
            }
        })
