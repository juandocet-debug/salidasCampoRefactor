from ...dominio.Vehiculo import Vehiculo
from ...dominio.VehiculoId import VehiculoId
from ...dominio.VehiculoPlaca import VehiculoPlaca
from ...dominio.VehiculoRepository import VehiculoRepository

class VehiculoEdit:
    def __init__(self, repository: VehiculoRepository):
        self.repository = repository

    def run(self, id_val: str, placa: str, tipo: str, marca: str, modelo: str, anio: int, color: str, 
            numero_interno: str, capacidad: int, rendimiento_kmgal: float, tipo_combustible: str, 
            propietario: str, estado_tecnico: str, notas: str, foto_url: str = None) -> dict:

        id_obj = VehiculoId(id_val)
        vehiculo_existente = self.repository.get_by_id(id_obj)

        if not vehiculo_existente:
            raise ValueError("El vehículo a editar no existe.")

        placa_obj = VehiculoPlaca(placa) if placa else vehiculo_existente.placa

        # Tomar valores nuevos o conservar los existentes
        foto_final = foto_url if foto_url is not None else vehiculo_existente.foto_url
        if foto_url == "":  # Manejo explícito para borrar foto si se manda string vacío
            foto_final = None 

        vehiculo_actualizado = Vehiculo(
            id=id_obj,
            placa=placa_obj,
            tipo=tipo if tipo is not None else vehiculo_existente.tipo,
            marca=marca if marca is not None else vehiculo_existente.marca,
            modelo=modelo if modelo is not None else vehiculo_existente.modelo,
            anio=anio if anio is not None else vehiculo_existente.anio,
            color=color if color is not None else vehiculo_existente.color,
            numero_interno=numero_interno if numero_interno is not None else vehiculo_existente.numero_interno,
            capacidad=capacidad if capacidad is not None else vehiculo_existente.capacidad,
            rendimiento_kmgal=rendimiento_kmgal if rendimiento_kmgal is not None else vehiculo_existente.rendimiento_kmgal,
            tipo_combustible=tipo_combustible if tipo_combustible is not None else vehiculo_existente.tipo_combustible,
            propietario=propietario if propietario is not None else vehiculo_existente.propietario,
            estado_tecnico=estado_tecnico if estado_tecnico is not None else vehiculo_existente.estado_tecnico,
            notas=notas if notas is not None else vehiculo_existente.notas,
            foto_url=foto_final
        )

        guardado = self.repository.save(vehiculo_actualizado)

        return {
            "id": guardado.id.value,
            "placa": guardado.placa.value,
            "estado_tecnico": guardado.estado_tecnico
        }
