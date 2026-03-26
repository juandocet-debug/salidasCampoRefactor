from modulos.Salidas.Itinerario.dominio.GeneradorRutaIAPort import GeneradorRutaIAPort

class AsistenteViajeIA:
    """
    Caso de uso que consulta a la IA basándose en los datos de la ruta.
    Orquesta la solicitud hacia el puerto de infraestructura.
    """
    def __init__(self, ia_port: GeneradorRutaIAPort):
        self.ia_port = ia_port

    def run(self, contexto_ruta: str) -> str:
        respuesta = self.ia_port.consultar_asistencia_ruta(contexto_ruta)
        if not respuesta:
            return "No se pudo conectar con el motor de I.A. de mapas en este momento."
        return respuesta
