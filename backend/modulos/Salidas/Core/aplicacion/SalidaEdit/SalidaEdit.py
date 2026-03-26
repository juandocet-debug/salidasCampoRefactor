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

        salida_actualizada = Salida(
            id=salida_existente.id,
            codigo=SalidaCodigo(data.get('codigo', salida_existente.codigo.value)),
            nombre=SalidaNombre(data.get('nombre', salida_existente.nombre.value)),
            asignatura=SalidaAsignatura(data.get('asignatura', salida_existente.asignatura.value)),
            semestre=SalidaSemestre(data.get('semestre', salida_existente.semestre.value)),
            facultad_id=FacultadId(data.get('facultad_id', salida_existente.facultad_id.value)),
            programa_id=ProgramaId(data.get('programa_id', salida_existente.programa_id.value)),
            num_estudiantes=SalidaNumEstudiantes(data.get('num_estudiantes', salida_existente.num_estudiantes.value)),
            justificacion=SalidaJustificacion(data.get('justificacion', salida_existente.justificacion.value)),
            estado=EstadoSalida(data.get('estado', salida_existente.estado.value)),
            profesor_id=ProfesorId(data.get('profesor_id', salida_existente.profesor_id.value)),
            fecha_inicio=SalidaFechaInicio(data.get('fecha_inicio', salida_existente.fecha_inicio.value)),
            fecha_fin=SalidaFechaFin(data.get('fecha_fin', salida_existente.fecha_fin.value)),
            hora_inicio=SalidaHoraInicio(data.get('hora_inicio', salida_existente.hora_inicio.value)),
            distancia_total_km=SalidaDistanciaTotalKm(data.get('distancia_total_km', salida_existente.distancia_total_km.value)),
            duracion_dias=SalidaDuracionDias(data.get('duracion_dias', salida_existente.duracion_dias.value)),
            horas_viaje=SalidaHorasViaje(data.get('horas_viaje', salida_existente.horas_viaje.value)),
            costo_estimado=SalidaCostoEstimado(data.get('costo_estimado', salida_existente.costo_estimado.value)),
            vehiculos_asignados=SalidaVehiculosAsignados(data.get('vehiculos_asignados', salida_existente.vehiculos_asignados.value))
        )
        return self.repository.save(salida_actualizada)
