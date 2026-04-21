from ...dominio.ProgramaRepository import ProgramaRepository

class ProgramaGetAll:
    def __init__(self, repository: ProgramaRepository, materia_repository=None):
        self.repository = repository
        self.materia_repository = materia_repository

    def run(self) -> list:
        programas = self.repository.get_all()
        resultado = []
        for p in programas:
            cantidad = 0
            if self.materia_repository:
                cantidad = len(self.materia_repository.get_by_programa_id(p.id.value))
            resultado.append({
                "id": p.id.value,
                "nombre": p.nombre.value,
                "facultad": p.facultad_id.value,
                "facultad_id": p.facultad_id.value,
                "facultad_nombre": p.facultad_nombre,
                "activo": p.activo.value,
                "estado": p.activo.value,  # Retrocompatibilidad con el grid de React
                "cantidad_materias": cantidad,
            })
        return resultado
