import traceback
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from modulos.Salidas.Core.infraestructura.DjangoSalidaRepository import DjangoSalidaRepository
from modulos.Salidas.Core.aplicacion.SalidaCreate.SalidaCreate import SalidaCreate
from modulos.Salidas.Core.aplicacion.SalidaEdit.SalidaEdit import SalidaEdit
from modulos.Salidas.Core.aplicacion.SalidaDelete.SalidaDelete import SalidaDelete
from modulos.Salidas.Core.aplicacion.SalidaGetAll.SalidaGetAll import SalidaGetAll

from modulos.Salidas.Itinerario.infraestructura.DjangoItinerarioRepository import DjangoItinerarioRepository
from modulos.Salidas.Itinerario.aplicacion.ItinerarioCreate.ItinerarioCreate import ItinerarioCreate

# Nuevo Módulo Hexagonal Parada
from modulos.Salidas.Itinerario.Parada.infraestructura.DjangoParadaRepository import DjangoParadaRepository
from modulos.Salidas.Itinerario.Parada.aplicacion.ParadaCreate.ParadaCreate import ParadaCreate

# Catálogos para resolver nombre↔ID
from modulos.Catalogos.Facultad.infraestructura.models import FacultadModel
from modulos.Catalogos.Programa.infraestructura.models import ProgramaModel


def _resolver_facultad_programa_a_ids(data: dict) -> dict:
    """Recibe el payload del frontend (con 'facultad' y 'programa' como nombres)
    y los convierte a 'facultad_id' y 'programa_id' (enteros) para el dominio."""
    data = dict(data)  # copia mutable
    facultad_nombre = data.get('facultad') or data.get('facultad_id')
    programa_nombre = data.get('programa') or data.get('programa_id')

    # Resolver facultad (nombre → id)
    if facultad_nombre and not str(facultad_nombre).isdigit():
        fac = FacultadModel.objects.filter(nombre=facultad_nombre).first()
        data['facultad_id'] = fac.id if fac else None
    elif facultad_nombre:
        data['facultad_id'] = int(facultad_nombre)

    # Resolver programa (nombre → id)
    if programa_nombre and not str(programa_nombre).isdigit():
        prog = ProgramaModel.objects.filter(nombre=programa_nombre).first()
        data['programa_id'] = prog.id if prog else None
    elif programa_nombre:
        data['programa_id'] = int(programa_nombre)

    return data


def _resolver_ids_a_nombres(facultad_id, programa_id):
    """Convierte los IDs numéricos de facultad/programa a sus nombres de texto."""
    facultad_nombre = ''
    programa_nombre = ''
    if facultad_id:
        fac = FacultadModel.objects.filter(id=facultad_id).first()
        facultad_nombre = fac.nombre if fac else ''
    if programa_id:
        prog = ProgramaModel.objects.filter(id=programa_id).first()
        programa_nombre = prog.nombre if prog else ''
    return facultad_nombre, programa_nombre

