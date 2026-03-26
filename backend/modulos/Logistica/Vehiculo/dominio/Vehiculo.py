from dataclasses import dataclass
from typing import Optional
from .VehiculoId import VehiculoId
from .VehiculoPlaca import VehiculoPlaca

@dataclass(frozen=True)
class Vehiculo:
    id: VehiculoId
    placa: VehiculoPlaca
    tipo: str
    marca: str
    modelo: str
    anio: int
    color: str
    numero_interno: str
    capacidad: int
    rendimiento_kmgal: float
    tipo_combustible: str
    propietario: str
    estado_tecnico: str
    notas: str
    foto_url: Optional[str] = None
