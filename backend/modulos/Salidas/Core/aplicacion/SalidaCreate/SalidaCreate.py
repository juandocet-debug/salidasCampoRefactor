import uuid
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

class SalidaCreate:
    def __init__(self, repository: SalidaRepository):
        self.repository = repository

    def run(self, data: dict) -> Salida:
        # Generar codigo unico automaticamente si no viene del frontend
        codigo = data.get('codigo') or f"SC-{uuid.uuid4().hex[:8].upper()}"
        # Sanitizar campos numericos: reemplazar None con defaults seguros
        num_estudiantes = data.get('num_estudiantes') if data.get('num_estudiantes') is not None else 0
        distancia_total_km = data.get('distancia_total_km') if data.get('distancia_total_km') is not None else 0.0
        duracion_dias = data.get('duracion_dias') if data.get('duracion_dias') is not None else 1.0
        horas_viaje = data.get('horas_viaje') if data.get('horas_viaje') is not None else 0.0
        costo_estimado = data.get('costo_estimado') if data.get('costo_estimado') is not None else 0.0
        salida_temp = Salida(
            id=SalidaId(1),
            codigo=SalidaCodigo(codigo),
            nombre=SalidaNombre(data.get('nombre')),
            asignatura=SalidaAsignatura(data.get('asignatura')),
            semestre=SalidaSemestre(data.get('semestre')),
            facultad_id=FacultadId(data.get('facultad_id')),
            programa_id=ProgramaId(data.get('programa_id')),
            num_estudiantes=SalidaNumEstudiantes(num_estudiantes),
            justificacion=SalidaJustificacion(data.get('justificacion')),
            estado=EstadoSalida(data.get('estado', EstadoSalida.BORRADOR.value)),
            profesor_id=ProfesorId(data.get('profesor_id', 1)),
            fecha_inicio=SalidaFechaInicio(data.get('fecha_inicio')),
            fecha_fin=SalidaFechaFin(data.get('fecha_fin')),
            hora_inicio=SalidaHoraInicio(data.get('hora_inicio')),
            hora_fin=SalidaHoraFin(data.get('hora_fin')),
            distancia_total_km=SalidaDistanciaTotalKm(distancia_total_km),
            duracion_dias=SalidaDuracionDias(duracion_dias),
            horas_viaje=SalidaHorasViaje(horas_viaje),
            costo_estimado=SalidaCostoEstimado(costo_estimado),
            vehiculos_asignados=SalidaVehiculosAsignados(data.get('vehiculos_asignados') or [])
        )
        return self.repository.save(salida_temp)
