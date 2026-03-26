import uuid
from ...dominio.Vehiculo import Vehiculo
from ...dominio.VehiculoId import VehiculoId
from ...dominio.VehiculoPlaca import VehiculoPlaca
from ...dominio.VehiculoRepository import VehiculoRepository

class VehiculoCreate:
    def __init__(self, repository: VehiculoRepository):
        self.repository = repository

    def run(self, placa: str, tipo: str, marca: str, modelo: str, anio: int, color: str, 
            numero_interno: str, capacidad: int, rendimiento_kmgal: float, tipo_combustible: str, 
            propietario: str, estado_tecnico: str, notas: str, foto_url: str = None) -> dict:

        nuevo_id = VehiculoId(str(uuid.uuid4()))
        nueva_placa = VehiculoPlaca(placa)

        vehiculo = Vehiculo(
            id=nuevo_id,
            placa=nueva_placa,
            tipo=tipo,
            marca=marca,
            modelo=modelo,
            anio=anio,
            color=color,
            numero_interno=numero_interno,
            capacidad=capacidad,
            rendimiento_kmgal=rendimiento_kmgal,
            tipo_combustible=tipo_combustible,
            propietario=propietario,
            estado_tecnico=estado_tecnico,
            notas=notas,
            foto_url=foto_url
        )

        guardado = self.repository.save(vehiculo)

        return {
            "id": guardado.id.value,
            "placa": guardado.placa.value,
            "tipo": guardado.tipo,
            "marca": guardado.marca,
            "modelo": guardado.modelo,
            "anio": guardado.anio,
            "color": guardado.color,
            "numero_interno": guardado.numero_interno,
            "capacidad": guardado.capacidad,
            "rendimiento_kmgal": guardado.rendimiento_kmgal,
            "tipo_combustible": guardado.tipo_combustible,
            "propietario": guardado.propietario,
            "estado_tecnico": guardado.estado_tecnico,
            "notas": guardado.notas,
            "foto_url": guardado.foto_url
        }
