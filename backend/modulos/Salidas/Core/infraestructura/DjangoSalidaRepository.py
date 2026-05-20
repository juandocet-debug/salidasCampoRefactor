from typing import List, Optional
from modulos.Salidas.Core.dominio.SalidaRepository import SalidaRepository
from modulos.Salidas.Core.dominio.Salida import Salida
from modulos.Salidas.Core.dominio.SalidaId import SalidaId
from modulos.Salidas.Core.dominio.SalidaCodigo import SalidaCodigo
from modulos.Salidas.Core.dominio.SalidaNombre import SalidaNombre
from modulos.Salidas.Core.dominio.SalidaAsignatura import SalidaAsignatura
from modulos.Salidas.Core.dominio.SalidaSemestre import SalidaSemestre
from modulos.Salidas.Core.dominio.FacultadId import FacultadId
from modulos.Salidas.Core.dominio.ProgramaId import ProgramaId
from modulos.Salidas.Core.dominio.SalidaNumEstudiantes import SalidaNumEstudiantes
from modulos.Salidas.Core.dominio.SalidaJustificacion import SalidaJustificacion
from modulos.Salidas.Core.dominio.EstadoSalida import EstadoSalida
from modulos.Salidas.Core.dominio.ProfesorId import ProfesorId
from modulos.Salidas.Core.dominio.SalidaFechaInicio import SalidaFechaInicio
from modulos.Salidas.Core.dominio.SalidaFechaFin import SalidaFechaFin
from modulos.Salidas.Core.dominio.SalidaHoraInicio import SalidaHoraInicio
from modulos.Salidas.Core.dominio.SalidaHoraFin import SalidaHoraFin
from modulos.Salidas.Core.dominio.SalidaDistanciaTotalKm import SalidaDistanciaTotalKm

from modulos.Salidas.Core.dominio.SalidaDuracionDias import SalidaDuracionDias
from modulos.Salidas.Core.dominio.SalidaHorasViaje import SalidaHorasViaje
from modulos.Salidas.Core.dominio.SalidaCostoEstimado import SalidaCostoEstimado
from modulos.Salidas.Core.dominio.SalidaVehiculosAsignados import SalidaVehiculosAsignados

try:
    from modulos.Salidas.Core.infraestructura.models import SalidaModelo, SalidaVehiculoAsignado
except ImportError:
    SalidaModelo = None
    SalidaVehiculoAsignado = None


# Mapa de estados legados / alternativos que puedan existir en la BD
# hacia los estados canónicos del dominio.
# Esta normalización pertenece a la infraestructura — NO al dominio.
_ESTADO_LEGACY_MAP = {
    'ejecutandose':     'en_ejecucion',
    'en_ejecución':     'en_ejecucion',
    'BORRADOR':         'borrador',
    'ENVIADA':          'enviada',
    'EN_REVISION':      'en_revision',
    'FAVORABLE':        'favorable',
    'PENDIENTE_AJUSTE': 'pendiente_ajuste',
    'AJUSTADA':         'ajustada',
    'APROBADA':         'aprobada',
    'RECHAZADA':        'rechazada',
    'EN_PREPARACION':   'en_preparacion',
    'LISTA_EJECUCION':  'lista_ejecucion',
    'PREEMBARQUE':      'preembarque',
    'EN_EJECUCION':     'en_ejecucion',
    'FINALIZADA':       'finalizada',
    'CERRADA':          'cerrada',
    'CANCELADA':        'cancelada',
}

def _parse_estado(raw: str) -> EstadoSalida:
    """Convierte un valor de estado raw de la BD a EstadoSalida, tolerando valores legacy."""
    normalizado = _ESTADO_LEGACY_MAP.get(raw, raw)
    try:
        return EstadoSalida(normalizado)
    except ValueError:
        # Fallback seguro: si el estado es completamente desconocido, usar EN_EJECUCION
        print(f"[DjangoSalidaRepository] Estado desconocido en BD: '{raw}' → usando EN_EJECUCION como fallback")
        return EstadoSalida.EN_EJECUCION


