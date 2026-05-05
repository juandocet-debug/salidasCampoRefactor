from ..dominio.ILogisticaRepository import ILogisticaRepository
from ..dominio.ValueObjectsLogistica import AsignacionVehiculoDTO, NovedadOperativaDTO, CierreOperativoDTO

class AsignarVehiculoUseCase:
    def __init__(self, repository: ILogisticaRepository):
        self.repository = repository

    def ejecutar(self, dto: AsignacionVehiculoDTO) -> bool:
        # Validaciones de negocio puras
        if dto.costo_proyectado < 0:
            raise ValueError("El costo no puede ser negativo.")
        return self.repository.guardar_asignacion_vehiculo(dto)

class RegistrarNovedadUseCase:
    def __init__(self, repository: ILogisticaRepository):
        self.repository = repository

    def ejecutar(self, dto: NovedadOperativaDTO) -> bool:
        if not dto.mensaje.strip():
            raise ValueError("La novedad debe tener un mensaje descriptivo.")
        return self.repository.guardar_novedad_operativa(dto)

class RegistrarCierreOperativoUseCase:
    def __init__(self, repository: ILogisticaRepository):
        self.repository = repository

    def ejecutar(self, dto: CierreOperativoDTO) -> bool:
        if dto.km_final <= 0:
            raise ValueError("El kilometraje final debe ser válido.")
        return self.repository.guardar_cierre_operativo(dto)

class CambiarEstadoPreembarqueUseCase:
    def __init__(self, repository: ILogisticaRepository):
        self.repository = repository

    def ejecutar(self, salida_id: str) -> bool:
        from ..dominio.ValueObjectsLogistica import EstadoOperativoSalida
        return self.repository.actualizar_estado_operativo(salida_id, EstadoOperativoSalida.PREEMBARQUE.value)
