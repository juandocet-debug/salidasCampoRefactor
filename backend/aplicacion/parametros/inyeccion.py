from infraestructura.parametros.repositorio import (
    ParametrosRepositorioDjango,
    FacultadRepositorioDjango,
    ProgramaRepositorioDjango,
    VentanaRepositorioDjango
)
from aplicacion.parametros.obtener import ObtenerParametrosCasoUso
from aplicacion.parametros.obtener_catalogos import ObtenerCatalogosCasoUso
from aplicacion.parametros.gestionar_catalogos import CasoUsoFacultad, CasoUsoPrograma

def proveer_obtener_parametros():
    return ObtenerParametrosCasoUso(ParametrosRepositorioDjango())

def proveer_obtener_catalogos():
    return ObtenerCatalogosCasoUso(
        FacultadRepositorioDjango(),
        ProgramaRepositorioDjango(),
        VentanaRepositorioDjango()
    )

def proveer_gestionar_facultades():
    return CasoUsoFacultad(FacultadRepositorioDjango())

def proveer_gestionar_programas():
    return CasoUsoPrograma(ProgramaRepositorioDjango())
