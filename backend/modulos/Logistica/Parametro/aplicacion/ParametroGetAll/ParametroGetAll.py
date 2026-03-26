from typing import List
from modulos.Logistica.Parametro.dominio.ParametroRepository import ParametroRepository

class ParametroGetAll:
    def __init__(self, repository: ParametroRepository):
        self.repository = repository

    def run(self, filtros: dict = None) -> List[dict]:
        parametros = self.repository.get_all(filtros)
        return [
            {
                "id": p.id.value,
                "clave": p.clave.value,
                "nombre": p.nombre.value,
                "valor": p.valor.value,
                "descripcion": p.descripcion.value if getattr(p, 'descripcion', None) and p.descripcion.value else None,
                "categoria": p.categoria.value
            }
            for p in parametros
        ]
