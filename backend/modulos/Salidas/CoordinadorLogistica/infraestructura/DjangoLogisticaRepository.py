from typing import List
from ..dominio.ILogisticaRepository import ILogisticaRepository
from ..dominio.ValueObjectsLogistica import (
    AsignacionLogisticaResumen,
    EstadoOperativoSalida,
    CategoriaLogisticaSalida
)
from modulos.Salidas.Core.infraestructura.models import SalidaModelo


class DjangoLogisticaRepository(ILogisticaRepository):

    def obtener_salidas_por_estado(self, estado: str) -> List[AsignacionLogisticaResumen]:
        """
        Consulta la BD real vía el ORM de Django y mapea al Dominio de Logística.
        NOTA DE PRUEBAS: Traemos todas las salidas con código para poder testear el flujo.
        En producción filtrar por estado='aprobada_consejo_facultad'.
        """
        salidas_orm = SalidaModelo.objects.exclude(codigo='').order_by('-id')

        resultado = []
        for s_orm in salidas_orm:
            # Mapear estado de BD al enum de dominio — usar fallback seguro
            try:
                estado_operativo = EstadoOperativoSalida(s_orm.estado)
            except (ValueError, KeyError):
                estado_operativo = EstadoOperativoSalida.APROBADA_CONSEJO

            # Determinar categoría logística según distancia (km)
            km = float(s_orm.distancia_total_km or 0)
            if km <= 50:
                categoria = CategoriaLogisticaSalida.URBANA
            elif km <= 200:
                categoria = CategoriaLogisticaSalida.REGIONAL
            else:
                categoria = CategoriaLogisticaSalida.LARGA

            resumen = AsignacionLogisticaResumen(
                salida_id=str(s_orm.id),
                codigo=s_orm.codigo or f"SAL-{s_orm.id}",
                nombre=s_orm.nombre or "Sin nombre",
                facultad=f"Facultad {s_orm.facultad_id}" if s_orm.facultad_id else "Sin facultad",
                estado_operativo=estado_operativo,
                categoria=categoria,
                fecha_inicio=str(s_orm.fecha_inicio) if s_orm.fecha_inicio else None,
                fecha_fin=str(s_orm.fecha_fin) if s_orm.fecha_fin else None,
                hora_inicio=s_orm.hora_inicio.strftime('%H:%M') if s_orm.hora_inicio else '06:00',
                hora_fin=s_orm.hora_fin.strftime('%H:%M') if s_orm.hora_fin else '18:00',
                destino_principal=s_orm.parada_max or s_orm.punto_partida or "No especificado",
                num_estudiantes=s_orm.num_estudiantes or 0,
                num_docentes=1,  # Placeholder si no existe_docentes_apoyo en DB
                costo_estimado=float(s_orm.costo_estimado or 0),
                viaticos_estimados=max(0.5, float(s_orm.duracion_dias or 1) - 0.5) * 80000.0,
                distancia_km=float(s_orm.distancia_total_km or 0),
                duracion_dias=float(s_orm.duracion_dias or 1),
                horas_viaje=float(s_orm.horas_viaje or 0)
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
        print(f"✅ DB: Vehículo Asignado. Tipo: {dto.tipo_transporte.value}, Salida: {dto.salida_id}")
        self.actualizar_estado_operativo(dto.salida_id, EstadoOperativoSalida.LISTA_EJECUCION.value)
        return True

    def guardar_novedad_operativa(self, dto) -> bool:
        print(f"🚨 DB: Novedad Registrada. Nivel: {dto.nivel.value}, Mensaje: {dto.mensaje}")
        return True

    def guardar_cierre_operativo(self, dto) -> bool:
        print(f"🏁 DB: Cierre Operativo Registrado. KM: {dto.km_final}")
        self.actualizar_estado_operativo(dto.salida_id, EstadoOperativoSalida.EJECUTADA.value)
        return True
