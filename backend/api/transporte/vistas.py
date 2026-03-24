# CAPA: API (Controladores funcionales)
# QUÉ HACE: Expone los endpoints de vehículos mediante ViewSets abstraídos del ORM
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from aplicacion.transporte.inyeccion import inyectar_repositorio
from aplicacion.transporte.listar import ListarVehiculosCasoUso
from aplicacion.transporte.crear import CrearVehiculoCasoUso
from aplicacion.transporte.actualizar import ActualizarVehiculoCasoUso
from aplicacion.transporte.eliminar import EliminarVehiculoCasoUso
from dominio.transporte.entidad import Vehiculo
from dominio.transporte.valor_objetos import TipoVehiculo, TipoCombustible, Propietario, EstadoVehiculo


class VehiculoViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        repo = inyectar_repositorio()
        caso_uso = ListarVehiculosCasoUso(repo)
        vehiculos = caso_uso.ejecutar()
        
        datos = []
        for v in vehiculos:
            url_img = request.build_absolute_uri(v.foto_url) if v.foto_url else ''
            print(f"[Flota] foto_url raw: '{v.foto_url}' -> absolute: '{url_img}'")  # DEBUG
            
            datos.append({
                'id': v.id,
                'placa': v.placa,
                'tipo': v.tipo.value,
                'marca': v.marca,
                'modelo': v.modelo,
                'anio': v.anio,
                'color': v.color,
                'numero_interno': v.numero_interno,
                'capacidad': v.capacidad,
                'rendimiento_kmgal': v.rendimiento_kmgal,
                'tipo_combustible': v.tipo_combustible.value,
                'propietario': v.propietario.value,
                'estado_tecnico': v.estado_tecnico.value,
                'foto_url': url_img,
                'notas': v.notas,
            })
        return Response(datos, status=status.HTTP_200_OK)

    def create(self, request):
        repo = inyectar_repositorio()
        caso_uso = CrearVehiculoCasoUso(repo)
        d = request.data
        foto = request.FILES.get('foto_vehiculo')

        vehiculo = Vehiculo(
            placa=d.get('placa', ''),
            tipo=TipoVehiculo(d.get('tipo', 'bus')),
            marca=d.get('marca', ''),
            modelo=d.get('modelo', ''),
            anio=int(d.get('anio', 2020) or 2020),
            color=d.get('color', ''),
            numero_interno=d.get('numero_interno', ''),
            capacidad=int(d.get('capacidad', 40) or 40),
            rendimiento_kmgal=float(d.get('rendimiento_kmgal', 8.0) or 8.0),
            tipo_combustible=TipoCombustible(d.get('tipo_combustible', 'diesel')),
            propietario=Propietario(d.get('propietario', 'institucional')),
            estado_tecnico=EstadoVehiculo(d.get('estado_tecnico', 'disponible')),
            foto_url='',
            notas=d.get('notas', ''),
        )

        try:
            creado = caso_uso.ejecutar(vehiculo, foto=foto)
            url_img = request.build_absolute_uri(creado.foto_url) if creado.foto_url else ''
            return Response({
                'id': creado.id, 'placa': creado.placa, 'tipo': creado.tipo.value,
                'marca': creado.marca, 'modelo': creado.modelo, 'capacidad': creado.capacidad,
                'rendimiento_kmgal': creado.rendimiento_kmgal, 'estado_tecnico': creado.estado_tecnico.value,
                'propietario': creado.propietario.value, 'tipo_combustible': creado.tipo_combustible.value,
                'foto_url': url_img
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        repo = inyectar_repositorio()
        caso_uso = ActualizarVehiculoCasoUso(repo)
        d = request.data
        foto = request.FILES.get('foto_vehiculo')  # None si no se subió archivo nuevo

        vehiculo = Vehiculo(
            id=pk,
            placa=d.get('placa', ''),
            tipo=TipoVehiculo(d.get('tipo', 'bus')),
            marca=d.get('marca', ''),
            modelo=d.get('modelo', ''),
            anio=int(d.get('anio', 2020) or 2020),
            color=d.get('color', ''),
            numero_interno=d.get('numero_interno', ''),
            capacidad=int(d.get('capacidad', 40) or 40),
            rendimiento_kmgal=float(d.get('rendimiento_kmgal', 8.0) or 8.0),
            tipo_combustible=TipoCombustible(d.get('tipo_combustible', 'diesel')),
            propietario=Propietario(d.get('propietario', 'institucional')),
            estado_tecnico=EstadoVehiculo(d.get('estado_tecnico', 'disponible')),
            foto_url='',
            notas=d.get('notas', ''),
        )

        try:
            actualizado = caso_uso.ejecutar(vehiculo, foto=foto)
            url_img = request.build_absolute_uri(actualizado.foto_url) if actualizado.foto_url else ''
            return Response({
                'id': actualizado.id, 'placa': actualizado.placa, 'tipo': actualizado.tipo.value,
                'marca': actualizado.marca, 'modelo': actualizado.modelo, 'capacidad': actualizado.capacidad,
                'rendimiento_kmgal': actualizado.rendimiento_kmgal, 'estado_tecnico': actualizado.estado_tecnico.value,
                'propietario': actualizado.propietario.value, 'tipo_combustible': actualizado.tipo_combustible.value,
                'foto_url': url_img
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        repo = inyectar_repositorio()
        caso_uso = EliminarVehiculoCasoUso(repo)
        try:
            caso_uso.ejecutar(pk)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
