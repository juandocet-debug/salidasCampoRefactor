from modulos.Salidas.Itinerario.dominio.GeneradorRutaIAPort import GeneradorRutaIAPort

class EstimarTiempoRuta:
    def __init__(self, ia_port: GeneradorRutaIAPort):
        self.ia_port = ia_port

    def run(self, origen: str, destino: str) -> dict:
        if not origen or not destino:
            raise ValueError("Origen y destino son requeridos para estimación de tiempo")
        return self.ia_port.estimar_tiempo_ruta(origen, destino)
