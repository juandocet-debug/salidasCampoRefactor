from ...dominio.GeneradorRutaIAPort import GeneradorRutaIAPort

class GenerarMunicipiosRuta:
    def __init__(self, ia_port: GeneradorRutaIAPort):
        self.ia_port = ia_port

    def run(self, inicio: str, fin: str, instrucciones: str) -> list:
        return self.ia_port.extraer_municipios_ruta(inicio, fin, instrucciones)
