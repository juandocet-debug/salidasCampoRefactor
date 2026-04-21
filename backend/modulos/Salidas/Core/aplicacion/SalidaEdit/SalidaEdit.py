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

class SalidaEdit:
    def __init__(self, repository: SalidaRepository):
        self.repository = repository

    def run(self, id_salida: int, data: dict) -> Salida:
        salida_existente = self.repository.get_by_id(id_salida)
        if not salida_existente:
            raise ValueError(f"La salida con ID {id_salida} no existe.")

        # Sanitizar campos numericos: si viene None en el payload, usar el valor existente
        def _get(key, fallback):
            v = data.get(key)
            return v if v is not None else fallback

        salida_actualizada = Salida(
            id=salida_existente.id,
            codigo=SalidaCodigo(_get('codigo', salida_existente.codigo.value)),
            nombre=SalidaNombre(_get('nombre', salida_existente.nombre.value)),
            asignatura=SalidaAsignatura(_get('asignatura', salida_existente.asignatura.value)),
            semestre=SalidaSemestre(_get('semestre', salida_existente.semestre.value)),
            facultad_id=FacultadId(_get('facultad_id', salida_existente.facultad_id.value)),
            programa_id=ProgramaId(_get('programa_id', salida_existente.programa_id.value)),
            num_estudiantes=SalidaNumEstudiantes(_get('num_estudiantes', salida_existente.num_estudiantes.value)),
            justificacion=SalidaJustificacion(_get('justificacion', salida_existente.justificacion.value)),
            estado=EstadoSalida(_get('estado', salida_existente.estado.value)),
            profesor_id=ProfesorId(_get('profesor_id', salida_existente.profesor_id.value)),
            fecha_inicio=SalidaFechaInicio(_get('fecha_inicio', salida_existente.fecha_inicio.value)),
            fecha_fin=SalidaFechaFin(_get('fecha_fin', salida_existente.fecha_fin.value)),
            hora_inicio=SalidaHoraInicio(_get('hora_inicio', salida_existente.hora_inicio.value)),
            hora_fin=SalidaHoraFin(_get('hora_fin', salida_existente.hora_fin.value)),
            distancia_total_km=SalidaDistanciaTotalKm(_get('distancia_total_km', salida_existente.distancia_total_km.value)),
            duracion_dias=SalidaDuracionDias(_get('duracion_dias', salida_existente.duracion_dias.value)),
            horas_viaje=SalidaHorasViaje(_get('horas_viaje', salida_existente.horas_viaje.value)),
            costo_estimado=SalidaCostoEstimado(_get('costo_estimado', salida_existente.costo_estimado.value)),
            vehiculos_asignados=SalidaVehiculosAsignados(_get('vehiculos_asignados', salida_existente.vehiculos_asignados.value) or [])
        )
        return self.repository.save(salida_actualizada)

