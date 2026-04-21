from dataclasses import dataclass

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

@dataclass
class Salida:
    id: SalidaId
    codigo: SalidaCodigo
    nombre: SalidaNombre
    asignatura: SalidaAsignatura
    semestre: SalidaSemestre
    facultad_id: FacultadId
    programa_id: ProgramaId
    num_estudiantes: SalidaNumEstudiantes
    justificacion: SalidaJustificacion
    estado: EstadoSalida
    profesor_id: ProfesorId
    fecha_inicio: SalidaFechaInicio
    fecha_fin: SalidaFechaFin
    hora_inicio: SalidaHoraInicio
    hora_fin: SalidaHoraFin
    distancia_total_km: SalidaDistanciaTotalKm
    duracion_dias: SalidaDuracionDias
    horas_viaje: SalidaHorasViaje
    costo_estimado: SalidaCostoEstimado
    vehiculos_asignados: SalidaVehiculosAsignados

    def cambiar_estado(self, nuevo_estado: EstadoSalida):
        self.estado = nuevo_estado
