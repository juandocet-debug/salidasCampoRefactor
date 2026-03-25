from ...dominio.FacultadRepository import FacultadRepository

class FacultadGetAll:
    def __init__(self, repository: FacultadRepository):
        self.repository = repository

    def run(self) -> list:
        facultades = self.repository.get_all()
        return [
            {
                "id": f.id.value,
                "nombre": f.nombre.value,
                "activa": f.activa.value,
                "estado": f.activa.value  # Retrocompatibilidad con el grid de React
            }
            for f in facultades
        ]
