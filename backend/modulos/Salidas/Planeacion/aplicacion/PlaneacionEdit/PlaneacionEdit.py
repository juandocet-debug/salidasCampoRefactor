from modulos.Salidas.Planeacion.dominio.PlaneacionRepository import PlaneacionRepository
from modulos.Salidas.Planeacion.dominio.Planeacion import Planeacion
from modulos.Salidas.Planeacion.dominio.PlaneacionId import PlaneacionId
from modulos.Salidas.Planeacion.dominio.PlaneacionSalidaId import PlaneacionSalidaId
from modulos.Salidas.Planeacion.dominio.PlaneacionCompetencias import PlaneacionCompetencias
from modulos.Salidas.Planeacion.dominio.PlaneacionResultados import PlaneacionResultados
from modulos.Salidas.Planeacion.dominio.PlaneacionGuion import PlaneacionGuion
from modulos.Salidas.Planeacion.dominio.PlaneacionRequiereGuia import PlaneacionRequiereGuia

class PlaneacionEdit:
    def __init__(self, repository: PlaneacionRepository):
        self.repository = repository

    def run(self, id_planeacion: int, data: dict) -> Planeacion:
        existente = self.repository.get_by_id(id_planeacion)
        if not existente:
            raise ValueError(f"Planeacion con ID {id_planeacion} no existe.")

        actualizada = Planeacion(
            id=existente.id,
            salida_id=PlaneacionSalidaId(data.get('salida_id', existente.salida_id.value)),
            competencias=PlaneacionCompetencias(data.get('competencias', existente.competencias.value)),
            resultados=PlaneacionResultados(data.get('resultados', existente.resultados.value)),
            guion=PlaneacionGuion(data.get('guion', existente.guion.value)),
            requiere_guia=PlaneacionRequiereGuia(data.get('requiere_guia', existente.requiere_guia.value))
        )
        return self.repository.save(actualizada)
