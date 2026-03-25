from ...dominio.Ventana import Ventana
from ...dominio.VentanaId import VentanaId
from ...dominio.VentanaNombre import VentanaNombre
from ...dominio.FechaApertura import FechaApertura
from ...dominio.FechaCierre import FechaCierre
from ...dominio.VentanaEstado import VentanaEstado
from ...dominio.VentanaRepository import VentanaRepository

class VentanaCreate:
    def __init__(self, repository: VentanaRepository):
        self.repository = repository

    def run(self, nombre: str, fecha_apertura: str, fecha_cierre: str, activa: bool) -> None:
        ventana = Ventana(
            id=VentanaId(None),
            nombre=VentanaNombre(nombre),
            fecha_apertura=FechaApertura(fecha_apertura),
            fecha_cierre=FechaCierre(fecha_cierre),
            activa=VentanaEstado(activa)
        )
        self.repository.save(ventana)
