from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from modulos.Salidas.Core.infraestructura.DjangoSalidaRepository import DjangoSalidaRepository
from modulos.Salidas.Core.aplicacion.SalidaDelete.SalidaDelete import SalidaDelete
from modulos.Salidas.Core.aplicacion.ConsultarSalidaAdmin.ConsultarSalidaAdminCasoUso import ConsultarSalidaAdminCasoUso
from modulos.Salidas.Itinerario.infraestructura.DjangoItinerarioRepository import DjangoItinerarioRepository


class AdminSalidasController(APIView):
    permission_classes = [AllowAny]  # En prod: IsAdminUser

    def get(self, request, pk=None):
        salida_repo     = DjangoSalidaRepository()
        itinerario_repo = DjangoItinerarioRepository()

        # ── DETALLE: GET /api/admin/salidas/{pk}/ ────────────────────────────
        if pk:
            try:
                resultado = ConsultarSalidaAdminCasoUso(salida_repo, itinerario_repo).ejecutar(int(pk))
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)

            s = resultado['salida']
            puntos_base = resultado['puntos_ruta']

            # El controlador (infraestructura) puede enriquecer con campos de presentación
            # que no pertenecen al dominio base pero sí al modelo de persistencia.
            # Esto NO viola hexagonal: estamos dentro de la capa de infraestructura.
            from modulos.Salidas.Core.infraestructura.models import SalidaModelo, AsignacionExternaLogistica
            from modulos.Salidas.Itinerario.Parada.infraestructura.models import ParadaModelo

            try:
                m = SalidaModelo.objects.get(pk=pk)
            except SalidaModelo.DoesNotExist:
                return Response({'error': 'Salida no encontrada'}, status=status.HTTP_404_NOT_FOUND)

            # Enriquecer paradas con campos extra del modelo (presentación/logística)
            puntos_ids = [p['id'] for p in puntos_base]
            extras = {
                obj.id: obj
                for obj in ParadaModelo.objects.filter(id__in=puntos_ids)
            }
            for p in puntos_base:
                extra = extras.get(p['id'])
                if extra:
                    p['actividad']        = extra.actividad or ''
                    p['tiempo_estimado']  = extra.tiempo_estimado or ''
                    p['fecha_programada'] = str(extra.fecha_programada) if extra.fecha_programada else None
                    p['hora_programada']  = str(extra.hora_programada)  if extra.hora_programada  else None
                    p['notas_itinerario'] = extra.notas_itinerario or ''

            # Buscar si hay asignación logística
            asignacion = AsignacionExternaLogistica.objects.filter(salida_id=pk).first()
            logistica_data = None
            if asignacion:
                logistica_data = {
                    'empresa': asignacion.empresa,
                    'contacto': asignacion.contacto,
                    'costo_proyectado': str(asignacion.costo_proyectado),
                    'capacidad_asignada': asignacion.capacidad_asignada
                }

            return Response({
                # Identidad
                'id': s.id.value, 'codigo': s.codigo.value, 'nombre': s.nombre.value,
                'estado': s.estado.value,
                # Académico (dominio)
                'asignatura':   s.asignatura.value   if s.asignatura   else '',
                'semestre':     s.semestre.value     if s.semestre     else '',
                'justificacion': s.justificacion.value if s.justificacion else '',
                # Logístico (dominio)
                'fecha_inicio':     str(s.fecha_inicio.value) if s.fecha_inicio and s.fecha_inicio.value else None,
                'fecha_fin':        str(s.fecha_fin.value)    if s.fecha_fin    and s.fecha_fin.value    else None,
                'num_estudiantes':  s.num_estudiantes.value   if s.num_estudiantes  else 0,
                'costo_estimado':   float(s.costo_estimado.value or 0) if hasattr(s, 'costo_estimado') and s.costo_estimado else 0,
                'distancia_total_km': float(s.distancia_total_km.value or 0) if hasattr(s, 'distancia_total_km') and s.distancia_total_km else None,
                'duracion_dias': s.duracion_dias.value if hasattr(s, 'duracion_dias') and s.duracion_dias else None,
                'horas_viaje':   s.horas_viaje.value   if hasattr(s, 'horas_viaje')   and s.horas_viaje   else None,
                # Campos de presentación (model-only)
                'hora_inicio':            str(m.hora_inicio)            if m.hora_inicio            else None,
                'hora_fin':               str(m.hora_fin)               if m.hora_fin               else None,
                'resumen':                m.resumen                     or '',
                'relacion_syllabus':      m.relacion_syllabus           or '',
                'objetivo_general':       m.objetivo_general            or '',
                'objetivos_especificos':  m.objetivos_especificos       or '',
                'estrategia_metodologica': m.estrategia_metodologica    or '',
                'productos_esperados':    m.productos_esperados          or '',
                'criterios_evaluacion':   m.criterios_evaluacion        or '',
                'punto_partida':          m.punto_partida                or '',
                'parada_max':             m.parada_max                   or '',
                'tipo_vehiculo_calculo':  getattr(m, 'tipo_vehiculo_calculo', None) or '',
                'pin_acceso':             m.pin_acceso                   or '',
                # Campos visuales de tarjetas (FALTABAN en detalle)
                'icono':          m.icono       or 'IcoMountain',
                'color':          m.color       or '#4A8DAC',
                'nota_cambio':    m.nota_cambio or '',
                # Itinerario
                'puntos_ruta': puntos_base,
                # Logística Externa
                'asignacion_logistica': logistica_data,
            }, status=status.HTTP_200_OK)

        # ── LISTA: GET /api/admin/salidas/ ───────────────────────────────────
        from modulos.Salidas.Core.infraestructura.models import SalidaModelo, AsignacionExternaLogistica
        from modulos.Usuarios.infraestructura.models import UsuarioModel
        from modulos.Catalogos.Facultad.infraestructura.models import FacultadModel
        from modulos.Catalogos.Programa.infraestructura.models import ProgramaModel

        salidas      = salida_repo.get_all()
        modelos_dict = {m.id: m for m in SalidaModelo.objects.all()}

        # Enriquecer con asignaciones logísticas (empresa / conductor)
        try:
            asignaciones_dict = {a.salida_id: a for a in AsignacionExternaLogistica.objects.all()}
        except Exception:
            asignaciones_dict = {}

        # Resolver nombres de usuarios, facultades y programas
        try:
            usuarios_dict   = {u.id: f"{u.nombre} {u.apellido}".strip() for u in UsuarioModel.objects.all()}
            facultades_dict = {f.id: f.nombre for f in FacultadModel.objects.all()}
            programas_dict  = {p.id: p.nombre for p in ProgramaModel.objects.all()}
        except Exception:
            usuarios_dict = facultades_dict = programas_dict = {}

        data = [{
            'id':              s.id.value,
            'codigo':          s.codigo.value,
            'nombre':          s.nombre.value,
            'asignatura':      s.asignatura.value  if s.asignatura  else '',
            'semestre':        s.semestre.value     if s.semestre    else '',
            'estado':          s.estado.value,
            'profesor_id':     s.profesor_id.value  if s.profesor_id else None,
            'fecha_inicio':    str(s.fecha_inicio.value) if s.fecha_inicio and s.fecha_inicio.value else None,
            'fecha_fin':       str(s.fecha_fin.value)    if s.fecha_fin    and s.fecha_fin.value    else None,
            'num_estudiantes': s.num_estudiantes.value   if s.num_estudiantes  else 0,
            'costo_estimado':  float(s.costo_estimado.value or 0) if hasattr(s, 'costo_estimado') and s.costo_estimado else 0,
            'justificacion':   s.justificacion.value if s.justificacion else '',
            # Campos de presentación necesarios para renderizar tarjetas en el tablero
            'resumen':         modelos_dict[s.id.value].resumen        if s.id.value in modelos_dict else '',
            'parada_max':      modelos_dict[s.id.value].parada_max     if s.id.value in modelos_dict else '',
            'punto_partida':   modelos_dict[s.id.value].punto_partida  if s.id.value in modelos_dict else '',
            'objetivo_general':      modelos_dict[s.id.value].objetivo_general     if s.id.value in modelos_dict else '',
            'productos_esperados':   modelos_dict[s.id.value].productos_esperados  if s.id.value in modelos_dict else '',
            'pin_acceso':            modelos_dict[s.id.value].pin_acceso           if s.id.value in modelos_dict else '',
            # Campos visuales de las tarjetas (icono, color, nota) — FALTABAN
            'icono':           modelos_dict[s.id.value].icono          if s.id.value in modelos_dict else 'IcoMap',
            'color':           modelos_dict[s.id.value].color          if s.id.value in modelos_dict else '#4A8DAC',
            'nota_cambio':     modelos_dict[s.id.value].nota_cambio    if s.id.value in modelos_dict else '',
            'hora_inicio':     str(modelos_dict[s.id.value].hora_inicio) if s.id.value in modelos_dict and modelos_dict[s.id.value].hora_inicio else None,
            'hora_fin':        str(modelos_dict[s.id.value].hora_fin)    if s.id.value in modelos_dict and modelos_dict[s.id.value].hora_fin    else None,
            'horas_viaje':     float(s.horas_viaje.value or 0) if hasattr(s, 'horas_viaje') and s.horas_viaje else None,
            'decision_consejo': getattr(modelos_dict.get(s.id.value), 'decision_consejo', None),
            # Datos de transporte asignado (para Monitoreo en Ejecución)
            'empresa_asignada':   asignaciones_dict[s.id.value].empresa if s.id.value in asignaciones_dict else None,
            'conductor_asignado': asignaciones_dict[s.id.value].contacto if s.id.value in asignaciones_dict else None,
            # Datos académicos resueltos
            'profesor_nombre': usuarios_dict.get(s.profesor_id.value, 'Docente') if s.profesor_id else 'Docente',
            'facultad':  facultades_dict.get(s.facultad_id.value, '') if hasattr(s, 'facultad_id') and s.facultad_id else '',
            'programa':  programas_dict.get(s.programa_id.value, '')  if hasattr(s, 'programa_id') and s.programa_id else '',
        } for s in salidas]
        return Response(data, status=status.HTTP_200_OK)

    def delete(self, request, pk=None):
        """Elimina una salida y todos sus datos relacionados usando los puertos de dominio."""
        if not pk:
            return Response({'error': 'ID requerido'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            itinerario_repo = DjangoItinerarioRepository()
            salida_repo     = DjangoSalidaRepository()

            # Eliminar puntos de parada e itinerario a través del repositorio del módulo Itinerario
            for itinerario in itinerario_repo.get_all():
                if itinerario.salida_id.value == int(pk):
                    puntos = itinerario_repo.get_puntos_by_itinerario(itinerario.id.value)
                    for punto in puntos:
                        from modulos.Salidas.Itinerario.infraestructura.models import PuntoParadaModelo
                        PuntoParadaModelo.objects.filter(id=punto.id.value).delete()
                    itinerario_repo.delete(itinerario.id.value)

            SalidaDelete(repository=salida_repo).run(pk)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CleanupHuerfanosController(APIView):
    """Endpoint temporal — limpia itinerarios y paradas huérfanos (sin salida asociada)."""
    permission_classes = [AllowAny]

    def get(self, request):
        from modulos.Salidas.Core.infraestructura.models import SalidaModelo
        from modulos.Salidas.Itinerario.infraestructura.models import ItinerarioModelo, PuntoParadaModelo

        salida_ids = set(SalidaModelo.objects.values_list('id', flat=True))
        huerfanos  = ItinerarioModelo.objects.exclude(salida_id__in=salida_ids)

        count_paradas = 0
        for itin in huerfanos:
            count_paradas += PuntoParadaModelo.objects.filter(itinerario_id=itin.id).delete()[0]

        count_itin = huerfanos.delete()[0]
        return Response({
            'ok': True,
            'itinerarios_eliminados': count_itin,
            'paradas_eliminadas': count_paradas,
            'mensaje': 'Base de datos limpia. Puedes crear nuevas salidas sin errores.'
        })
