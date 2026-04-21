from ...dominio.FacultadRepository import FacultadRepository

class FacultadGetAll:
    def __init__(self, repository: FacultadRepository, programa_repository=None):
        self.repository = repository
        self.programa_repository = programa_repository

    def run(self) -> list:
        facultades = self.repository.get_all()
        resultado = []
        for f in facultades:
            cantidad = 0
            if self.programa_repository:
                cantidad = len(self.programa_repository.get_by_facultad_id(f.id.value))
            resultado.append({
                "id": f.id.value,
                "nombre": f.nombre.value,
                "activa": f.activa.value,
                "estado": f.activa.value,  # Retrocompatibilidad con el grid de React
                "cantidad_programas": cantidad,
            })
        return resultado
