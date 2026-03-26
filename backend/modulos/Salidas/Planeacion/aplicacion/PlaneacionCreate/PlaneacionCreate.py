from modulos.Salidas.Planeacion.dominio.PlaneacionRepository import PlaneacionRepository
from modulos.Salidas.Planeacion.dominio.Planeacion import Planeacion
from modulos.Salidas.Planeacion.dominio.PlaneacionId import PlaneacionId
from modulos.Salidas.Planeacion.dominio.PlaneacionSalidaId import PlaneacionSalidaId
from modulos.Salidas.Planeacion.dominio.PlaneacionCompetencias import PlaneacionCompetencias
from modulos.Salidas.Planeacion.dominio.PlaneacionResultados import PlaneacionResultados
from modulos.Salidas.Planeacion.dominio.PlaneacionGuion import PlaneacionGuion
from modulos.Salidas.Planeacion.dominio.PlaneacionRequiereGuia import PlaneacionRequiereGuia

class PlaneacionCreate:
    def __init__(self, repository: PlaneacionRepository):
        self.repository = repository

    def run(self, data: dict) -> Planeacion:
        planeacion_temp = Planeacion(
            id=PlaneacionId(data.get('id', None)),
            salida_id=PlaneacionSalidaId(data.get('salida_id')),
            competencias=PlaneacionCompetencias(data.get('competencias')),
            resultados=PlaneacionResultados(data.get('resultados')),
            guion=PlaneacionGuion(data.get('guion')),
            requiere_guia=PlaneacionRequiereGuia(data.get('requiere_guia', False))
        )
        return self.repository.save(planeacion_temp)
