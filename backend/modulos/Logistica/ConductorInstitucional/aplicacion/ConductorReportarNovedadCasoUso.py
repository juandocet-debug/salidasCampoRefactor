from ..dominio.IConductorAppRepository import IConductorAppRepository

class ConductorReportarNovedadCasoUso:
    def __init__(self, repository: IConductorAppRepository):
        self.repository = repository

    def run(self, conductor_id: str, salida_id: int, nivel: str, mensaje: str, foto: str = None) -> None:
        if not salida_id:
            raise ValueError("El ID de la salida es obligatorio.")
        if not mensaje or not mensaje.strip():
            raise ValueError("El mensaje de la novedad no puede estar vacío.")
        if nivel not in ['critica', 'alta', 'media', 'baja']:
            raise ValueError("Nivel de novedad inválido.")
            
        self.repository.reportar_novedad(conductor_id, salida_id, nivel, mensaje, foto)
