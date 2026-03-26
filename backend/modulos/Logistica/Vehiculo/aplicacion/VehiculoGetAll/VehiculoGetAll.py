from ...dominio.VehiculoRepository import VehiculoRepository

class VehiculoGetAll:
    def __init__(self, repository: VehiculoRepository):
        self.repository = repository

    def run(self, filtros: dict = None) -> list:
        vehiculos = self.repository.get_all(filtros)
        resultado = []
        for v in vehiculos:
            resultado.append({
                "id": v.id.value,
                "placa": v.placa.value,
                "tipo": v.tipo,
                "marca": v.marca,
                "modelo": v.modelo,
                "anio": v.anio,
                "color": v.color,
                "numero_interno": v.numero_interno,
                "capacidad": v.capacidad,
                "rendimiento_kmgal": v.rendimiento_kmgal,
                "tipo_combustible": v.tipo_combustible,
                "propietario": v.propietario,
                "estado_tecnico": v.estado_tecnico,
                "notas": v.notas,
                "foto_url": v.foto_url
            })
        return resultado