class DjangoSalidaRepository(SalidaRepository):

    def _to_domain(self, model_obj) -> Salida:
        vehiculos_ids = []
        if SalidaVehiculoAsignado is not None:
            vehiculos_q = SalidaVehiculoAsignado.objects.filter(salida_id=model_obj.id)
            vehiculos_ids = [str(v.vehiculo_id) for v in vehiculos_q]
            
        return Salida(
            id=SalidaId(model_obj.id),
            codigo=SalidaCodigo(model_obj.codigo),
            nombre=SalidaNombre(model_obj.nombre),
            asignatura=SalidaAsignatura(model_obj.asignatura),
            semestre=SalidaSemestre(model_obj.semestre),
            facultad_id=FacultadId(model_obj.facultad_id),
            programa_id=ProgramaId(model_obj.programa_id),
            num_estudiantes=SalidaNumEstudiantes(model_obj.num_estudiantes),
            justificacion=SalidaJustificacion(model_obj.justificacion),
            estado=_parse_estado(model_obj.estado),
            profesor_id=ProfesorId(model_obj.profesor_id),
            fecha_inicio=SalidaFechaInicio(model_obj.fecha_inicio),
            fecha_fin=SalidaFechaFin(model_obj.fecha_fin),
            hora_inicio=SalidaHoraInicio(model_obj.hora_inicio),
            hora_fin=SalidaHoraFin(model_obj.hora_fin),
            distancia_total_km=SalidaDistanciaTotalKm(model_obj.distancia_total_km),
            duracion_dias=SalidaDuracionDias(model_obj.duracion_dias),
            horas_viaje=SalidaHorasViaje(model_obj.horas_viaje),
            costo_estimado=SalidaCostoEstimado(model_obj.costo_estimado),
            vehiculos_asignados=SalidaVehiculosAsignados(vehiculos_ids)
        )

    def save(self, salida: Salida) -> Salida:
        if not SalidaModelo:
            raise NotImplementedError("SalidaModelo de Django no está importado.")
        
        defaults = {
            'codigo': salida.codigo.value,
            'nombre': salida.nombre.value,
            'asignatura': salida.asignatura.value,
            'semestre': salida.semestre.value,
            'facultad_id': salida.facultad_id.value,
            'programa_id': salida.programa_id.value,
            'num_estudiantes': salida.num_estudiantes.value,
            'justificacion': salida.justificacion.value,
            'estado': salida.estado.value,
            'profesor_id': salida.profesor_id.value,
            'fecha_inicio': salida.fecha_inicio.value,
            'fecha_fin': salida.fecha_fin.value,
            'hora_inicio': salida.hora_inicio.value,
            'hora_fin': salida.hora_fin.value,
            'distancia_total_km': salida.distancia_total_km.value,
            'duracion_dias': salida.duracion_dias.value,
            'horas_viaje': salida.horas_viaje.value,
            'costo_estimado': salida.costo_estimado.value
        }

        if hasattr(salida.id, 'value') and salida.id.value is not None:
            obj, created = SalidaModelo.objects.update_or_create(id=salida.id.value, defaults=defaults)
        else:
            import random
            import string
            
            # Generar PIN unico
            pin = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            while SalidaModelo.objects.filter(pin_acceso=pin).exists():
                pin = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
                
            defaults['pin_acceso'] = pin
            obj = SalidaModelo.objects.create(**defaults)

        # Actualizar Vehiculos Asignados
        if SalidaVehiculoAsignado:
            SalidaVehiculoAsignado.objects.filter(salida_id=obj.id).delete()
            if hasattr(salida, 'vehiculos_asignados') and salida.vehiculos_asignados.value:
                nuevos = [
                    SalidaVehiculoAsignado(salida_id=obj.id, vehiculo_id=vid) 
                    for vid in salida.vehiculos_asignados.value
                ]
                SalidaVehiculoAsignado.objects.bulk_create(nuevos)

        return self._to_domain(obj)

    def get_by_id(self, id_salida: int) -> Optional[Salida]:
        if not SalidaModelo: return None
        try:
            obj = SalidaModelo.objects.get(id=id_salida)
            return self._to_domain(obj)
        except Exception: 
            return None

    def get_all(self) -> List[Salida]:
        if not SalidaModelo: return []
        qs = SalidaModelo.objects.all()
        return [self._to_domain(obj) for obj in qs]

    def delete(self, id_salida: int) -> None:
        if not SalidaModelo: return
        SalidaModelo.objects.filter(id=id_salida).delete()
