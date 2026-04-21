from typing import Optional
from ...dominio.MateriaRepository import MateriaRepository

class MateriaGetAll:
    def __init__(self, repository: MateriaRepository):
        self.repository = repository

    def run(self, programa_id: Optional[int] = None) -> list:
        if programa_id is not None:
            materias = self.repository.get_by_programa_id(programa_id)
        else:
            materias = self.repository.get_all()

        return [
            {
                "id": m.id.value,
                "nombre": m.nombre.value,
                "codigo": m.codigo.value,
                "activa": m.activa.value,
                "programa_id": m.programa_id,
                "programa_nombre": m.programa_nombre,
            }
            for m in materias
        ]
