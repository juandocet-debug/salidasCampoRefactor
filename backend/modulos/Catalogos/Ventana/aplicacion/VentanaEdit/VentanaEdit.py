from typing import Optional
from ...dominio.Ventana import Ventana
from ...dominio.VentanaId import VentanaId
from ...dominio.VentanaNombre import VentanaNombre
from ...dominio.FechaApertura import FechaApertura
from ...dominio.FechaCierre import FechaCierre
from ...dominio.VentanaEstado import VentanaEstado
from ...dominio.VentanaRepository import VentanaRepository

class VentanaEdit:
    def __init__(self, repository: VentanaRepository):
        self.repository = repository

    def run(self, id_val: int, nombre: Optional[str] = None, fecha_apertura: Optional[str] = None, fecha_cierre: Optional[str] = None, activa: Optional[bool] = None) -> None:
        ventana_id = VentanaId(value=id_val)
        ventana = self.repository.get_by_id(ventana_id)
        
        if not ventana:
            raise ValueError(f"Ventana con ID {id_val} no encontrada")

        if nombre is not None:
            ventana.nombre = VentanaNombre(value=nombre)
        if fecha_apertura is not None:
            ventana.fecha_apertura = FechaApertura(value=fecha_apertura)
        if fecha_cierre is not None:
            ventana.fecha_cierre = FechaCierre(value=fecha_cierre)
        if activa is not None:
            ventana.activa = VentanaEstado(value=activa)
            
        self.repository.save(ventana)
