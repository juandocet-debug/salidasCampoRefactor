from ...dominio.VentanaRepository import VentanaRepository

class VentanaGetAll:
    def __init__(self, repository: VentanaRepository):
        self.repository = repository

    def run(self) -> list:
        ventanas = self.repository.get_all()
        return [
            {
                "id": v.id.value,
                "nombre": v.nombre.value,
                "fecha_apertura": v.fecha_apertura.value,
                "fecha_cierre": v.fecha_cierre.value,
                "activa": v.activa.value,
                "estado": v.activa.value  # Retrocompatibilidad con el grid de React
            }
            for v in ventanas
        ]