class SalidaController(APIView):
    def get(self, request, pk=None):
        repo = DjangoSalidaRepository()
        if pk:
            salida = repo.get_by_id(pk)
            if not salida:
                return Response({'error': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)
            
            # Obtener campos de UI desde la DB directamente
            from modulos.Salidas.Core.infraestructura.models import SalidaModelo
            salida_db = SalidaModelo.objects.filter(id=pk).first()
            icono_ui = salida_db.icono if salida_db else 'IcoMountain'
            color_ui = salida_db.color if salida_db else '#16a34a'

            # Obtener itinerario y paradas de la base de datos
            repo_itin = DjangoItinerarioRepository()
            itinerarios = repo_itin.get_all()
            itinerario = next((i for i in itinerarios if i.salida_id.value == int(pk)), None)
            
            puntos_ruta = []
            if itinerario:
                repo_paradas = DjangoParadaRepository()
                # Usar get_by_itinerario que filtra y ordena directamente por itinerario_id
                paradas = repo_paradas.get_by_itinerario(itinerario.id.value)
                
                for p in paradas:
                    def _val(vo):
                        return vo.value if hasattr(vo, 'value') else vo
                    puntos_ruta.append({
                        'id': _val(p.id),
                        'latitud': _val(p.latitud),
                        'longitud': _val(p.longitud),
                        'orden': _val(p.orden),
                        'nombre': _val(p.nombre),
                        'motivo': _val(p.tipo),
                        'tiempo_estimado': _val(p.tiempo_estimado) or None,
                        'actividad': _val(p.actividad) or None,
                        'es_retorno': _val(p.tipo) == 'retorno',
                        'fecha_programada': str(_val(p.fecha_programada)) if _val(p.fecha_programada) else None,
                        'hora_programada': str(_val(p.hora_programada)) if _val(p.hora_programada) else None,
                        'notas_itinerario': _val(p.notas_itinerario) or None,
                        'icono': _val(p.icono) or None,
                        'color': _val(p.color) or None,
                    })

            # Resolver IDs de facultad/programa a nombres para el frontend
            facultad_nombre, programa_nombre = _resolver_ids_a_nombres(
                salida.facultad_id.value, salida.programa_id.value
            )

            # Serializando los VOs + campos extra de pasos
            return Response({
                'id': salida.id.value,
                'codigo': salida.codigo.value,
                'nombre': salida.nombre.value,
                'asignatura': salida.asignatura.value,
                'semestre': salida.semestre.value,
                'facultad': facultad_nombre,
                'programa': programa_nombre,
                'num_estudiantes': salida.num_estudiantes.value,
                'justificacion': salida.justificacion.value,
                'estado': salida.estado.value,
                'profesor_id': salida.profesor_id.value,
                'fecha_inicio': str(salida.fecha_inicio.value) if salida.fecha_inicio.value else None,
                'fecha_fin': str(salida.fecha_fin.value) if salida.fecha_fin.value else None,
                'hora_inicio': str(salida.hora_inicio.value) if salida.hora_inicio.value else None,
                'hora_fin': str(salida.hora_fin.value) if salida.hora_fin.value else None,
                'distancia_total_km': float(salida.distancia_total_km.value or 0),
                'duracion_dias': float(salida.duracion_dias.value or 1),
                'horas_viaje': float(salida.horas_viaje.value or 0),
                'costo_estimado': float(salida.costo_estimado.value or 0),
                'vehiculos_asignados': salida.vehiculos_asignados.value,
                'puntos_ruta': puntos_ruta,
                'icono': icono_ui,
                'color': color_ui,
                # Paso 1 extra
                'resumen': salida_db.resumen or '' if salida_db else '',
                'relacion_syllabus': salida_db.relacion_syllabus or '' if salida_db else '',
                # Paso 2 - Planeación (el frontend espera data.planeacion.*)
                'planeacion': {
                    'obj_general': salida_db.objetivo_general or '' if salida_db else '',
                    'metodologia': salida_db.estrategia_metodologica or '' if salida_db else '',
                    'objetivos': [
                        {'descripcion': line}
                        for line in (salida_db.objetivos_especificos or '').splitlines()
                        if line.strip()
                    ] if salida_db else [],
                },
                # Paso 3 - Logística
                'punto_partida': salida_db.punto_partida or '' if salida_db else '',
                'parada_max': salida_db.parada_max or '' if salida_db else '',
                # Paso 4 - Evaluación
                'criterios_evaluacion': [
                    {'descripcion': line}
                    for line in (salida_db.criterios_evaluacion or '').splitlines()
                    if line.strip()
                ] if salida_db else [],
                'productos_esperados': salida_db.productos_esperados or '' if salida_db else '',
            })
        else:
            uso = SalidaGetAll(repository=repo)
            resultados = uso.run()
            
            # Fetch UI specific fields to enrich payload
            from modulos.Salidas.Core.infraestructura.models import SalidaModelo
            modelos_dict = {m.id: m for m in SalidaModelo.objects.all()}
            
            # Obtener Revisiones Pedagógicas (para feedback del Coordinador)
            from modulos.Salidas.Coordinacion.infraestructura.models import RevisionPedagogicaModel
            revisiones = RevisionPedagogicaModel.objects.all()
            revisiones_dict = {r.salida_id: r for r in revisiones}

            # Obtener Decisiones del Consejo (para distinguir quién pidió ajustes)
            from modulos.Salidas.Consejo.infraestructura.models import DecisionConsejoModel
            decisiones_consejo = DecisionConsejoModel.objects.all()
            decisiones_consejo_dict = {d.salida_id: d for d in decisiones_consejo}
            
            # Resolver usuarios y extras para mapeo
            from modulos.Usuarios.infraestructura.models import UsuarioModel
            from modulos.Catalogos.Programa.infraestructura.models import ProgramaModel
            from modulos.Catalogos.Facultad.infraestructura.models import FacultadModel
            
            usuarios_dict = {u.id: f"{u.nombre} {u.apellido}".strip() for u in UsuarioModel.objects.all()}
            programas_dict = {p.id: p.nombre for p in ProgramaModel.objects.all()}
            facultades_dict = {f.id: f.nombre for f in FacultadModel.objects.all()}

            data = [{
                'id': s.id.value, 
                'codigo': s.codigo.value, 
                'nombre': s.nombre.value, 
                'estado': s.estado.value,
                'asignatura': getattr(s.asignatura, 'value', s.asignatura),
                'fecha_inicio': getattr(s.fecha_inicio, 'value', s.fecha_inicio),
                'fecha_fin': getattr(s.fecha_fin, 'value', s.fecha_fin),
                'hora_inicio': getattr(s.hora_inicio, 'value', s.hora_inicio),
                'hora_fin': getattr(s.hora_fin, 'value', s.hora_fin),
                'icono': modelos_dict[s.id.value].icono if s.id.value in modelos_dict and modelos_dict[s.id.value].icono else 'IcoMountain',
                'color': modelos_dict[s.id.value].color if s.id.value in modelos_dict and modelos_dict[s.id.value].color else '#16a34a',
                'num_estudiantes': getattr(s.num_estudiantes, 'value', s.num_estudiantes) or 0,
                'punto_partida': modelos_dict[s.id.value].punto_partida or '' if s.id.value in modelos_dict else '',
                'parada_max': modelos_dict[s.id.value].parada_max or '' if s.id.value in modelos_dict else '',
                'destino': modelos_dict[s.id.value].parada_max or '' if s.id.value in modelos_dict else '',
                'costo_estimado': float(modelos_dict[s.id.value].costo_estimado or 0) if s.id.value in modelos_dict else 0,
                'resumen': modelos_dict[s.id.value].resumen or '' if s.id.value in modelos_dict else '',
                'profesor_nombre': usuarios_dict.get(s.profesor_id.value, 'Docente'),
                'profesor_id': s.profesor_id.value,
                'programa_id': s.programa_id.value,
                'programa': programas_dict.get(s.programa_id.value, ''),
                'facultad': facultades_dict.get(s.facultad_id.value, ''),
                'justificacion': modelos_dict[s.id.value].justificacion if s.id.value in modelos_dict else '',
                'objetivo_general': modelos_dict[s.id.value].objetivo_general if s.id.value in modelos_dict else '',
                'ultima_revision': (lambda r: {
                    'concepto_final': r.concepto_final,
                    'pertinencia': {'estado': r.pertinencia_estado, 'observacion': r.pertinencia_obs},
                    'objetivos': {'estado': r.objetivos_estado, 'observacion': r.objetivos_obs},
                    'metodologia': {'estado': r.metodologia_estado, 'observacion': r.metodologia_obs},
                    'viabilidad': {'estado': r.viabilidad_estado, 'observacion': r.viabilidad_obs},
                    'fecha': str(r.fecha_revision)
                })(revisiones_dict[s.id.value]) if s.id.value in revisiones_dict else None,
                'decision_consejo': (lambda d: {
                    'concepto_financiero': d.concepto_financiero,
                    'observaciones': d.observaciones or '',
                    'acta': d.acta or '',
                    'fecha_acta': str(d.fecha_acta) if d.fecha_acta else None,
                    'fecha_decision': str(d.fecha_decision),
                })(decisiones_consejo_dict[s.id.value]) if s.id.value in decisiones_consejo_dict else None,
            } for s in resultados]
            return Response({'ok': True, 'datos': data}, status=status.HTTP_200_OK)

    def post(self, request):
        repo = DjangoSalidaRepository()
        uso = SalidaCreate(repository=repo)
        try:
            data_con_ids = _resolver_facultad_programa_a_ids(request.data)
            nueva_salida = uso.run(data_con_ids)
            
            # --- Orquestación de Itinerario ---
            repo_itin = DjangoItinerarioRepository()
            itinerario_data = {
                'salida_id': nueva_salida.id.value,
                'poligonal_mapa': '{}',
                'distancia_km': request.data.get('distancia_total_km', 0.0),
                'duracion_horas': request.data.get('horas_viaje', 0.0)
            }
            itinerario_creado = ItinerarioCreate(repository=repo_itin).run(itinerario_data)
            
            # --- Orquestación de Paradas (Nuevo Módulo) ---
            repo_paradas = DjangoParadaRepository()
            
            # Puntos de Ruta (Ida y Retorno)
            ruta_ida = request.data.get('puntos_ruta_data', [])
            ruta_retorno = request.data.get('puntos_retorno_data', [])
            
            orden_global = 1
            for p in ruta_ida:
                ParadaCreate(repository=repo_paradas).run({
                    'itinerario_id': itinerario_creado.id.value,
                    'orden': orden_global,
                    'latitud': p.get('lat', 0.0),
                    'longitud': p.get('lng', 0.0),
                    'nombre': p.get('nombreParada') or p.get('nombre', 'Punto'),
                    'tipo': p.get('motivo', 'viaje'),
                    'tiempo_estimado': p.get('tiempoEstimado'),
                    'actividad': p.get('actividad'),
                    'fecha_programada': p.get('fechaProgramada'),
                    'hora_programada': p.get('horaProgramada'),
                    'notas_itinerario': p.get('notasItinerario'),
                    'icono': p.get('icono'),
                    'color': p.get('color')
                })
                orden_global += 1
                
            for p in ruta_retorno:
                ParadaCreate(repository=repo_paradas).run({
                    'itinerario_id': itinerario_creado.id.value,
                    'orden': orden_global,
                    'latitud': p.get('lat', 0.0),
                    'longitud': p.get('lng', 0.0),
                    'nombre': p.get('nombreParada') or p.get('nombre', 'Punto'),
                    'tipo': p.get('motivo', 'retorno'),
                    'tiempo_estimado': p.get('tiempoEstimado'),
                    'actividad': p.get('actividad'),
                    'fecha_programada': p.get('fechaProgramada'),
                    'hora_programada': p.get('horaProgramada'),
                    'notas_itinerario': p.get('notasItinerario'),
                    'icono': p.get('icono'),
                    'color': p.get('color')
                })
                orden_global += 1
            
            # Actualizar campos de UI y de los 4 pasos del formulario
            from modulos.Salidas.Core.infraestructura.models import SalidaModelo
            SalidaModelo.objects.filter(id=nueva_salida.id.value).update(
                icono=request.data.get('icono', 'IcoMountain'),
                color=request.data.get('color', '#16a34a'),
                resumen=request.data.get('resumen', ''),
                relacion_syllabus=request.data.get('relacion_syllabus', ''),
                objetivo_general=request.data.get('objetivo_general', ''),
                objetivos_especificos=request.data.get('objetivos_especificos', ''),
                estrategia_metodologica=request.data.get('estrategia_metodologica', ''),
                punto_partida=request.data.get('punto_partida', ''),
                parada_max=request.data.get('parada_max', ''),
                criterios_evaluacion=request.data.get('criterio_evaluacion_texto', ''),
                productos_esperados=request.data.get('productos_esperados', ''),
            )

            return Response({'ok': True, 'id': nueva_salida.id.value}, status=status.HTTP_201_CREATED)
        except Exception as e:
            traceback.print_exc()
            return Response({'ok': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({'error': 'ID requerido'}, status=status.HTTP_400_BAD_REQUEST)
        repo = DjangoSalidaRepository()
        uso = SalidaEdit(repository=repo)
        try:
            print("=== PAYLOAD PUT RECIBIDO ===", request.data.get('puntos_ruta_data'))
            data_con_ids = _resolver_facultad_programa_a_ids(request.data)
            salida_actualizada = uso.run(pk, data_con_ids)
            
            # Actualizar campos de UI y de los 4 pasos del formulario
            from modulos.Salidas.Core.infraestructura.models import SalidaModelo
            SalidaModelo.objects.filter(id=salida_actualizada.id.value).update(
                icono=request.data.get('icono', 'IcoMountain'),
                color=request.data.get('color', '#16a34a'),
                resumen=request.data.get('resumen', ''),
                relacion_syllabus=request.data.get('relacion_syllabus', ''),
                objetivo_general=request.data.get('objetivo_general', ''),
                objetivos_especificos=request.data.get('objetivos_especificos', ''),
                estrategia_metodologica=request.data.get('estrategia_metodologica', ''),
                punto_partida=request.data.get('punto_partida', ''),
                parada_max=request.data.get('parada_max', ''),
                criterios_evaluacion=request.data.get('criterio_evaluacion_texto', ''),
                productos_esperados=request.data.get('productos_esperados', ''),
            )

            # ── Actualizar Paradas del Itinerario ──────────────────────────
            # Buscar el itinerario existente de esta salida
            repo_itin = DjangoItinerarioRepository()
            itinerarios = repo_itin.get_all()
            itinerario = next((i for i in itinerarios if i.salida_id.value == int(pk)), None)

            if itinerario:
                # Borrar paradas viejas y recrear desde el payload
                from modulos.Salidas.Itinerario.Parada.infraestructura.models import ParadaModelo
                ParadaModelo.objects.filter(itinerario_id=itinerario.id.value).delete()

                repo_paradas = DjangoParadaRepository()
                ruta_ida     = request.data.get('puntos_ruta_data', [])
                ruta_retorno = request.data.get('puntos_retorno_data', [])

                orden_global = 1
                for p in ruta_ida:
                    ParadaCreate(repository=repo_paradas).run({
                        'itinerario_id': itinerario.id.value,
                        'orden': orden_global,
                        'latitud': p.get('lat', 0.0),
                        'longitud': p.get('lng', 0.0),
                        'nombre': p.get('nombreParada') or p.get('nombre', 'Punto'),
                        'tipo': p.get('motivo', 'viaje'),
                        'tiempo_estimado': p.get('tiempoEstimado'),
                        'actividad': p.get('actividad'),
                        'fecha_programada': p.get('fechaProgramada'),
                        'hora_programada': p.get('horaProgramada'),
                        'notas_itinerario': p.get('notasItinerario'),
                        'icono': p.get('icono'),
                        'color': p.get('color'),
                    })
                    orden_global += 1

                for p in ruta_retorno:
                    ParadaCreate(repository=repo_paradas).run({
                        'itinerario_id': itinerario.id.value,
                        'orden': orden_global,
                        'latitud': p.get('lat', 0.0),
                        'longitud': p.get('lng', 0.0),
                        'nombre': p.get('nombreParada') or p.get('nombre', 'Punto'),
                        'tipo': p.get('motivo', 'retorno'),
                        'tiempo_estimado': p.get('tiempoEstimado'),
                        'actividad': p.get('actividad'),
                        'fecha_programada': p.get('fechaProgramada'),
                        'hora_programada': p.get('horaProgramada'),
                        'notas_itinerario': p.get('notasItinerario'),
                        'icono': p.get('icono'),
                        'color': p.get('color'),
                    })
                    orden_global += 1

                # Actualizar distancia/duración en el itinerario también
                from modulos.Salidas.Itinerario.infraestructura.models import ItinerarioModelo
                ItinerarioModelo.objects.filter(id=itinerario.id.value).update(
                    distancia_km=request.data.get('distancia_total_km', 0.0),
                    duracion_horas=request.data.get('horas_viaje', 0.0),
                )

            return Response({'ok': True, 'id': salida_actualizada.id.value}, status=status.HTTP_200_OK)
        except Exception as e:
            traceback.print_exc()
            return Response({'ok': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        """Alias de PUT: el frontend usa PATCH para ediciones parciales."""
        return self.put(request, pk)

    def delete(self, request, pk=None):
        if not pk:
            return Response({'error': 'ID requerido'}, status=status.HTTP_400_BAD_REQUEST)
        repo = DjangoSalidaRepository()
        uso = SalidaDelete(repository=repo)
        uso.run(pk)
        return Response({'ok': True}, status=status.HTTP_204_NO_CONTENT)


class EnviarSalidaView(APIView):
    """POST /api/salidas/core/<pk>/enviar/
    Cambia el estado de una salida de BORRADOR → enviada.
    Una vez enviada, el profesor ya no puede editarla ni eliminarla.
    """
    def post(self, request, pk=None):
        from modulos.Salidas.Core.infraestructura.models import SalidaModelo
        try:
            salida = SalidaModelo.objects.get(id=pk)
        except SalidaModelo.DoesNotExist:
            return Response({'ok': False, 'error': 'Salida no encontrada.'},
                            status=status.HTTP_404_NOT_FOUND)

        if salida.estado.upper() not in ['BORRADOR', 'PENDIENTE_AJUSTE', 'RECHAZADA']:
            return Response({'ok': False, 'error': f'La salida no está en un estado válido para envío (estado actual: {salida.estado}).'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Si estaba rechazada o con ajuste, se marca "enviada" (que luego la UI entendería como en revisión)
        salida.estado = 'enviada'
        salida.save(update_fields=['estado'])
        return Response({'ok': True, 'mensaje': 'Salida enviada a revisión del coordinador.'},
                        status=status.HTTP_200_OK)
