from ...dominio.ProgramaRepository import ProgramaRepository

class ProgramaGetAll:
    def __init__(self, repository: ProgramaRepository):
        self.repository = repository

    def run(self) -> list:
        programas = self.repository.get_all()
        return [
            {
                "id": p.id.value,
                "nombre": p.nombre.value,
                "facultad": p.facultad_id.value,
                "facultad_nombre": p.facultad_nombre,
                "activo": p.activo.value,
                "estado": p.activo.value  # Retrocompatibilidad con el grid de React
            }
            for p in programas
        ]
