from typing import List
from ..dominio.ILogisticaRepository import ILogisticaRepository
from ..dominio.ValueObjectsLogistica import (
    AsignacionLogisticaResumen,
    EstadoOperativoSalida,
    CategoriaLogisticaSalida
)
from modulos.Salidas.Core.infraestructura.models import SalidaModelo, AsignacionExternaLogistica
from modulos.Catalogos.Facultad.infraestructura.models import FacultadModel
from modulos.Catalogos.Programa.infraestructura.models import ProgramaModel
from modulos.Logistica.Vehiculo.infraestructura.models import VehiculoModel


class DjangoLogisticaRepository(ILogisticaRepository):

    def obtener_salidas_por_estado(self, estado: str) -> List[AsignacionLogisticaResumen]:
        """
        Retorna salidas en gestión logística: aprobadas por consejo y ya asignadas.
        """
        estados_visibles = [
            EstadoOperativoSalida.APROBADA_CONSEJO.value,   # 'aprobada'
            'en_preparacion',                               # 'en_preparacion' (Incompleta)
            EstadoOperativoSalida.LISTA_EJECUCION.value,    # 'lista_ejecucion'
            EstadoOperativoSalida.PREEMBARQUE.value,        # 'preembarque'
        ]
        # Solo salidas que han pasado por el proceso completo (aprobadas por consejo o ya en ejecución)
        salidas_orm = SalidaModelo.objects.filter(estado__in=estados_visibles).order_by('-id')

        # Obtener nombres de facultades
        facultad_ids = [s.facultad_id for s in salidas_orm if s.facultad_id]
        facultades = FacultadModel.objects.filter(id__in=facultad_ids)
        mapa_facultades = {f.id: f.nombre for f in facultades}

        # Obtener nombres de programas
        programa_ids = [s.programa_id for s in salidas_orm if s.programa_id]
        programas = ProgramaModel.objects.filter(id__in=programa_ids)
        mapa_programas = {p.id: p.nombre for p in programas}

        # Intentar cargar asignaciones externas (puede fallar si la tabla no existe aún)
        mapa_asignaciones = {}
        try:
            salida_ids = [s.id for s in salidas_orm]
            asignaciones = AsignacionExternaLogistica.objects.filter(salida_id__in=salida_ids)
            mapa_asignaciones = {a.salida_id: a for a in asignaciones}
            print(f"[LOG] AsignacionExternaLogistica: {len(mapa_asignaciones)} registros encontrados")
        except Exception as e:
            print(f"[WARN] No se pudo leer AsignacionExternaLogistica: {e}")

        resultado = []
        for s_orm in salidas_orm:
            try:
                estado_operativo = EstadoOperativoSalida(s_orm.estado)
            except (ValueError, KeyError):
                estado_operativo = EstadoOperativoSalida.APROBADA_CONSEJO

            km = float(s_orm.distancia_total_km or 0)
            if km <= 50:
                categoria = CategoriaLogisticaSalida.URBANA
            elif km <= 200:
                categoria = CategoriaLogisticaSalida.REGIONAL
            else:
                categoria = CategoriaLogisticaSalida.LARGA

            asig = mapa_asignaciones.get(s_orm.id)

            # ── Calcular capacidad real para registros sin campo guardado ──
            cap_calculada = int(asig.capacidad_asignada) if asig else 0
            if asig and cap_calculada == 0 and asig.empresa:
                try:
                    import re
                    texto_empresa = asig.empresa
                    match_flota = re.search(r'Flota UPN \((.+?)\)', texto_empresa)
                    if match_flota:
                        placas_str = match_flota.group(1)
                    elif 'Institucional' in (asig.contacto or ''):
                        placas_str = texto_empresa
                    else:
                        placas_str = None

                    if placas_str:
                        placas = [p.strip() for p in placas_str.split('/')]
                        vehiculos_bd = VehiculoModel.objects.filter(placa__in=placas)
                        cap_calculada = sum(v.capacidad for v in vehiculos_bd)
                        # Auto-persistir para no recalcular en cada request
                        if cap_calculada > 0:
                            AsignacionExternaLogistica.objects.filter(salida_id=s_orm.id).update(capacidad_asignada=cap_calculada)
                except Exception as e_cap:
                    print(f"[WARN] No se pudo calcular capacidad desde flota: {e_cap}")

            resumen = AsignacionLogisticaResumen(
                salida_id=str(s_orm.id),
                codigo=s_orm.codigo or f"SAL-{s_orm.id}",
                nombre=s_orm.nombre or "Sin nombre",
                facultad=mapa_facultades.get(s_orm.facultad_id, f"Facultad {s_orm.facultad_id}") if s_orm.facultad_id else "Sin facultad",
                programa=mapa_programas.get(s_orm.programa_id, f"Programa {s_orm.programa_id}") if s_orm.programa_id else "Sin programa",
                estado_operativo=estado_operativo,
                categoria=categoria,
                fecha_inicio=str(s_orm.fecha_inicio) if s_orm.fecha_inicio else None,
                fecha_fin=str(s_orm.fecha_fin) if s_orm.fecha_fin else None,
                hora_inicio=s_orm.hora_inicio.strftime('%H:%M') if s_orm.hora_inicio else '06:00',
                hora_fin=s_orm.hora_fin.strftime('%H:%M') if s_orm.hora_fin else '18:00',
                destino_principal=s_orm.parada_max or s_orm.punto_partida or "No especificado",
                num_estudiantes=s_orm.num_estudiantes or 0,
                num_docentes=1,
                costo_estimado=float(asig.costo_proyectado) if (asig and float(asig.costo_proyectado) > 0) else float(s_orm.costo_estimado or 0),
                viaticos_estimados=max(0.5, float(s_orm.duracion_dias or 1) - 0.5) * 80000.0,
                distancia_km=float(s_orm.distancia_total_km or 0),
                duracion_dias=float(s_orm.duracion_dias or 1),
                horas_viaje=float(s_orm.horas_viaje or 0),
                empresa_asignada=asig.empresa if asig else None,
                conductor_asignado=asig.contacto if asig else None,
                capacidad_asignada=cap_calculada,
            )
            resultado.append(resumen)


        return resultado

    def actualizar_estado_operativo(self, salida_id: str, nuevo_estado: str) -> bool:
        """Actualiza el estado en BD vía Django ORM."""
        try:
            modificados = SalidaModelo.objects.filter(id=int(salida_id)).update(estado=nuevo_estado)
            return modificados > 0
        except Exception as e:
            print(f"Error actualizando estado logística: {e}")
            return False

    def guardar_asignacion_vehiculo(self, dto) -> bool:
        try:
            AsignacionExternaLogistica.objects.update_or_create(
                salida_id=int(dto.salida_id),
                defaults={
                    'empresa': dto.placa_o_empresa or '',
                    'contacto': dto.conductor_o_contacto or '',
                    'costo_proyectado': dto.costo_proyectado or 0,
                    'capacidad_asignada': dto.capacidad_asignada or 0,
                }
            )
        except Exception as e:
            print(f"[WARN] No se pudo persistir asignación externa: {e}")

        try:
            from modulos.Salidas.Core.infraestructura.models import SalidaModelo
            s_orm = SalidaModelo.objects.get(id=int(dto.salida_id))
            total_pax = (s_orm.num_estudiantes or 0) + 1  # 1 docente responsable
            if total_pax == 0: total_pax = 1
            
            if (dto.capacidad_asignada or 0) >= total_pax:
                self.actualizar_estado_operativo(dto.salida_id, EstadoOperativoSalida.LISTA_EJECUCION.value)
            else:
                # Si está incompleta, se mantiene en preparación
                self.actualizar_estado_operativo(dto.salida_id, 'en_preparacion')
        except Exception as e:
            print(f"[ERROR] Verificando pax vs cap: {e}")
            self.actualizar_estado_operativo(dto.salida_id, EstadoOperativoSalida.LISTA_EJECUCION.value)

        return True

    def guardar_novedad_operativa(self, dto) -> bool:
        print(f"DB: Novedad Registrada. Nivel: {dto.nivel.value}, Mensaje: {dto.mensaje}")
        return True

    def guardar_cierre_operativo(self, dto) -> bool:
        print(f"DB: Cierre Operativo Registrado. KM: {dto.km_final}")
        self.actualizar_estado_operativo(dto.salida_id, EstadoOperativoSalida.EJECUTADA.value)
        return True
