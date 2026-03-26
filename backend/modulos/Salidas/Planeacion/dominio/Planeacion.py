from dataclasses import dataclass
from modulos.Salidas.Planeacion.dominio.PlaneacionId import PlaneacionId
from modulos.Salidas.Planeacion.dominio.PlaneacionSalidaId import PlaneacionSalidaId
from modulos.Salidas.Planeacion.dominio.PlaneacionCompetencias import PlaneacionCompetencias
from modulos.Salidas.Planeacion.dominio.PlaneacionResultados import PlaneacionResultados
from modulos.Salidas.Planeacion.dominio.PlaneacionGuion import PlaneacionGuion
from modulos.Salidas.Planeacion.dominio.PlaneacionRequiereGuia import PlaneacionRequiereGuia

@dataclass
class Planeacion:
    id: PlaneacionId
    salida_id: PlaneacionSalidaId
    competencias: PlaneacionCompetencias
    resultados: PlaneacionResultados
    guion: PlaneacionGuion
    requiere_guia: PlaneacionRequiereGuia
