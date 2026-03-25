from dataclasses import dataclass
from .VentanaId import VentanaId
from .VentanaNombre import VentanaNombre
from .FechaApertura import FechaApertura
from .FechaCierre import FechaCierre
from .VentanaEstado import VentanaEstado

@dataclass
class Ventana:
    id: VentanaId
    nombre: VentanaNombre
    fecha_apertura: FechaApertura
    fecha_cierre: FechaCierre
    activa: VentanaEstado
