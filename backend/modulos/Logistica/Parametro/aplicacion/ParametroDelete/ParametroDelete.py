from modulos.Logistica.Parametro.dominio.ParametroId import ParametroId
from modulos.Logistica.Parametro.dominio.ParametroRepository import ParametroRepository

class ParametroDelete:
    def __init__(self, repository: ParametroRepository):
        self.repository = repository

    def run(self, id_val: str) -> None:
        p_id = ParametroId(id_val)
        existente = self.repository.get_by_id(p_id)
        if not existente:
            raise ValueError(f"Parámetro con ID {id_val} no encontrado.")
        self.repository.delete(p_id)
