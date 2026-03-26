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

class SalidaCreate:
    def __init__(self, repository: SalidaRepository):
        self.repository = repository

    def run(self, data: dict) -> Salida:
        salida_temp = Salida(
            id=SalidaId(1),
            codigo=SalidaCodigo(data.get('codigo', 'DEFAULT')),
            nombre=SalidaNombre(data.get('nombre')),
            asignatura=SalidaAsignatura(data.get('asignatura')),
            semestre=SalidaSemestre(data.get('semestre')),
            facultad_id=FacultadId(data.get('facultad_id')),
            programa_id=ProgramaId(data.get('programa_id')),
            num_estudiantes=SalidaNumEstudiantes(data.get('num_estudiantes', 0)),
            justificacion=SalidaJustificacion(data.get('justificacion')),
            estado=EstadoSalida(data.get('estado', EstadoSalida.BORRADOR.value)),
            profesor_id=ProfesorId(data.get('profesor_id', 1)),
            fecha_inicio=SalidaFechaInicio(data.get('fecha_inicio')),
            fecha_fin=SalidaFechaFin(data.get('fecha_fin')),
            hora_inicio=SalidaHoraInicio(data.get('hora_inicio')),
            distancia_total_km=SalidaDistanciaTotalKm(data.get('distancia_total_km', 0.0)),
            duracion_dias=SalidaDuracionDias(data.get('duracion_dias', 1.0)),
            horas_viaje=SalidaHorasViaje(data.get('horas_viaje', 0.0)),
            costo_estimado=SalidaCostoEstimado(data.get('costo_estimado', 0.0)),
            vehiculos_asignados=SalidaVehiculosAsignados(data.get('vehiculos_asignados', []))
        )
        return self.repository.save(salida_temp)
