# CAPA: Infraestructura
# QUÉ HACE: Implementa ISalidaRepositorio usando Django ORM — convierte SalidaModelo ↔ Salida
# NO DEBE CONTENER: lógica de negocio, reglas de estado, validaciones de permisos

from typing import List, Optional

from dominio.salidas.entidad import Salida
from dominio.salidas.valor_objetos import EstadoSalida
from dominio.salidas.puerto import ISalidaRepositorio
from infraestructura.salidas.modelo import SalidaModelo


class SalidaRepositorioDjango(ISalidaRepositorio):

    # ── Conversores ───────────────────────────────────────────────────────

    @staticmethod
    def _a_entidad(modelo: SalidaModelo) -> Salida:
        salida = Salida(
            id=modelo.id,
            codigo=modelo.codigo,
            nombre=modelo.nombre,
            asignatura=modelo.asignatura,
            semestre=modelo.semestre,
            facultad=modelo.facultad,
            programa=modelo.programa,
            num_estudiantes=modelo.num_estudiantes,
            justificacion=modelo.justificacion,
            estado=EstadoSalida(modelo.estado),
            profesor_id=modelo.profesor_id,
            fecha_inicio=modelo.fecha_inicio,
            fecha_fin=modelo.fecha_fin,
            hora_inicio=modelo.hora_inicio,
            distancia_total_km=modelo.distancia_total_km,
            duracion_dias=modelo.duracion_dias,
            horas_viaje=modelo.horas_viaje,
            costo_estimado=modelo.costo_estimado,
            icono=modelo.icono,
            color=modelo.color,
            created_at=modelo.created_at,
            updated_at=modelo.updated_at,
        )

        # Hidratación de relaciones inversas sin provocar nuevos queries (si se usó prefetch_related)
        if hasattr(modelo, 'planeacion_modelo'):
            try:
                p = modelo.planeacion_modelo
                salida.resumen = p.resumen
                salida.relacion_syllabus = p.relacion_syllabus
                salida.productos_esperados = p.productos_esperados
                salida.objetivo_general = p.objetivo_general
                salida.estrategia_metodologica = p.estrategia_metodologica
                # Objetivos
                objs = [o.descripcion for o in p.objetivos.all()]
                salida.objetivos_especificos = '\n'.join(objs)
            except Exception:
                pass

        # Puntos de ruta
        if hasattr(modelo, 'puntos_ruta_modelo'):
            puntos = modelo.puntos_ruta_modelo.all()
            rutas, retornos = [], []
            for pt in puntos:
                d = {
                    'nombre': pt.nombre,
                    'latitud': pt.latitud,
                    'longitud': pt.longitud,
                    'motivo': pt.motivo,
                    'tiempo_estimado': pt.tiempo_estimado,
                    'actividad': pt.actividad,
                    'es_hospedaje': pt.es_hospedaje,
                    'fecha_programada': pt.fecha_programada,
                    'hora_programada': pt.hora_programada,
                    'notas_itinerario': pt.notas_itinerario,
                    'icono': pt.icono,
                    'color': pt.color,
                    'es_retorno': pt.es_retorno
                }
                if pt.es_retorno:
                    retornos.append(d)
                else:
                    rutas.append(d)
            salida.puntos_ruta_data = rutas
            salida.puntos_retorno_data = retornos

        # Criterios
        if hasattr(modelo, 'criterios'):
            crit = [c.descripcion for c in modelo.criterios.all()]
            salida.criterio_evaluacion_texto = '\n'.join(crit)

        return salida

    @staticmethod
    def _a_dict(salida: Salida) -> dict:
        return {
            'codigo': salida.codigo,
            'nombre': salida.nombre,
            'asignatura': salida.asignatura,
            'semestre': salida.semestre,
            'facultad': salida.facultad,
            'programa': salida.programa,
            'num_estudiantes': salida.num_estudiantes,
            'justificacion': salida.justificacion,
            'estado': salida.estado.value,
            'profesor_id': salida.profesor_id,
            'fecha_inicio': salida.fecha_inicio,
            'fecha_fin': salida.fecha_fin,
            'hora_inicio': salida.hora_inicio,
            'distancia_total_km': salida.distancia_total_km,
            'duracion_dias': salida.duracion_dias,
            'horas_viaje': salida.horas_viaje,
            'costo_estimado': salida.costo_estimado,
            'icono': salida.icono,
            'color': salida.color,
        }

    # ── Implementación del puerto ─────────────────────────────────────────

    def _queryset_optimizado(self):
        return SalidaModelo.objects.prefetch_related(
            'planeacion_modelo',
            'planeacion_modelo__objetivos',
            'criterios',
            'puntos_ruta_modelo'
        )

    def listar_por_profesor(self, profesor_id: int) -> List[Salida]:
        modelos = self._queryset_optimizado().filter(profesor_id=profesor_id)
        return [self._a_entidad(m) for m in modelos]

    def obtener_por_id(self, salida_id: int) -> Optional[Salida]:
        try:
            modelo = self._queryset_optimizado().get(id=salida_id)
            return self._a_entidad(modelo)
        except SalidaModelo.DoesNotExist:
            return None

    def _guardar_anidados(self, salida: Salida, modelo_id: int):
        from infraestructura.salidas.modelo import PlaneacionModelo, ObjetivoEspecificoModelo, CriterioEvaluacionModelo, PuntoRutaModelo
        # 1. Planeacion
        p, _ = PlaneacionModelo.objects.update_or_create(
            salida_id=modelo_id,
            defaults={
                'resumen': getattr(salida, 'resumen', ''),
                'relacion_syllabus': getattr(salida, 'relacion_syllabus', ''),
                'objetivo_general': getattr(salida, 'objetivo_general', ''),
                'estrategia_metodologica': getattr(salida, 'estrategia_metodologica', ''),
                'productos_esperados': getattr(salida, 'productos_esperados', '')
            }
        )
        # 2. Objetivos
        if getattr(salida, 'objetivos_especificos', ''):
            ObjetivoEspecificoModelo.objects.filter(planeacion=p).delete()
            for l in salida.objetivos_especificos.split('\n'):
                if l.strip():
                    ObjetivoEspecificoModelo.objects.create(planeacion=p, descripcion=l.strip())
        # 3. Criterios
        if getattr(salida, 'criterio_evaluacion_texto', ''):
            CriterioEvaluacionModelo.objects.filter(salida_id=modelo_id).delete()
            for l in salida.criterio_evaluacion_texto.split('\n'):
                if l.strip():
                    CriterioEvaluacionModelo.objects.create(salida_id=modelo_id, descripcion=l.strip())
        # 4. Puntos
        if getattr(salida, 'puntos_ruta_data', []) or getattr(salida, 'puntos_retorno_data', []):
            PuntoRutaModelo.objects.filter(salida_id=modelo_id).delete()
            for pts, ret in [(getattr(salida, 'puntos_ruta_data', []), False), (getattr(salida, 'puntos_retorno_data', []), True)]:
                for p_dict in pts:
                    # En algunos casos el payload puede ser dict, en otros un string si falla la deserialización pero asumimos dict
                    if isinstance(p_dict, dict):
                        PuntoRutaModelo.objects.create(
                            salida_id=modelo_id,
                            nombre=p_dict.get('nombre', '') or p_dict.get('nombreParada', ''),
                            latitud=p_dict.get('lat'), longitud=p_dict.get('lng'),
                            motivo=p_dict.get('motivo', ''),
                            tiempo_estimado=str(p_dict.get('tiempoEstimado', '')),
                            actividad=p_dict.get('actividad', ''),
                            es_hospedaje=p_dict.get('esHospedaje', False),
                            notas_itinerario=p_dict.get('notasItinerario', ''),
                            icono=p_dict.get('icono', ''),
                            color=p_dict.get('color', ''),
                            es_retorno=p_dict.get('esRetorno', ret)
                        )

    def crear(self, salida: Salida) -> Salida:
        modelo = SalidaModelo.objects.create(**self._a_dict(salida))
        self._guardar_anidados(salida, modelo.id)
        return self._a_entidad(modelo)

    def actualizar(self, salida: Salida) -> Salida:
        SalidaModelo.objects.filter(id=salida.id).update(**self._a_dict(salida))
        self._guardar_anidados(salida, salida.id)
        return self.obtener_por_id(salida.id)

    def eliminar(self, salida_id: int) -> None:
        from infraestructura.transporte.modelo import AsignacionModelo
        # Limpieza purista: eliminar hijos primero por salida_id
        AsignacionModelo.objects.filter(salida_id=salida_id).delete()
        # Luego borrar el padre
        SalidaModelo.objects.filter(id=salida_id).delete()

    def guardar(self, salida: Salida) -> Salida:
        """Persiste solo el estado (usado después de transiciones como enviar, aprobar)"""
        SalidaModelo.objects.filter(id=salida.id).update(estado=salida.estado.value)
        return self.obtener_por_id(salida.id)

    def listar_activas(self) -> List[Salida]:
        modelos = self._queryset_optimizado().exclude(
            estado__in=['cerrada', 'cancelada', 'rechazada']
        )
        return [self._a_entidad(m) for m in modelos]
